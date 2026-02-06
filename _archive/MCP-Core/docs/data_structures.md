# Logic64 Data Structures Specification

## 1. Constraints Schema (`constraints.json`)
The rulebook for the Validator Node.

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["architecture_style", "technology_stack", "security_rules", "forbidden_patterns"],
  "properties": {
    "architecture_style": {
      "type": "string",
      "enum": ["microservices", "modular_monolith", "event_driven"]
    },
    "technology_stack": {
      "type": "object",
      "properties": {
        "language": { "type": "string" },
        "framework": { "type": "string" },
        "database": { "type": "string" }
      }
    },
    "security_rules": {
      "type": "array",
      "items": { "type": "string" },
      "description": "Rules that trigger immediate rejection if violated (e.g., 'no_hardcoded_secrets')"
    },
    "forbidden_patterns": {
      "type": "array",
      "items": { "type": "string" },
      "description": "Architectural anti-patterns explicitly banned (e.g., 'circular_dependencies', 'direct_db_access_from_ui')"
    }
  }
}
```

### Example Instance
```json
{
  "architecture_style": "microservices",
  "technology_stack": {
    "language": "python",
    "framework": "fastapi",
    "database": "postgresql"
  },
  "security_rules": [
    "no_hardcoded_secrets",
    "no_public_s3_buckets",
    "always_use_orm"
  ],
  "forbidden_patterns": [
    "god_classes",
    "global_mutable_state"
  ]
}
```

## 2. Integrity Lock Schema (`integrity.lock`)
The cryptographic seal of the session.

```json
{
  "type": "object",
  "properties": {
    "version": { "type": "string", "const": "2.1" },
    "timestamp": { "type": "string", "format": "date-time" },
    "state_hash": { "type": "string", "description": "SHA-256 of all constraint files combined" },
    "files": {
      "type": "object",
      "additionalProperties": {
        "type": "string",
        "description": "SHA-256 of individual files"
      }
    },
    "signature": { "type": "string", "description": "HMAC signature by Gateway Private Key" }
  }
}
```

### Example Instance
```json
{
  "version": "2.1",
  "timestamp": "2026-01-20T10:00:00Z",
  "state_hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  "files": {
    "blueprint.md": "a1b2c3d4...",
    "constraints.json": "f5e6d7c8..."
  },
  "signature": "LOGIC64-SIG-88776655"
}
```
