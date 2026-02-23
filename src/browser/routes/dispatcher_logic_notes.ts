/*
 * AUTO ANNOTATION
 * File: src/browser/routes/dispatcher.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { escapeRegExp } from "../../utils.js";
import type { BrowserRouteContext } from "../server-context.js";
import { registerBrowserRoutes } from "./index.js";
import type { BrowserRequest, BrowserResponse, BrowserRouteRegistrar } from "./types.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type BrowserDispatchRequest = {
  method: "GET" | "POST" | "DELETE";
  path: string;
  query?: Record<string, unknown>;
  body?: unknown;
  signal?: AbortSignal;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type BrowserDispatchResponse = {
  status: number;
  body: unknown;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type RouteEntry = {
  method: BrowserDispatchRequest["method"];
  path: string;
  regex: RegExp;
  paramNames: string[];
  handler: (req: BrowserRequest, res: BrowserResponse) => void | Promise<void>;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function compileRoute(path: string): { regex: RegExp; paramNames: string[] } {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const paramNames: string[] = [];
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const parts = path.split("/").map((part) => {
    if (part.startsWith(":")) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const name = part.slice(1);
      paramNames.push(name);
      return "([^/]+)";
    }
    return escapeRegExp(part);
  });
  return { regex: new RegExp(`^${parts.join("/")}$`), paramNames };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function createRegistry() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const routes: RouteEntry[] = [];
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const register =
    (method: RouteEntry["method"]) => (path: string, handler: RouteEntry["handler"]) => {
      const { regex, paramNames } = compileRoute(path);
      routes.push({ method, path, regex, paramNames, handler });
    };
  const router: BrowserRouteRegistrar = {
    get: register("GET"),
    post: register("POST"),
    delete: register("DELETE"),
  };
  return { routes, router };
}

function normalizePath(path: string) {
  if (!path) {
    return "/";
  }
  return path.startsWith("/") ? path : `/${path}`;
}

export function createBrowserRouteDispatcher(ctx: BrowserRouteContext) {
  const registry = createRegistry();
  registerBrowserRoutes(registry.router, ctx);

  return {
    dispatch: async (req: BrowserDispatchRequest): Promise<BrowserDispatchResponse> => {
      const method = req.method;
      const path = normalizePath(req.path);
      const query = req.query ?? {};
      const body = req.body;
      const signal = req.signal;

      const match = registry.routes.find((route) => {
        if (route.method !== method) {
          return false;
        }
        return route.regex.test(path);
      });
      if (!match) {
        return { status: 404, body: { error: "Not Found" } };
      }

      const exec = match.regex.exec(path);
      const params: Record<string, string> = {};
      if (exec) {
        for (const [idx, name] of match.paramNames.entries()) {
          const value = exec[idx + 1];
          if (typeof value === "string") {
            params[name] = decodeURIComponent(value);
          }
        }
      }

      let status = 200;
      let payload: unknown = undefined;
      const res: BrowserResponse = {
        status(code) {
          status = code;
          return res;
        },
        json(bodyValue) {
          payload = bodyValue;
        },
      };

      try {
        await match.handler(
          {
            params,
            query,
            body,
            signal,
          },
          res,
        );
      } catch (err) {
        return { status: 500, body: { error: String(err) } };
      }

      return { status, body: payload };
    },
  };
}

export type { BrowserDispatchRequest, BrowserDispatchResponse };
