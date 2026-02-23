/*
 * AUTO ANNOTATION
 * File: extensions/irc/src/connect-options.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { ResolvedIrcAccount } from "./accounts.js";
import type { IrcClientOptions } from "./client.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type IrcConnectOverrides = Omit<
  Partial<IrcClientOptions>,
  "host" | "port" | "tls" | "nick" | "username" | "realname" | "password" | "nickserv"
>;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function buildIrcConnectOptions(
  account: ResolvedIrcAccount,
  overrides: IrcConnectOverrides = {},
): IrcClientOptions {
  return {
    host: account.host,
    port: account.port,
    tls: account.tls,
    nick: account.nick,
    username: account.username,
    realname: account.realname,
    password: account.password,
    nickserv: {
      enabled: account.config.nickserv?.enabled,
      service: account.config.nickserv?.service,
      password: account.config.nickserv?.password,
      register: account.config.nickserv?.register,
      registerEmail: account.config.nickserv?.registerEmail,
    },
    ...overrides,
  };
}
