import assert from 'assert';
import test from 'asia';
import packageJson from 'package-json';
import detectNextVersion from '../src';
import semverIncrement from '../src/semver-inc';

test('next version is minor', async () => {
  const [result] = await detectNextVersion(
    ['fix: some foo bar', 'feat(fake): ok dude', 'chore(ci): tweaks'],
    { name: '@tunnckocore/package-json' },
  );

  const { increment, name, cwd, path, pkg, lastVersion, nextVersion } = result;

  assert.ok(pkg);
  assert.strictEqual(increment, 'minor');
  assert.strictEqual(cwd, undefined);
  assert.strictEqual(name, '@tunnckocore/package-json');
  assert.strictEqual(path, '@tunnckocore/package-json');
  assert.strictEqual(pkg.version, lastVersion);
  assert.strictEqual(nextVersion, semverIncrement(lastVersion, increment));
});

test('each item in result should have `cwd` when passed through options', async () => {
  const cwd = process.cwd();
  const [res] = await detectNextVersion(['fix(bar): oke ok'], {
    cwd,
    name: 'barry',
  });

  assert.strictEqual(res.cwd, cwd);
  assert.strictEqual(res.name, 'barry');
  assert.strictEqual(res.path, 'packages/barry');
});

test('throw if no package name is given or not string', async () => {
  try {
    await detectNextVersion(['chore: foo bar']);
  } catch (err) {
    assert.ok(err);
    assert.ok(/expect `opts\.name` to be non empty string/.test(err.message));
  }
});

test('throw if no commit messages are given', async () => {
  try {
    await detectNextVersion(null, { name: '@tunnckocore/qq5' });
  } catch (err) {
    assert.ok(err);
    assert.ok(
      /expect `commits` to be string, array of strings or array of objects/.test(
        err.message,
      ),
    );
  }
});

test('do not give `result.nextVersion` when only "chore" commits', async () => {
  const result = await detectNextVersion(
    ['chore: foo bar baz', 'chore(ci): some build fix'],
    { name: '@tunnckocore/qq5', packageJson },
  );

  assert.strictEqual(result.increment, false);
  assert.strictEqual(result.lastVersion, '0.1.0');

  const hasOwn = (key) => Object.prototype.hasOwnProperty.call(result, key);
  assert.strictEqual(hasOwn(result, 'nextVersion'), false);
  assert.strictEqual(result.nextVersion, undefined);
});

test('should work for monorepo setups when opts.packages given', async () => {
  const cwd = process.cwd();
  const results = await detectNextVersion(
    ['chore: foo bar baz', 'feat(cli): bar qux'],
    { cwd, packages: ['@tunnckocore/qq5', 'foo-bar-baz-qux'] },
  );

  const [itemOne, itemTwo] = results;
  assert.strictEqual(itemOne.name, '@tunnckocore/qq5');
  assert.strictEqual(itemOne.path, '@tunnckocore/qq5');
  assert.strictEqual(itemOne.increment, 'minor');
  assert.strictEqual(itemOne.lastVersion, '0.1.0');
  assert.strictEqual(itemOne.nextVersion, '0.2.0');
  assert.strictEqual(itemOne.cwd, cwd);

  assert.strictEqual(itemTwo.name, 'foo-bar-baz-qux');
  assert.strictEqual(itemTwo.path, 'packages/foo-bar-baz-qux');
  assert.strictEqual(itemTwo.increment, 'minor');
  assert.strictEqual(itemTwo.lastVersion, '1.0.4');
  assert.strictEqual(itemTwo.nextVersion, '1.1.0');
  assert.strictEqual(itemTwo.cwd, cwd);
});

test('should throw when opts.packages but not opts.cwd', async () => {
  try {
    await detectNextVersion(['chore: foo bar baz', 'feat(cli): bar qux'], {
      packages: ['@tunnckocore/qq5', 'foo-bar-baz-qux'],
    });
  } catch (err) {
    assert.ok(err);
    assert.strictEqual(
      /expect `opts\.cwd` when `opts\.packages` is given/.test(err.message),
      true,
    );
  }
});

test('should throw when `opts.packages` and `opts.name` together', async () => {
  try {
    await detectNextVersion(['chore: foo'], {
      packages: ['foo-bar-qux'],
      name: '@tunnckocore/sasasasasas',
    });
  } catch (err) {
    assert.ok(err);
    assert.strictEqual(
      /The `opts\.packages` and `opts\.name` cannot work together/.test(
        err.message,
      ),
      true,
    );
  }
});
