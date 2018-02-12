/**
 * @copyright 2017-present, Charlike Mike Reagent <olsten.larck@gmail.com>
 * @license Apache-2.0
 */

const { parse, mappers } = require('parse-commit-message')

/**
 * > Parses given `commitMessage` and returns an **"increment" type**,
 * like `'patch'`, `'minor'` or `'major'`. That's useful to be passed
 * to the [semver][]'s `inc()` method (see below example).
 *
 * **Example**
 *
 * ```js
 * const semver = require('semver')
 * const detectNext = require('detect-next-version')
 *
 * const commitMessage = 'feat(ng-list): updates the list order, thanks @hercules'
 *
 * const increment = detectNext(commitMessage)
 * console.log(increment) // => minor
 *
 * const nextVersion = semver.inc('1.1.0', increment)
 * console.log(nextVersion) // => 1.2.0
 * ```
 *
 * @param  {string} `commitMessage` a single commit message, including the new lines
 * @return {string} it is **"increment" type**, as coming from [parse-commit-message][]
 * @api public
 */

module.exports = function detectNextVersion (commitMessage) {
  return parse(commitMessage, mappers.increment).increment
}
