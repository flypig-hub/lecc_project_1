# Release Notes

## v1.0.1 (debug-fix)

### Fixed
- Added strict numeric path parameter validation (`post id`, `comment id`) to prevent invalid route values from producing ambiguous errors.
- Improved frontend API error handling for auth/post/comment actions to surface backend messages consistently.

### Improved
- Added user-facing ChatGPT prompt document to guide full environment setup and execution from scratch.

### Notes
- Runtime package installation may fail in restricted environments with npm registry policy (`403 Forbidden`).
