/*
 * AUTO ANNOTATION
 * File: src/cli/daemon-cli/status.gather.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import {
  createConfigIO,
  resolveConfigPath,
  resolveGatewayPort,
  resolveStateDir,
} from "../../config/config.js";
import type { GatewayBindMode, GatewayControlUiConfig } from "../../config/types.js";
import { readLastGatewayErrorLine } from "../../daemon/diagnostics.js";
import type { FindExtraGatewayServicesOptions } from "../../daemon/inspect.js";
import { findExtraGatewayServices } from "../../daemon/inspect.js";
import type { ServiceConfigAudit } from "../../daemon/service-audit.js";
import { auditGatewayServiceConfig } from "../../daemon/service-audit.js";
import { resolveGatewayService } from "../../daemon/service.js";
import { resolveGatewayBindHost } from "../../gateway/net.js";
import {
  formatPortDiagnostics,
  inspectPortUsage,
  type PortListener,
  type PortUsageStatus,
} from "../../infra/ports.js";
import { pickPrimaryTailnetIPv4 } from "../../infra/tailnet.js";
import { probeGatewayStatus } from "./probe.js";
import { normalizeListenerAddress, parsePortFromArgs, pickProbeHostForBind } from "./shared.js";
import type { GatewayRpcOpts } from "./types.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type ConfigSummary = {
  path: string;
  exists: boolean;
  valid: boolean;
  issues?: Array<{ path: string; message: string }>;
  controlUi?: GatewayControlUiConfig;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type GatewayStatusSummary = {
  bindMode: GatewayBindMode;
  bindHost: string;
  customBindHost?: string;
  port: number;
  portSource: "service args" | "env/config";
  probeUrl: string;
  probeNote?: string;
};

export type DaemonStatus = {
  service: {
    label: string;
    loaded: boolean;
    loadedText: string;
    notLoadedText: string;
    command?: {
      programArguments: string[];
      workingDirectory?: string;
      environment?: Record<string, string>;
      sourcePath?: string;
    } | null;
    runtime?: {
      status?: string;
      state?: string;
      subState?: string;
      pid?: number;
      lastExitStatus?: number;
      lastExitReason?: string;
      lastRunResult?: string;
      lastRunTime?: string;
      detail?: string;
      cachedLabel?: boolean;
      missingUnit?: boolean;
    };
    configAudit?: ServiceConfigAudit;
  };
  config?: {
    cli: ConfigSummary;
    daemon?: ConfigSummary;
    mismatch?: boolean;
  };
  gateway?: GatewayStatusSummary;
  port?: {
    port: number;
    status: PortUsageStatus;
    listeners: PortListener[];
    hints: string[];
  };
  portCli?: {
    port: number;
    status: PortUsageStatus;
    listeners: PortListener[];
    hints: string[];
  };
  lastError?: string;
  rpc?: {
    ok: boolean;
    error?: string;
    url?: string;
  };
  extraServices: Array<{ label: string; detail: string; scope: string }>;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function shouldReportPortUsage(status: PortUsageStatus | undefined, rpcOk?: boolean) {
  if (status !== "busy") {
    return false;
  }
  if (rpcOk === true) {
    return false;
  }
  return true;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function gatherDaemonStatus(
  opts: {
    rpc: GatewayRpcOpts;
    probe: boolean;
    deep?: boolean;
  } & FindExtraGatewayServicesOptions,
): Promise<DaemonStatus> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const service = resolveGatewayService();
  const [loaded, command, runtime] = await Promise.all([
    service.isLoaded({ env: process.env }).catch(() => false),
    service.readCommand(process.env).catch(() => null),
    service.readRuntime(process.env).catch((err) => ({ status: "unknown", detail: String(err) })),
  ]);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const configAudit = await auditGatewayServiceConfig({
    env: process.env,
    command,
  });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const serviceEnv = command?.environment ?? undefined;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const mergedDaemonEnv = {
    ...(process.env as Record<string, string | undefined>),
    ...(serviceEnv ?? undefined),
  } satisfies Record<string, string | undefined>;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const cliConfigPath = resolveConfigPath(process.env, resolveStateDir(process.env));
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const daemonConfigPath = resolveConfigPath(
    mergedDaemonEnv as NodeJS.ProcessEnv,
    resolveStateDir(mergedDaemonEnv as NodeJS.ProcessEnv),
  );

  const cliIO = createConfigIO({ env: process.env, configPath: cliConfigPath });
  const daemonIO = createConfigIO({
    env: mergedDaemonEnv,
    configPath: daemonConfigPath,
  });

  const [cliSnapshot, daemonSnapshot] = await Promise.all([
    cliIO.readConfigFileSnapshot().catch(() => null),
    daemonIO.readConfigFileSnapshot().catch(() => null),
  ]);
  const cliCfg = cliIO.loadConfig();
  const daemonCfg = daemonIO.loadConfig();

  const cliConfigSummary: ConfigSummary = {
    path: cliSnapshot?.path ?? cliConfigPath,
    exists: cliSnapshot?.exists ?? false,
    valid: cliSnapshot?.valid ?? true,
    ...(cliSnapshot?.issues?.length ? { issues: cliSnapshot.issues } : {}),
    controlUi: cliCfg.gateway?.controlUi,
  };
  const daemonConfigSummary: ConfigSummary = {
    path: daemonSnapshot?.path ?? daemonConfigPath,
    exists: daemonSnapshot?.exists ?? false,
    valid: daemonSnapshot?.valid ?? true,
    ...(daemonSnapshot?.issues?.length ? { issues: daemonSnapshot.issues } : {}),
    controlUi: daemonCfg.gateway?.controlUi,
  };
  const configMismatch = cliConfigSummary.path !== daemonConfigSummary.path;

  const portFromArgs = parsePortFromArgs(command?.programArguments);
  const daemonPort = portFromArgs ?? resolveGatewayPort(daemonCfg, mergedDaemonEnv);
  const portSource: GatewayStatusSummary["portSource"] = portFromArgs
    ? "service args"
    : "env/config";

  const bindMode = (daemonCfg.gateway?.bind ?? "loopback") as
    | "auto"
    | "lan"
    | "loopback"
    | "custom"
    | "tailnet";
  const customBindHost = daemonCfg.gateway?.customBindHost;
  const bindHost = await resolveGatewayBindHost(bindMode, customBindHost);
  const tailnetIPv4 = pickPrimaryTailnetIPv4();
  const probeHost = pickProbeHostForBind(bindMode, tailnetIPv4, customBindHost);
  const probeUrlOverride =
    typeof opts.rpc.url === "string" && opts.rpc.url.trim().length > 0 ? opts.rpc.url.trim() : null;
  const probeUrl = probeUrlOverride ?? `ws://${probeHost}:${daemonPort}`;
  const probeNote =
    !probeUrlOverride && bindMode === "lan"
      ? `bind=lan listens on 0.0.0.0 (all interfaces); probing via ${probeHost}.`
      : !probeUrlOverride && bindMode === "loopback"
        ? "Loopback-only gateway; only local clients can connect."
        : undefined;

  const cliPort = resolveGatewayPort(cliCfg, process.env);
  const [portDiagnostics, portCliDiagnostics] = await Promise.all([
    inspectPortUsage(daemonPort).catch(() => null),
    cliPort !== daemonPort ? inspectPortUsage(cliPort).catch(() => null) : null,
  ]);
  const portStatus: DaemonStatus["port"] | undefined = portDiagnostics
    ? {
        port: portDiagnostics.port,
        status: portDiagnostics.status,
        listeners: portDiagnostics.listeners,
        hints: portDiagnostics.hints,
      }
    : undefined;
  const portCliStatus: DaemonStatus["portCli"] | undefined = portCliDiagnostics
    ? {
        port: portCliDiagnostics.port,
        status: portCliDiagnostics.status,
        listeners: portCliDiagnostics.listeners,
        hints: portCliDiagnostics.hints,
      }
    : undefined;

  const extraServices = await findExtraGatewayServices(
    process.env as Record<string, string | undefined>,
    { deep: Boolean(opts.deep) },
  ).catch(() => []);

  const timeoutMsRaw = Number.parseInt(String(opts.rpc.timeout ?? "10000"), 10);
  const timeoutMs = Number.isFinite(timeoutMsRaw) && timeoutMsRaw > 0 ? timeoutMsRaw : 10_000;

  const rpc = opts.probe
    ? await probeGatewayStatus({
        url: probeUrl,
        token:
          opts.rpc.token ||
          mergedDaemonEnv.OPENCLAW_GATEWAY_TOKEN ||
          daemonCfg.gateway?.auth?.token,
        password:
          opts.rpc.password ||
          mergedDaemonEnv.OPENCLAW_GATEWAY_PASSWORD ||
          daemonCfg.gateway?.auth?.password,
        timeoutMs,
        json: opts.rpc.json,
        configPath: daemonConfigSummary.path,
      })
    : undefined;

  let lastError: string | undefined;
  if (loaded && runtime?.status === "running" && portStatus && portStatus.status !== "busy") {
    lastError = (await readLastGatewayErrorLine(mergedDaemonEnv as NodeJS.ProcessEnv)) ?? undefined;
  }

  return {
    service: {
      label: service.label,
      loaded,
      loadedText: service.loadedText,
      notLoadedText: service.notLoadedText,
      command,
      runtime,
      configAudit,
    },
    config: {
      cli: cliConfigSummary,
      daemon: daemonConfigSummary,
      ...(configMismatch ? { mismatch: true } : {}),
    },
    gateway: {
      bindMode,
      bindHost,
      customBindHost,
      port: daemonPort,
      portSource,
      probeUrl,
      ...(probeNote ? { probeNote } : {}),
    },
    port: portStatus,
    ...(portCliStatus ? { portCli: portCliStatus } : {}),
    lastError,
    ...(rpc ? { rpc: { ...rpc, url: probeUrl } } : {}),
    extraServices,
  };
}

export function renderPortDiagnosticsForCli(status: DaemonStatus, rpcOk?: boolean): string[] {
  if (!status.port || !shouldReportPortUsage(status.port.status, rpcOk)) {
    return [];
  }
  return formatPortDiagnostics({
    port: status.port.port,
    status: status.port.status,
    listeners: status.port.listeners,
    hints: status.port.hints,
  });
}

export function resolvePortListeningAddresses(status: DaemonStatus): string[] {
  const addrs = Array.from(
    new Set(
      status.port?.listeners
        ?.map((l) => (l.address ? normalizeListenerAddress(l.address) : ""))
        .filter((v): v is string => Boolean(v)) ?? [],
    ),
  );
  return addrs;
}
