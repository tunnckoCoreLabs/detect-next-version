/**
 * Partial Semver Source Code, ISC Licensed.
 * Only the `semver.inc` method.
 */

/* eslint-disable no-plusplus, no-param-reassign, max-statements, no-restricted-globals */

import * as constants from './constants';

function SemVer(version, loose) {
  if (version instanceof SemVer) {
    if (version.loose === loose) {
      return version;
    }
    version = version.version; // eslint-disable-line prefer-destructuring
  } else if (typeof version !== 'string') {
    throw new TypeError(`Invalid Version: ${version}`);
  }

  if (version.length > constants.MAX_LENGTH) {
    throw new TypeError(
      `version is longer than ${constants.MAX_LENGTH} characters`,
    );
  }

  if (!(this instanceof SemVer)) {
    return new SemVer(version, loose);
  }

  this.loose = loose;
  const m = version.trim().match(loose ? constants.LOOSE : constants.FULL);

  if (!m) {
    throw new TypeError(`Invalid Version: ${version}`);
  }

  this.raw = version;

  // these are actually numbers
  this.major = +m[1];
  this.minor = +m[2];
  this.patch = +m[3];

  if (this.major > constants.MAX_SAFE_INTEGER || this.major < 0) {
    throw new TypeError('Invalid major version');
  }

  if (this.minor > constants.MAX_SAFE_INTEGER || this.minor < 0) {
    throw new TypeError('Invalid minor version');
  }

  if (this.patch > constants.MAX_SAFE_INTEGER || this.patch < 0) {
    throw new TypeError('Invalid patch version');
  }

  // numberify any prerelease numeric ids
  if (!m[4]) {
    this.prerelease = [];
  } else {
    this.prerelease = m[4].split('.').map((id) => {
      if (/^\d+$/.test(id)) {
        const num = +id;
        if (num >= 0 && num < constants.MAX_SAFE_INTEGER) return num;
      }
      return id;
    });
  }

  this.build = m[5] ? m[5].split('.') : [];
  this.format();
}

SemVer.prototype.format = function format() {
  this.version = `${this.major}.${this.minor}.${this.patch}`;

  if (this.prerelease.length > 0) {
    this.version += `-${this.prerelease.join('.')}`;
  }
  return this.version;
};

// preminor will bump the version up to the next minor release, and immediately
// down to pre-release. premajor and prepatch work the same way.
SemVer.prototype.inc = function inc(release, identifier) {
  switch (release) {
    case 'premajor': {
      this.prerelease.length = 0;
      this.patch = 0;
      this.minor = 0;
      this.major++;
      this.inc('pre', identifier);
      break;
    }
    case 'preminor': {
      this.prerelease.length = 0;
      this.patch = 0;
      this.minor++;
      this.inc('pre', identifier);
      break;
    }
    case 'prepatch': {
      // If this is already a prerelease, it will bump to the next version
      // drop any prereleases that might already exist, since they are not
      // relevant at this point.
      this.prerelease.length = 0;
      this.inc('patch', identifier);
      this.inc('pre', identifier);
      break;
    }
    // If the input is a non-prerelease version, this acts the same as
    // prepatch.
    case 'prerelease': {
      if (this.prerelease.length === 0) {
        this.inc('patch', identifier);
      }
      this.inc('pre', identifier);
      break;
    }
    case 'major': {
      // If this is a pre-major version, bump up to the same major version.
      // Otherwise increment major.
      // 1.0.0-5 bumps to 1.0.0
      // 1.1.0 bumps to 2.0.0
      if (
        this.minor !== 0 ||
        this.patch !== 0 ||
        this.prerelease.length === 0
      ) {
        this.major++;
      }
      this.minor = 0;
      this.patch = 0;
      this.prerelease = [];
      break;
    }
    case 'minor': {
      // If this is a pre-minor version, bump up to the same minor version.
      // Otherwise increment minor.
      // 1.2.0-5 bumps to 1.2.0
      // 1.2.1 bumps to 1.3.0
      if (this.patch !== 0 || this.prerelease.length === 0) {
        this.minor++;
      }
      this.patch = 0;
      this.prerelease = [];
      break;
    }
    case 'patch': {
      // If this is not a pre-release version, it will increment the patch.
      // If it is a pre-release it will bump up to the same patch version.
      // 1.2.0-5 patches to 1.2.0
      // 1.2.0 patches to 1.2.1
      if (this.prerelease.length === 0) {
        this.patch++;
      }

      this.prerelease = [];
      break;
    }
    // This probably shouldn't be used publicly.
    // 1.0.0 "pre" would become 1.0.0-0 which is the wrong direction.
    case 'pre': {
      if (this.prerelease.length === 0) {
        this.prerelease = [0];
      } else {
        let i = this.prerelease.length;
        while (--i >= 0) {
          if (typeof this.prerelease[i] === 'number') {
            this.prerelease[i]++;
            i = -2;
          }
        }
        if (i === -1)
          // didn't increment anything
          this.prerelease.push(0);
      }
      if (identifier) {
        // 1.2.0-beta.1 bumps to 1.2.0-beta.2,
        // 1.2.0-beta.fooblz or 1.2.0-beta bumps to 1.2.0-beta.0
        if (this.prerelease[0] === identifier) {
          if (isNaN(this.prerelease[1])) {
            this.prerelease = [identifier, 0];
          }
        } else this.prerelease = [identifier, 0];
      }
      break;
    }
    default: {
      throw new Error(`invalid increment argument: ${release}`);
    }
  }
  this.format();
  this.raw = this.version;
  return this;
};

export default function increment(version, release, loose, identifier) {
  if (typeof loose === 'string') {
    identifier = loose;
    loose = undefined;
  }

  try {
    return new SemVer(version, loose).inc(release, identifier).version;
  } catch (err) {
    return null;
  }
}
