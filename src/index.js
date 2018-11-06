import recommendedBump from 'recommended-bump';
import packageJson from '@tunnckocore/package-json';
import increment from './semver-inc';

/**
 * Calculates next version of given package with `name`,
 * based given `commitMessages` which should follow
 * the [Conventional Commits Specification](https://www.conventionalcommits.org/).
 * Options are passed directly to [@tunnckocore/package-json](https://ghub.io/@tunnckocore/package-json) and
 * [recommended-bump][] packages. Also because the recommended-bump, you can
 * pass `options.plugins` which will be passed to [parse-commit-message][]
 * commit message parser. So follow their docs and see the tests here for
 * example usage. If all commit messages are of type that is not `patch|fix|minor|feat|major`
 * or containing `BREAKING CHANGE:` label (e.g. the `chore` type), then the
 * returned result won't have `nextVersion` and `increment` will be `false`.
 *
 * @example ts
 * type Commit = {
 *   header: {
 *     type: string,
 *     scope: string,
 *     subject: string,
 *     toString: Function,
 *   },
 *   body: string | null,
 *   footer: string | null
 * }
 *
 * @example
 * import detector from 'detect-next-version';
 *
 * async function main() {
 *   const commits = ['chore(ci): some build tweaks', 'fix(cli): foo bar'];
 *
 *   // consider `my-npm-package` is version 0.1.0
 *   const result = await detector('my-npm-package', commits);
 *   console.log(result.increment); // => 'patch'
 *   console.log(result.pkg); // => package's latest package.json metadata
 *   console.log(result.lastVersion); // => '0.1.0'
 *   console.log(result.nextVersion); // => '0.1.1'
 *   console.log(result.patch[0].header.type); // => 'fix'
 *   console.log(result.patch[0].header.scope); // => 'cli'
 *   console.log(result.patch[0].header.subject); // => 'foobar'
 *   console.log(result.patch[0].header.toString()); // => 'fix(cli): foobar'
 * }
 *
 * main().catch(console.error);
 *
 * @example
 * import { parse, plugins } from 'parse-commit-message';
 * import detectNextVersion from 'detect-next-version';
 *
 * async function main() {
 *   const commitOne = parse('fix: foo bar', plugins);
 *   const commitTwo = parse('feat: some feature subject', plugins);
 *
 *   const result = detectNextVersion('@my-org/my-awesomepkg', [commitOne, commitTwo]);
 *   console.log(result.increment); // => 'minor'
 * }
 *
 * main().catch(console.error);
 *
 * @name detectNextVersion
 * @public
 * @param {string} name a package name which you looking to update
 * @param {string|string[]} commits directly passed to [recommended-bump][]
 *                          May be one of `string`, `Array<string>` or `Array<Commit>`
 * @param {object} [options={}] optional, passed to above mentioned packages.
 * @returns {object} an object which is basically the return of [recommended-bump][]
 *                  plus `{ pkg, lastVersion, nextVersion? }`.
 */
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
