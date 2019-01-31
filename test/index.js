import assert from 'assert';
import test from 'asia';
import detectNextVersion from '../src';
import semverIncrement from '../src/semver-inc';

test('next version is minor', async () => {
  const [result] = await detectNextVersion(
    ['fix: some foo bar', 'feat(fake): ok dude', 'chore(ci): tweaks'],
    { name: '@tunnckocore/package-json' },
  );

  const { increment, name, path, pkg, lastVersion, nextVersion } = result;

  assert.ok(pkg);
  assert.strictEqual(increment, 'minor');
  assert.strictEqual(name, '@tunnckocore/package-json');
  assert.strictEqual(pkg.version, lastVersion);
  assert.strictEqual(nextVersion, semverIncrement(lastVersion, increment));
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
    { name: '@tunnckocore/qq5' },
  );

  assert.strictEqual(result.increment, false);
  assert.strictEqual(result.lastVersion, '0.1.0');

  const hasOwn = (key) => Object.prototype.hasOwnProperty.call(result, key);
  assert.strictEqual(hasOwn(result, 'nextVersion'), false);
  assert.strictEqual(result.nextVersion, undefined);
});
