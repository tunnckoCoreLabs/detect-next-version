/**
 * @copyright 2017-present, Charlike Mike Reagent <olsten.larck@gmail.com>
 * @license Apache-2.0
 */

module.exports = function detectChange (commit) {
  const commitParts = commit.split('\n');
  const header = commitParts[0];
  const body = commitParts.slice(1).join('\n');
  const parts = /^(\w+)(?:\((.+)\))?\: (.+)$/.exec(header);
  const breaking = 'BREAKING CHANGE';

  const isBreaking = header.includes(breaking) || body.includes(breaking);
  let increment = null;

  if (/fix|bugfix|patch/.test(parts[1])) {
    increment = 'patch';
  }
  if (/feat|feature|minor/.test(parts[1])) {
    increment = 'minor';
  }
  if (/break|breaking|major/.test(parts[1]) || isBreaking) {
    increment = 'major';
  }

  return increment;
};
