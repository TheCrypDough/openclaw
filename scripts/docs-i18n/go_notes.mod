# AUTOPLACEHOLDER_ANNOTATION: scripts/docs-i18n/go.mod
# Purpose: Operational script for maintenance/build/release/test workflows (go.mod).
# Area: Repo utility, build, release, and maintenance scripts
# System effect: Used by developers/CI to automate setup, checks, packaging, and diagnostics.
module github.com/openclaw/openclaw/scripts/docs-i18n

go 1.24.0

require (
	github.com/joshp123/pi-golang v0.0.4
	github.com/yuin/goldmark v1.7.8
	golang.org/x/net v0.50.0
	gopkg.in/yaml.v3 v3.0.1
)
