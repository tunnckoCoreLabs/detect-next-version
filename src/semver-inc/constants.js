/**
 * Partial Semver Source Code, ISC Licensed.
 * Only the `semver.inc` method.
 */

export const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || 9007199254740991;

// The following Regular Expressions can be used for tokenizing,
// validating, and parsing SemVer version strings.

// ## Numeric Identifier
// A single `0`, or a non-zero digit followed by zero or more digits.

const NUMERICIDENTIFIER = '0|[1-9]\\d*';
const NUMERICIDENTIFIERLOOSE = '[0-9]+';

// ## Non-numeric Identifier
// Zero or more digits, followed by a letter or hyphen, and then zero or
// more letters, digits, or hyphens.

const NONNUMERICIDENTIFIER = '\\d*[a-zA-Z-][a-zA-Z0-9-]*';

// ## Main Version
// Three dot-separated numeric identifiers.

const MAINVERSION =
  `(${NUMERICIDENTIFIER})\\.` +
  `(${NUMERICIDENTIFIER})\\.` +
  `(${NUMERICIDENTIFIER})`;

const MAINVERSIONLOOSE =
  `(${NUMERICIDENTIFIERLOOSE})\\.` +
  `(${NUMERICIDENTIFIERLOOSE})\\.` +
  `(${NUMERICIDENTIFIERLOOSE})`;

// ## Pre-release Version Identifier
// A numeric identifier, or a non-numeric identifier.

const PRERELEASEIDENTIFIER = `(?:${NUMERICIDENTIFIER}|${NONNUMERICIDENTIFIER})`;

const PRERELEASEIDENTIFIERLOOSE = `(?:${NUMERICIDENTIFIERLOOSE}|${NONNUMERICIDENTIFIER})`;

// ## Pre-release Version
// Hyphen, followed by one or more dot-separated pre-release version
// identifiers.

const PRERELEASE = `(?:-(${PRERELEASEIDENTIFIER}(?:\\.${PRERELEASEIDENTIFIER})*))`;

const PRERELEASELOOSE = `(?:-?(${PRERELEASEIDENTIFIERLOOSE}(?:\\.${PRERELEASEIDENTIFIERLOOSE})*))`;

// ## Build Metadata Identifier
// Any combination of digits, letters, or hyphens.

const BUILDIDENTIFIER = '[0-9A-Za-z-]+';

// ## Build Metadata
// Plus sign, followed by one or more period-separated build metadata
// identifiers.

const BUILD = `(?:\\+(${BUILDIDENTIFIER}(?:\\.${BUILDIDENTIFIER})*))`;

// ## Full Version String
// A main version, followed optionally by a pre-release version and
// build metadata.

// Note that the only major, minor, patch, and pre-release sections of
// the version string are capturing groups.  The build metadata is not a
// capturing group, because it should not ever be used in version
// comparison.

const FULLPLAIN = `v?${MAINVERSION}${PRERELEASE}?${BUILD}?`;

export const FULL = `^${FULLPLAIN}$`;

// like full, but allows v1.2.3 and =1.2.3, which people do sometimes.
// also, 1.0.0alpha1 (prerelease without the hyphen) which is pretty
// common in the npm registry.
const LOOSEPLAIN = `[v=\\s]*${MAINVERSIONLOOSE}${PRERELEASELOOSE}?${BUILD}?`;

export const LOOSE = `^${LOOSEPLAIN}$`;
