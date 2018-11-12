import test from 'asia';
import detectNextVersion from '../src';
import semverIncrement from '../src/semver-inc';

test('next version is minor', async (t) => {
  const result = await detectNextVersion('@tunnckocore/package-json', [
    'fix: some foo bar',
    'feat(fake): ok dude',
    'chore(ci): tweaks',
  ]);

  const { increment, pkg, lastVersion, nextVersion } = result;

  t.ok(pkg);
  t.strictEqual(increment, 'minor');
  t.strictEqual(pkg.version, lastVersion);
  t.strictEqual(nextVersion, semverIncrement(lastVersion, increment));
});

test('throw if no package name is given or not string', async (t) => {
  try {
    await detectNextVersion();
  } catch (err) {
    t.ok(err);
    t.ok(/expect `name` to be string/.test(err.message));
  }
});

test('throw if no commit messages are given', async (t) => {
  try {
    await detectNextVersion('@tunnckocore/qq5');
  } catch (err) {
    t.ok(err);
    t.ok(/be string, array of strings or array of objects/.test(err.message));
  }
});

test('dont give `result.nextVersion` when only "chore" commits', async (t) => {
  const result = await detectNextVersion('@tunnckocore/qq5', [
    'chore: foo bar baz',
    'chore(ci): some build fix',
  ]);

  t.strictEqual(result.increment, false);
  t.strictEqual(result.lastVersion, '0.1.0');

  const hasOwn = (key) => Object.prototype.hasOwnProperty.call(result, key);
  t.strictEqual(hasOwn(result, 'nextVersion'), false);
  t.strictEqual(result.nextVersion, undefined);
});
