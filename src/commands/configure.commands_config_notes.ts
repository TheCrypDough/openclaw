# AUTOPLACEHOLDER_ANNOTATION: src/commands/configure.commands.ts
# Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
# Area: Core application source (gateway, CLI, providers, channels)
# System effect: When changed, core execution path for message, session, or provider behavior may change.
import type { RuntimeEnv } from "../runtime.js";
import { defaultRuntime } from "../runtime.js";
import type { WizardSection } from "./configure.shared.js";
import { CONFIGURE_WIZARD_SECTIONS, parseConfigureWizardSections } from "./configure.shared.js";
import { runConfigureWizard } from "./configure.wizard.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function configureCommand(runtime: RuntimeEnv = defaultRuntime) {
  await runConfigureWizard({ command: "configure" }, runtime);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function configureCommandWithSections(
  sections: WizardSection[],
  runtime: RuntimeEnv = defaultRuntime,
) {
  await runConfigureWizard({ command: "configure", sections }, runtime);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function configureCommandFromSectionsArg(
  rawSections: unknown,
  runtime: RuntimeEnv = defaultRuntime,
): Promise<void> {
  const { sections, invalid } = parseConfigureWizardSections(rawSections);
  if (sections.length === 0) {
    await configureCommand(runtime);
    return;
  }

  if (invalid.length > 0) {
    runtime.error(
      `Invalid --section: ${invalid.join(", ")}. Expected one of: ${CONFIGURE_WIZARD_SECTIONS.join(", ")}.`,
    );
    runtime.exit(1);
    return;
  }

  await configureCommandWithSections(sections as never, runtime);
}
