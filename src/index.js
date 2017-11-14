/**
 * @copyright 2017-present, Charlike Mike Reagent <olsten.larck@gmail.com>
 * @license Apache-2.0
 */

const parseCommitMessage = require('parse-commit-message')

/**
 * > Parses given `commitMessage` and returns an **"increment" type**,
 * like `'patch'`, `'minor'` or `'major'`. That's useful to be passed
 * to the [semver][]'s `inc()` method (see below example).
 *
 * > If you pass `full` param, then a **"commit" object** will be return,
 * which comes directly from [parse-commit-message][] and contains few properties
 * like `type`, `scope`, `subject`, `increment`, `body`, `isBreaking` and etc.
 *
 * **Example**
 *
 * ```js
 * const semver = require('semver')
 * const detectNext = require('detect-next-version')
 *
 * const commitMessage = 'fix(ng-list): updates the list order, thanks @hercules'
 *
 * const increment = detectNext(commitMessage)
 * console.log(increment) // => minor
 *
 * const commit = detectNext(commitMessage, true)
 * // => { type: 'fix',
 * // scope: 'ng-list',
 * // subject: 'updates the list order, thanks @hercules',
 * // header: 'fix(ng-list): updates the list order, thanks @hercules',
 * // body: null,
 * // footer: null,
 * // increment: 'patch',
 * // isBreaking: false }
 *
 * const nextVersion = semver.inc('1.1.0', commit.increment)
 * console.log(nextVersion) // => 1.1.1
 * ```
 *
 * @param  {string}  `commitMessage` a single commit message, including the new lines
 * @param  {boolean} `full` pass `true` if you want to get commit object, instead of increment type
 * @return {string|Object} if string it is **"increment" type**, otherwise **"commit" object**
 * @api public
 */

module.exports = function detectNextVersion (commitMessage, full) {
  const result = parseCommitMessage(commitMessage, incrementMapper)
  return full === true ? result : result.increment
}

function incrementMapper (commit) {
  const isBreaking = isBreakingChange(commit)
  let increment = null

  if (/fix|bugfix|patch/.test(commit.type)) {
    increment = 'patch'
  }
  if (/feat|feature|minor/.test(commit.type)) {
    increment = 'minor'
  }
  if (/break|breaking|major/.test(commit.type) || isBreaking) {
    increment = 'major'
  }

  return Object.assign({}, commit, { increment, isBreaking })
}

/* eslint-disable no-param-reassign */

function isBreakingChange ({ subject, body, footer }) {
  body = body || ''
  footer = footer || ''

  const re = 'BREAKING CHANGE:'
  return subject.includes(re) || body.includes(re) || footer.includes(re)
}
