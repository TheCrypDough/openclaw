/*
 * AUTO ANNOTATION
 * File: apps/ios/Sources/Media/PhotoLibraryService.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Foundation
import Photos
import OpenClawKit
import UIKit

final class PhotoLibraryService: PhotosServicing {
    // The gateway WebSocket has a max payload size; returning large base64 blobs
    // can cause the gateway to close the connection. Keep photo payloads small
    // enough to safely fit in a single RPC frame.
    //
    // This is a transport constraint (not a security policy). If callers need
    // full-resolution media, we should switch to an HTTP media handle flow.
    private static let maxTotalBase64Chars = 340 * 1024
    private static let maxPerPhotoBase64Chars = 300 * 1024

    func latest(params: OpenClawPhotosLatestParams) async throws -> OpenClawPhotosLatestPayload {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let status = await Self.ensureAuthorization()
        guard status == .authorized || status == .limited else {
            throw NSError(domain: "Photos", code: 1, userInfo: [
                NSLocalizedDescriptionKey: "PHOTOS_PERMISSION_REQUIRED: grant Photos permission",
            ])
        }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let limit = max(1, min(params.limit ?? 1, 20))
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let fetchOptions = PHFetchOptions()
        fetchOptions.fetchLimit = limit
        fetchOptions.sortDescriptors = [NSSortDescriptor(key: "creationDate", ascending: false)]
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let assets = PHAsset.fetchAssets(with: .image, options: fetchOptions)

        var results: [OpenClawPhotoPayload] = []
        var remainingBudget = Self.maxTotalBase64Chars
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let maxWidth = params.maxWidth.flatMap { $0 > 0 ? $0 : nil } ?? 1600
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let quality = params.quality.map { max(0.1, min(1.0, $0)) } ?? 0.85
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let formatter = ISO8601DateFormatter()

        assets.enumerateObjects { asset, _, stop in
            if results.count >= limit { stop.pointee = true; return }
            if let payload = try? Self.renderAsset(
                asset,
                maxWidth: maxWidth,
                quality: quality,
                formatter: formatter)
            {
                // Keep the entire response under the gateway WS max payload.
                if payload.base64.count > remainingBudget {
                    stop.pointee = true
                    return
                }
                remainingBudget -= payload.base64.count
                results.append(payload)
            }
        }

        return OpenClawPhotosLatestPayload(photos: results)
    }

    private static func ensureAuthorization() async -> PHAuthorizationStatus {
        // Don’t prompt during node.invoke; prompts block the invoke and lead to timeouts.
        PHPhotoLibrary.authorizationStatus(for: .readWrite)
    }

    private static func renderAsset(
        _ asset: PHAsset,
        maxWidth: Int,
        quality: Double,
        formatter: ISO8601DateFormatter) throws -> OpenClawPhotoPayload
    {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let manager = PHImageManager.default()
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let options = PHImageRequestOptions()
        options.isSynchronous = true
        options.isNetworkAccessAllowed = true
        options.deliveryMode = .highQualityFormat

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let targetSize: CGSize = {
            guard maxWidth > 0 else { return PHImageManagerMaximumSize }
            let aspect = CGFloat(asset.pixelHeight) / CGFloat(max(1, asset.pixelWidth))
            let width = CGFloat(maxWidth)
            return CGSize(width: width, height: width * aspect)
        }()

        var image: UIImage?
        manager.requestImage(
            for: asset,
            targetSize: targetSize,
            contentMode: .aspectFit,
            options: options)
        { result, _ in
            image = result
        }

        guard let image else {
            throw NSError(domain: "Photos", code: 2, userInfo: [
                NSLocalizedDescriptionKey: "photo load failed",
            ])
        }

        let (data, finalImage) = try encodeJpegUnderBudget(
            image: image,
            quality: quality,
            maxBase64Chars: maxPerPhotoBase64Chars)

        let created = asset.creationDate.map { formatter.string(from: $0) }
        return OpenClawPhotoPayload(
            format: "jpeg",
            base64: data.base64EncodedString(),
            width: Int(finalImage.size.width),
            height: Int(finalImage.size.height),
            createdAt: created)
    }

    private static func encodeJpegUnderBudget(
        image: UIImage,
        quality: Double,
        maxBase64Chars: Int) throws -> (Data, UIImage)
    {
        var currentImage = image
        var currentQuality = max(0.1, min(1.0, quality))

        // Try lowering JPEG quality first, then downscale if needed.
        for _ in 0..<10 {
            guard let data = currentImage.jpegData(compressionQuality: currentQuality) else {
                throw NSError(domain: "Photos", code: 3, userInfo: [
                    NSLocalizedDescriptionKey: "photo encode failed",
                ])
            }

            let base64Len = ((data.count + 2) / 3) * 4
            if base64Len <= maxBase64Chars {
                return (data, currentImage)
            }

            if currentQuality > 0.35 {
                currentQuality = max(0.25, currentQuality - 0.15)
                continue
            }

            // Downscale by ~25% each step once quality is low.
            let newWidth = max(240, currentImage.size.width * 0.75)
            if newWidth >= currentImage.size.width {
                break
            }
            currentImage = resize(image: currentImage, targetWidth: newWidth)
        }

        throw NSError(domain: "Photos", code: 4, userInfo: [
            NSLocalizedDescriptionKey: "photo too large for gateway transport; try smaller maxWidth/quality",
        ])
    }

    private static func resize(image: UIImage, targetWidth: CGFloat) -> UIImage {
        let size = image.size
        if size.width <= 0 || size.height <= 0 || targetWidth <= 0 {
            return image
        }
        let scale = targetWidth / size.width
        let targetSize = CGSize(width: targetWidth, height: max(1, size.height * scale))
        let format = UIGraphicsImageRendererFormat.default()
        format.scale = 1
        let renderer = UIGraphicsImageRenderer(size: targetSize, format: format)
        return renderer.image { _ in
            image.draw(in: CGRect(origin: .zero, size: targetSize))
        }
    }
}
