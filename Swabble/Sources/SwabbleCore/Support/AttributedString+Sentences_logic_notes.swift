/*
 * AUTO ANNOTATION
 * File: Swabble/Sources/SwabbleCore/Support/AttributedString+Sentences.swift
 * Purpose: File in Swabble area for project orchestration/configuration/data.
 * Module area: Swift package subtree for related mobile tooling
 * System effect: Change can influence swift package subtree for related mobile tooling and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import CoreMedia
import Foundation
import NaturalLanguage

extension AttributedString {
    public func sentences(maxLength: Int? = nil) -> [AttributedString] {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let tokenizer = NLTokenizer(unit: .sentence)
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let string = String(characters)
        tokenizer.string = string
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let sentenceRanges = tokenizer.tokens(for: string.startIndex..<string.endIndex).map {
            (
                $0,
                AttributedString.Index($0.lowerBound, within: self)!
                    ..<
                    AttributedString.Index($0.upperBound, within: self)!)
        }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let ranges = sentenceRanges.flatMap { sentenceStringRange, sentenceRange in
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
            let sentence = self[sentenceRange]
            guard let maxLength, sentence.characters.count > maxLength else {
                return [sentenceRange]
            }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
            let wordTokenizer = NLTokenizer(unit: .word)
            wordTokenizer.string = string
            var wordRanges = wordTokenizer.tokens(for: sentenceStringRange).map {
                AttributedString.Index($0.lowerBound, within: self)!
                    ..<
                    AttributedString.Index($0.upperBound, within: self)!
            }
            guard !wordRanges.isEmpty else { return [sentenceRange] }
            wordRanges[0] = sentenceRange.lowerBound..<wordRanges[0].upperBound
            wordRanges[wordRanges.count - 1] = wordRanges[wordRanges.count - 1].lowerBound..<sentenceRange.upperBound

            var ranges: [Range<AttributedString.Index>] = []
            for wordRange in wordRanges {
                if let lastRange = ranges.last,
                   self[lastRange].characters.count + self[wordRange].characters.count <= maxLength {
                    ranges[ranges.count - 1] = lastRange.lowerBound..<wordRange.upperBound
                } else {
                    ranges.append(wordRange)
                }
            }

            return ranges
        }

        return ranges.compactMap { range in
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
            let audioTimeRanges = self[range].runs.filter {
                !String(self[$0.range].characters)
                    .trimmingCharacters(in: .whitespacesAndNewlines).isEmpty
            }.compactMap(\.audioTimeRange)
            guard !audioTimeRanges.isEmpty else { return nil }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
            let start = audioTimeRanges.first!.start
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
            let end = audioTimeRanges.last!.end
            var attributes = AttributeContainer()
            attributes[AttributeScopes.SpeechAttributes.TimeRangeAttribute.self] = CMTimeRange(
                start: start,
                end: end)
            return AttributedString(self[range].characters, attributes: attributes)
        }
    }
}
