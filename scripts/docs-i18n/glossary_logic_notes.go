/*
 * AUTO ANNOTATION
 * File: scripts/docs-i18n/glossary.go
 * Purpose: Operational script for maintenance/build/release/test workflows (glossary.go).
 * Module area: Repo utility, build, release, and maintenance scripts
 * System effect: Used by developers/CI to automate setup, checks, packaging, and diagnostics.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"os"
)

type GlossaryEntry struct {
	Source string `json:"source"`
	Target string `json:"target"`
}

func LoadGlossary(path string) ([]GlossaryEntry, error) {
	data, err := os.ReadFile(path)
	if err != nil {
		if errors.Is(err, os.ErrNotExist) {
			return nil, nil
		}
		return nil, err
	}
	var entries []GlossaryEntry
	if err := json.Unmarshal(data, &entries); err != nil {
		return nil, fmt.Errorf("glossary parse failed: %w", err)
	}

	return entries, nil
}
