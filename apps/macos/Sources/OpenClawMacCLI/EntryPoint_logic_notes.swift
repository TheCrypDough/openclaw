/*
 * AUTO ANNOTATION
 * File: apps/macos/Sources/OpenClawMacCLI/EntryPoint.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Foundation

private struct RootCommand {
    var name: String
    var args: [String]
}

@main
struct OpenClawMacCLI {
    static func main() async {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let args = Array(CommandLine.arguments.dropFirst())
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let command = parseRootCommand(args)
        switch command?.name {
        case nil:
            printUsage()
        case "-h", "--help", "help":
            printUsage()
        case "connect":
            await runConnect(command?.args ?? [])
        case "discover":
            await runDiscover(command?.args ?? [])
        case "wizard":
            await runWizardCommand(command?.args ?? [])
        default:
            fputs("openclaw-mac: unknown command\n", stderr)
            printUsage()
            exit(1)
        }
    }
}

private func parseRootCommand(_ args: [String]) -> RootCommand? {
    guard let first = args.first else { return nil }
    return RootCommand(name: first, args: Array(args.dropFirst()))
}

private func printUsage() {
    print("""
    openclaw-mac

    Usage:
      openclaw-mac connect [--url <ws://host:port>] [--token <token>] [--password <password>]
                           [--mode <local|remote>] [--timeout <ms>] [--probe] [--json]
                           [--client-id <id>] [--client-mode <mode>] [--display-name <name>]
                           [--role <role>] [--scopes <a,b,c>]
      openclaw-mac discover [--timeout <ms>] [--json] [--include-local]
      openclaw-mac wizard [--url <ws://host:port>] [--token <token>] [--password <password>]
                          [--mode <local|remote>] [--workspace <path>] [--json]

    Examples:
      openclaw-mac connect
      openclaw-mac connect --url ws://127.0.0.1:18789 --json
      openclaw-mac discover --timeout 3000 --json
      openclaw-mac wizard --mode local
    """)
}
