/*
 * AUTO ANNOTATION
 * File: src/shared/operator-scope-compat.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const OPERATOR_ROLE = "operator";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const OPERATOR_ADMIN_SCOPE = "operator.admin";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const OPERATOR_READ_SCOPE = "operator.read";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const OPERATOR_WRITE_SCOPE = "operator.write";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const OPERATOR_SCOPE_PREFIX = "operator.";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function normalizeScopeList(scopes: readonly string[]): string[] {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const out = new Set<string>();
  for (const scope of scopes) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const trimmed = scope.trim();
    if (trimmed) {
      out.add(trimmed);
    }
  }
  return [...out];
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function operatorScopeSatisfied(requestedScope: string, granted: Set<string>): boolean {
  if (granted.has(OPERATOR_ADMIN_SCOPE) && requestedScope.startsWith(OPERATOR_SCOPE_PREFIX)) {
    return true;
  }
  if (requestedScope === OPERATOR_READ_SCOPE) {
    return granted.has(OPERATOR_READ_SCOPE) || granted.has(OPERATOR_WRITE_SCOPE);
  }
  if (requestedScope === OPERATOR_WRITE_SCOPE) {
    return granted.has(OPERATOR_WRITE_SCOPE);
  }
  return granted.has(requestedScope);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function roleScopesAllow(params: {
  role: string;
  requestedScopes: readonly string[];
  allowedScopes: readonly string[];
}): boolean {
  const requested = normalizeScopeList(params.requestedScopes);
  if (requested.length === 0) {
    return true;
  }
  const allowed = normalizeScopeList(params.allowedScopes);
  if (allowed.length === 0) {
    return false;
  }
  const allowedSet = new Set(allowed);
  if (params.role.trim() !== OPERATOR_ROLE) {
    return requested.every((scope) => allowedSet.has(scope));
  }
  return requested.every((scope) => operatorScopeSatisfied(scope, allowedSet));
}
