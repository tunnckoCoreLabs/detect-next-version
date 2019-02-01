import recommendedBump from 'recommended-bump';
import packageJson from 'package-json';
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
 * ProTip: See [parse-commit-message types](https://github.com/tunnckoCoreLabs/parse-commit-message#type-definitions) documentation!
 *
 * @example ts
 * type Commit = {
 *   header: Header;
 *   body?: string | null;
 *   footer?: string | null;
 *   increment?: string | boolean;
 *   isBreaking?: boolean;
 *   mentions?: Array<Mention>;
 * };
 *
 * @example
 * import detector from 'detect-next-version';
 *
 * async function main() {
 *   const commits = ['chore(ci): some build tweaks', 'fix(cli): foo bar'];
 *
 *   // consider `my-npm-package` is version 0.1.0
 *   const [result] = await detector(commits, { name: 'my-npm-package' });
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
 * import { parse } from 'parse-commit-message';
 * import detector from 'detect-next-version';
 *
 * async function main() {
 *   const commitOne = parse('fix: foo bar');
 *   const commitTwo = parse('feat: some feature subject');
 *
 *   // always an array, but we can destruct it here,
 *   // because we know that it has only one item
 *   const [result] = await detector([commitOne, commitTwo], {
 *     name: '@my-org/my-awesomepkg'
 *   });
 *   console.log(result.increment); // => 'minor'
 * }
 *
 * main().catch(console.error);
 *
 * @name detectNextVersion
 * @public
 * @param {string|string[]} commits directly passed to [recommended-bump][]
 *                          May be one of `string`, `Array<string>` or `Array<Commit>`
 * @param {object} [options={}] optional, passed to above mentioned packages.
 * @returns {Array<object>} an array of objects where each is basically the return of [recommended-bump][]
 *                  plus `{ pkg, name, cwd, path, lastVersion, nextVersion? }`.
 */
export default async function detector(commits, options) {
  const opts = Object.assign({}, options);
  const cmts = arrayify(commits).filter(Boolean);

  if (cmts.length === 0) {
    throw new TypeError(
      'expect `commits` to be string, array of strings or array of objects',
    );
  }

  if (opts.packages && opts.name) {
    throw new Error('The `opts.packages` and `opts.name` cannot work together');
  }
  if (opts.packages && !opts.cwd) {
    throw new Error('expect `opts.cwd` when `opts.packages` is given');
  }

  if (opts.packages) {
    const { plugins, cwd } = opts;

    /**
     * Inside commit
     *
     * packages:
     * - foo-bar
     * - @tunnckocore/barry
     */
    return arrayify(opts.packages)
      .filter(Boolean)
      .reduce(
        (promise, name) =>
          promise.then(async (acc) => {
            // when package is scoped, it's considered that the scope is
            // a directory inside the root (cwd) of monorepo.
            const path = name.startsWith('@') ? name : `packages/${name}`;
            const [result] = await detector(commits, {
              name,
              packageJson,
              plugins,
              cwd,
            });

            /**
             * Use `path.join(item.cwd, item.path)` to access package place.
             *
             * [{
             *   name: 'foo-bar',
             *   path: 'packages/foo-bar',
             *   cwd: '/home/foo/bar/develop',
             *   increment: 'minor',
             *   isBreaking: false,
             *   lastVersion: '1.1.1',
             *   nextVersion: '1.2.0',
             *   pkg: pkgJson,
             * }, {
             *   name: '@tunnckocore/barry',
             *   path: '@tunnckocore/barry',
             *   cwd: '/home/foo/bar/develop',
             *   increment: 'major',
             *   isBreaking: true,
             *   lastVersion: '1.5.10',
             *   nextVersion: '2.0.0',
             *   pkg: pkgJson,
             * }]
             */
            return acc.concat(Object.assign({ name, path, cwd }, result));
          }),
        Promise.resolve([]),
      );
  }
  if (!isValidString(opts.name)) {
    throw new TypeError('expect `opts.name` to be non empty string');
  }

  const { name, cwd } = opts;
  // when package is scoped, it's considered that the scope is
  // a directory inside the root (cwd) of monorepo.
  const path = name.startsWith('@') ? name : `packages/${name}`;

  const getPkg =
    typeof opts.packageJson === 'function' ? opts.packageJson : packageJson;

  const pkg = await getPkg(name, opts);
  const recommended = recommendedBump(cmts, opts.plugins);
  const lastVersion = pkg.version;

  if (!recommended.increment) {
    return Object.assign({}, recommended, { pkg, lastVersion });
  }

  const nextVersion = increment(lastVersion, recommended.increment);

  return [
    Object.assign({}, recommended, {
      name,
      path,
      cwd,
      pkg,
      lastVersion,
      nextVersion,
    }),
  ];
}

/* istanbul ignore next */
function arrayify(val) {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  return [val];
}

function isValidString(val) {
  return val && typeof val === 'string' && val.length > 0;
}
