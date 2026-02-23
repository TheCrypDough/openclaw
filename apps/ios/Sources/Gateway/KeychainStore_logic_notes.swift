/*
 * AUTO ANNOTATION
 * File: apps/ios/Sources/Gateway/KeychainStore.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Foundation
import Security

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
enum KeychainStore {
    static func loadString(service: String, account: String) -> String? {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: service,
            kSecAttrAccount as String: account,
            kSecReturnData as String: true,
            kSecMatchLimit as String: kSecMatchLimitOne,
        ]

        var item: CFTypeRef?
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let status = SecItemCopyMatching(query as CFDictionary, &item)
        guard status == errSecSuccess, let data = item as? Data else { return nil }
        return String(data: data, encoding: .utf8)
    }

    static func saveString(_ value: String, service: String, account: String) -> Bool {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let data = Data(value.utf8)
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: service,
            kSecAttrAccount as String: account,
        ]

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let update: [String: Any] = [kSecValueData as String: data]
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let status = SecItemUpdate(query as CFDictionary, update as CFDictionary)
        if status == errSecSuccess { return true }
        if status != errSecItemNotFound { return false }

        var insert = query
        insert[kSecValueData as String] = data
        insert[kSecAttrAccessible as String] = kSecAttrAccessibleAfterFirstUnlockThisDeviceOnly
        return SecItemAdd(insert as CFDictionary, nil) == errSecSuccess
    }

    static func delete(service: String, account: String) -> Bool {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: service,
            kSecAttrAccount as String: account,
        ]
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let status = SecItemDelete(query as CFDictionary)
        return status == errSecSuccess || status == errSecItemNotFound
    }
}
