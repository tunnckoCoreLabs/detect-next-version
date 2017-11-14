/**
 * @copyright 2017-present, Charlike Mike Reagent <olsten.larck@gmail.com>
 * @license Apache-2.0
 */

const parseGitCommit = require('parse-git-commit');

module.exports = function detectChange (commitMessage) {
  const result = parseGitCommit(commitMessage, incrementMapper);
  return result.increment;
};

function incrementMapper (commit) {
  const isBreaking = isBreakingChange(commit);
  let increment = null;

  if (/fix|bugfix|patch/.test(commit.type)) {
    increment = 'patch';
  }
  if (/feat|feature|minor/.test(commit.type)) {
    increment = 'minor';
  }
  if (/break|breaking|major/.test(commit.type) || isBreaking) {
    increment = 'major';
  }

  return Object.assign({}, commit, { increment, isBreaking });
}

/* eslint-disable no-param-reassign */

function isBreakingChange ({ subject, body, footer }) {
  body = body || '';
  footer = footer || '';

  const re = 'BREAKING CHANGE:';
  return subject.includes(re) || body.includes(re) || footer.includes(re);
}
