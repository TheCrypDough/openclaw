/*
 * AUTO ANNOTATION
 * File: apps/shared/OpenClawKit/Sources/OpenClawKit/CanvasA2UIAction.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Foundation

public enum OpenClawCanvasA2UIAction: Sendable {
    public struct AgentMessageContext: Sendable {
        public struct Session: Sendable {
            public var key: String
            public var surfaceId: String

            public init(key: String, surfaceId: String) {
                self.key = key
                self.surfaceId = surfaceId
            }
        }

        public struct Component: Sendable {
            public var id: String
            public var host: String
            public var instanceId: String

            public init(id: String, host: String, instanceId: String) {
                self.id = id
                self.host = host
                self.instanceId = instanceId
            }
        }

        public var actionName: String
        public var session: Session
        public var component: Component
        public var contextJSON: String?

        public init(actionName: String, session: Session, component: Component, contextJSON: String?) {
            self.actionName = actionName
            self.session = session
            self.component = component
            self.contextJSON = contextJSON
        }
    }

    public static func extractActionName(_ userAction: [String: Any]) -> String? {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let keys = ["name", "action"]
        for key in keys {
            if let raw = userAction[key] as? String {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
                let trimmed = raw.trimmingCharacters(in: .whitespacesAndNewlines)
                if !trimmed.isEmpty { return trimmed }
            }
        }
        return nil
    }

    public static func sanitizeTagValue(_ value: String) -> String {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let trimmed = value.trimmingCharacters(in: .whitespacesAndNewlines)
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let nonEmpty = trimmed.isEmpty ? "-" : trimmed
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let normalized = nonEmpty.replacingOccurrences(of: " ", with: "_")
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let allowed = CharacterSet(charactersIn: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-.:")
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let scalars = normalized.unicodeScalars.map { allowed.contains($0) ? Character($0) : "_" }
        return String(scalars)
    }

    public static func compactJSON(_ obj: Any?) -> String? {
        guard let obj else { return nil }
        guard JSONSerialization.isValidJSONObject(obj) else { return nil }
        guard let data = try? JSONSerialization.data(withJSONObject: obj, options: []),
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
              let str = String(data: data, encoding: .utf8)
        else { return nil }
        return str
    }

    public static func formatAgentMessage(_ context: AgentMessageContext) -> String {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let ctxSuffix = context.contextJSON.flatMap { $0.isEmpty ? nil : " ctx=\($0)" } ?? ""
        return [
            "CANVAS_A2UI",
            "action=\(self.sanitizeTagValue(context.actionName))",
            "session=\(self.sanitizeTagValue(context.session.key))",
            "surface=\(self.sanitizeTagValue(context.session.surfaceId))",
            "component=\(self.sanitizeTagValue(context.component.id))",
            "host=\(self.sanitizeTagValue(context.component.host))",
            "instance=\(self.sanitizeTagValue(context.component.instanceId))\(ctxSuffix)",
            "default=update_canvas",
        ].joined(separator: " ")
    }

    public static func jsDispatchA2UIActionStatus(actionId: String, ok: Bool, error: String?) -> String {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let payload: [String: Any] = [
            "id": actionId,
            "ok": ok,
            "error": error ?? "",
        ]
        let json: String = {
            if let data = try? JSONSerialization.data(withJSONObject: payload, options: []),
               let str = String(data: data, encoding: .utf8)
            {
                return str
            }
            return "{\"id\":\"\(actionId)\",\"ok\":\(ok ? "true" : "false"),\"error\":\"\"}"
        }()
        return """
        (() => {
          const detail = \(json);
          window.dispatchEvent(new CustomEvent('openclaw:a2ui-action-status', { detail }));
        })();
        """
    }
}
