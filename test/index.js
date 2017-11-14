/**
 * @copyright 2017-present, Charlike Mike Reagent <olsten.larck@gmail.com>
 * @license Apache-2.0
 */

const test = require('mukla')
const isObject = require('isobject')
const detectNextVersion = require('../src/index.js')

test('return "patch" when "fix" type and scope "foo" given', (done) => {
  const res = detectNextVersion('fix(foo): bar qux')

  test.strictEqual(res, 'patch')
  done()
})

test('return "major" when "fix" type and has "BREAKING CHANGE" in body', (done) => {
  const increment = detectNextVersion(`fix(src): some very important change
BREAKING CHANGE: we are awesome`)

  test.strictEqual(increment, 'major')
  done()
})

test('return "minor" when "feat" type and no scope', (done) => {
  const inc = detectNextVersion('feat: woohoo, awesome')

  test.strictEqual(inc, 'minor')
  done()
})

test('return "major" when detect "BREAKING CHANGE" in header', (done) => {
  const next = detectNextVersion('fix: BREAKING CHANGE: require node 8')
  test.strictEqual(next, 'major')

  const incr = detectNextVersion('fix(quxie): BREAKING CHANGE: require node 8')
  test.strictEqual(incr, 'major')
  done()
})

test('return "major" when type is "break" or "major"', (done) => {
  const result1 = detectNextVersion('break(source): require node 8')
  const result2 = detectNextVersion('major(source): require node 8')
  const result3 = detectNextVersion('major: require node 8')

  test.strictEqual(result1, 'major')
  test.strictEqual(result2, 'major')
  test.strictEqual(result3, 'major')
  done()
})

test('should return an "commit" object if second param is explicit true', (done) => {
  const commit = detectNextVersion('fix(src): wooho\nmake it more generic', true)

  test.strictEqual(isObject(commit), true)
  test.strictEqual(commit.type, 'fix')
  test.strictEqual(commit.scope, 'src')
  test.strictEqual(commit.subject, 'wooho')
  test.strictEqual(commit.header, 'fix(src): wooho')
  test.strictEqual(commit.body, 'make it more generic')
  test.strictEqual(commit.increment, 'patch')
  done()
})
