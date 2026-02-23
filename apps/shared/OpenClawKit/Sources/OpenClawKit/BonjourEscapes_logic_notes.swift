/*
 * AUTO ANNOTATION
 * File: apps/shared/OpenClawKit/Sources/OpenClawKit/BonjourEscapes.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Foundation

public enum BonjourEscapes {
    /// mDNS / DNS-SD commonly escapes bytes in instance names as `\DDD` (decimal-encoded),
    /// e.g. spaces are `\032`.
    public static func decode(_ input: String) -> String {
        var out = ""
        var i = input.startIndex
        while i < input.endIndex {
            if input[i] == "\\",
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
               let d0 = input.index(i, offsetBy: 1, limitedBy: input.index(before: input.endIndex)),
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
               let d1 = input.index(i, offsetBy: 2, limitedBy: input.index(before: input.endIndex)),
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
               let d2 = input.index(i, offsetBy: 3, limitedBy: input.index(before: input.endIndex)),
               input[d0].isNumber,
               input[d1].isNumber,
               input[d2].isNumber
            {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
                let digits = String(input[d0...d2])
                if let value = Int(digits),
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
                   let scalar = UnicodeScalar(value)
                {
                    out.append(Character(scalar))
                    i = input.index(i, offsetBy: 4)
                    continue
                }
            }

            out.append(input[i])
            i = input.index(after: i)
        }
        return out
    }
}
