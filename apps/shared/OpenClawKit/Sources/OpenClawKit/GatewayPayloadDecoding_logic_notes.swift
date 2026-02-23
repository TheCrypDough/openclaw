/*
 * AUTO ANNOTATION
 * File: apps/shared/OpenClawKit/Sources/OpenClawKit/GatewayPayloadDecoding.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import OpenClawProtocol
import Foundation

public enum GatewayPayloadDecoding {
    public static func decode<T: Decodable>(
        _ payload: AnyCodable,
        as _: T.Type = T.self) throws -> T
    {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let data = try JSONEncoder().encode(payload)
        return try JSONDecoder().decode(T.self, from: data)
    }

    public static func decodeIfPresent<T: Decodable>(
        _ payload: AnyCodable?,
        as _: T.Type = T.self) throws -> T?
    {
        guard let payload else { return nil }
        return try self.decode(payload, as: T.self)
    }
}
