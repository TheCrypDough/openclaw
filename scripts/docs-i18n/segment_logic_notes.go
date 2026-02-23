/*
 * AUTO ANNOTATION
 * File: scripts/docs-i18n/segment.go
 * Purpose: Operational script for maintenance/build/release/test workflows (segment.go).
 * Module area: Repo utility, build, release, and maintenance scripts
 * System effect: Used by developers/CI to automate setup, checks, packaging, and diagnostics.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
package main

type Segment struct {
	Start      int
	Stop       int
	Text       string
	TextHash   string
	SegmentID  string
	Translated string
	CacheKey   string
}
