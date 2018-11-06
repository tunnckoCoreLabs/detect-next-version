import recommendedBump from 'recommended-bump';
import packageJson from '@tunnckocore/package-json';
import increment from './semver-inc';

export default async function detector(name, commitMessages, options = {}) {
  const opts = Object.assign({}, options);

  if (typeof name !== 'string') {
    throw new TypeError('expect `name` to be string');
  }
  const commits = [].concat(commitMessages).filter(Boolean);

  if (commits.length === 0) {
    throw new TypeError(
      'expect `commitMessages` to be string or array of strings',
    );
  }

  const pkg = await packageJson(name, opts.endpoint);
  const recommended = recommendedBump(commits, opts.plugins);
  const lastVersion = pkg.version;

  if (!recommended.increment) {
    return Object.assign({}, recommended, { pkg, lastVersion });
  }

  const nextVersion = increment(lastVersion, recommended.increment);

  return Object.assign({}, recommended, { pkg, lastVersion, nextVersion });
}

// async function main() {
//   const res = await detector('@hela/cli', [
//     'chore: woohoo\n\nBREAKING CHANGE: unexpected breakage should happen',
//     'fix: foo bar baz'
//   ])

//   console.log(res)
//   // => res.increment === 'major' (because has "BREAKING CHANGE")
//   // => res.lastVersion === '0.2.1'
//   // => res.nextVersion === '1.0.0'
// }

// main()
