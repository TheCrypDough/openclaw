<!-- AUTOPLACEHOLDER_ANNOTATION -->
## File Annotation: extensions/nostr/CHANGELOG.md
- **Purpose:** Extension package component that adds a channel/tool integration or adapter.
- **Module area:** Pluggable channel and service extensions
- **System effect:** Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
# Changelog

## 2026.2.22

### Changes

- Version alignment with core OpenClaw release numbers.

## 2026.1.19-1

Initial release.

### Features

- NIP-04 encrypted DM support (kind:4 events)
- Key validation (hex and nsec formats)
- Multi-relay support with sequential fallback
- Event signature verification
- TTL-based deduplication (24h)
- Access control via dmPolicy (pairing, allowlist, open, disabled)
- Pubkey normalization (hex/npub)

### Protocol Support

- NIP-01: Basic event structure
- NIP-04: Encrypted direct messages

### Planned for v2

- NIP-17: Gift-wrapped DMs
- NIP-44: Versioned encryption
- Media attachments
