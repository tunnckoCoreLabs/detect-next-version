# detect-next-version [![npm version][npmv-img]][npmv-url] [![github release][ghrelease-img]][ghrelease-url] [![License][license-img]][license-url]

> Calculates next version, based on given commit message and following Conventional Commits

Please consider following this project's author, [Charlike Mike Reagent](https://github.com/tunnckoCore), and :star: the project to show your :heart: and support.

<div id="thetop"></div>

[![Code style][codestyle-img]][codestyle-url]
[![CircleCI linux build][linuxbuild-img]][linuxbuild-url]
[![CodeCov coverage status][codecoverage-img]][codecoverage-url]
[![DavidDM dependency status][dependencies-img]][dependencies-url]
[![Renovate App Status][renovateapp-img]][renovateapp-url]
[![Make A Pull Request][prs-welcome-img]][prs-welcome-url]
[![Semantically Released][new-release-img]][new-release-url]

If you have any _how-to_ kind of questions, please read the [Contributing Guide](./CONTRIBUTING.md) and [Code of Conduct](./CODE_OF_CONDUCT.md) documents.  
For bugs reports and feature requests, [please create an issue][open-issue-url] or ping
[@tunnckoCore](https://twitter.com/tunnckoCore) at Twitter.

[![Become a Patron][patreon-img]][patreon-url]
[![Conventional Commits][ccommits-img]][ccommits-url]
[![NPM Downloads Weekly][downloads-weekly-img]][npmv-url]
[![NPM Downloads Monthly][downloads-monthly-img]][npmv-url]
[![NPM Downloads Total][downloads-total-img]][npmv-url]
[![Share Love Tweet][shareb]][shareu]

Project is [semantically](https://semver.org) & automatically released on [CircleCI](https://circleci.com) with [new-release][] and its [New Release](https://github.com/apps/new-release) GitHub App.

<!-- Logo when needed:

<p align="center">
  <a href="https://github.com/tunnckoCoreLabs/detect-next-version">
    <img src="./media/logo.png" width="85%">
  </a>
</p>

-->

## Table of Contents

- [Install](#install)
- [API](#api)
  * [src/index.js](#srcindexjs)
    + [detectNextVersion](#detectnextversion)
- [See Also](#see-also)
- [Contributing](#contributing)
  * [Follow the Guidelines](#follow-the-guidelines)
  * [Support the project](#support-the-project)
  * [OPEN Open Source](#open-open-source)
  * [Wonderful Contributors](#wonderful-contributors)
- [License](#license)

## Install

This project requires [**Node.js**](https://nodejs.org) **^8.11.0 || >=10.13.0**. Install it using
[**yarn**](https://yarnpkg.com) or [**npm**](https://npmjs.com).  
_We highly recommend to use Yarn when you think to contribute to this project._

```bash
$ yarn add detect-next-version
```

## API

<!-- docks-start -->
_Generated using [docks](http://npm.im/docks)._

### [src/index.js](/src/index.js)

#### [detectNextVersion](/src/index.js#L72)
Calculates next version of given package with `name`,
based given `commitMessages` which should follow
the [Conventional Commits Specification](https://www.conventionalcommits.org/).
Options are passed directly to [@tunnckocore/package-json](https://ghub.io/@tunnckocore/package-json) and
[recommended-bump][] packages. Also because the recommended-bump, you can
pass `options.plugins` which will be passed to [parse-commit-message][]
commit message parser. So follow their docs and see the tests here for
example usage. If all commit messages are of type that is not `patch|fix|minor|feat|major`
or containing `BREAKING CHANGE:` label (e.g. the `chore` type), then the
returned result won't have `nextVersion` and `increment` will be `false`.

**Params**
- `name` **{string}** a package name which you looking to update
- `commits` **{string|}** directly passed to [recommended-bump][]
                         May be one of `string`, `Array<string>` or `Array<Commit>`
- `[options]` **{object}** optional, passed to above mentioned packages.

**Returns**
- `object` an object which is basically the return of [recommended-bump][]
                 plus `{ pkg, lastVersion, nextVersion? }`.

**Examples**
```ts
type Commit = {
  header: {
    type: string,
    scope: string,
    subject: string,
    toString: Function,
  },
  body: string | null,
  footer: string | null
}
```
```javascript
import detector from 'detect-next-version';

async function main() {
  const commits = ['chore(ci): some build tweaks', 'fix(cli): foo bar'];

  // consider `my-npm-package` is version 0.1.0
  const result = await detector('my-npm-package', commits);
  console.log(result.increment); // => 'patch'
  console.log(result.pkg); // => package's latest package.json metadata
  console.log(result.lastVersion); // => '0.1.0'
  console.log(result.nextVersion); // => '0.1.1'
  console.log(result.patch[0].header.type); // => 'fix'
  console.log(result.patch[0].header.scope); // => 'cli'
  console.log(result.patch[0].header.subject); // => 'foobar'
  console.log(result.patch[0].header.toString()); // => 'fix(cli): foobar'
}

main().catch(console.error);
```
```javascript
import { parse, plugins } from 'parse-commit-message';
import detectNextVersion from 'detect-next-version';

async function main() {
  const commitOne = parse('fix: foo bar', plugins);
  const commitTwo = parse('feat: some feature subject', plugins);

  const result = detectNextVersion('@my-org/my-awesomepkg', [commitOne, commitTwo]);
  console.log(result.increment); // => 'minor'
}

main().catch(console.error);
```

<!-- docks-end -->

**[back to top](#thetop)**

## See Also

Some of these projects are used here or were inspiration for this one, others are just related. So, thanks for your
existance!
- [@tunnckocore/config](https://www.npmjs.com/package/@tunnckocore/config): All the configs for all the tools, in one place | [homepage](https://github.com/tunnckoCoreLabs/config "All the configs for all the tools, in one place")
- [@tunnckocore/create-github-repo](https://www.npmjs.com/package/@tunnckocore/create-github-repo): Small and fast way to create GitHub repository! Provides API… [more](https://github.com/tunnckoCoreLabs/create-github-repo) | [homepage](https://github.com/tunnckoCoreLabs/create-github-repo "Small and fast way to create GitHub repository! Provides API and CLI")
- [@tunnckocore/create-project](https://www.npmjs.com/package/@tunnckocore/create-project): Create and scaffold a new project, its GitHub repository and… [more](https://github.com/tunnckoCoreLabs/create-project) | [homepage](https://github.com/tunnckoCoreLabs/create-project "Create and scaffold a new project, its GitHub repository and contents")
- [@tunnckocore/execa](https://www.npmjs.com/package/@tunnckocore/execa): Thin layer on top of [execa][] that allows executing multiple… [more](https://github.com/tunnckoCoreLabs/execa) | [homepage](https://github.com/tunnckoCoreLabs/execa "Thin layer on top of [execa][] that allows executing multiple commands in parallel or in sequence")
- [@tunnckocore/scripts](https://www.npmjs.com/package/@tunnckocore/scripts): Universal and minimalist scripts & tasks runner. | [homepage](https://github.com/tunnckoCoreLabs/scripts "Universal and minimalist scripts & tasks runner.")
- [@tunnckocore/update](https://www.npmjs.com/package/@tunnckocore/update): Update a repository with latest templates from `charlike`. | [homepage](https://github.com/tunnckoCoreLabs/update "Update a repository with latest templates from `charlike`.")
- [charlike](https://www.npmjs.com/package/charlike): Small & fast project scaffolder with sane defaults. Supports hundreds… [more](https://github.com/tunnckoCoreLabs/charlike) | [homepage](https://github.com/tunnckoCoreLabs/charlike "Small & fast project scaffolder with sane defaults. Supports hundreds of template engines through the @JSTransformers API or if you want custom `render` function passed through options")
- [execa](https://www.npmjs.com/package/execa): A better `child_process` | [homepage](https://github.com/sindresorhus/execa#readme "A better `child_process`")
- [gitcommit](https://www.npmjs.com/package/gitcommit): Lightweight and joyful `git commit` replacement. Conventional Commits compliant. | [homepage](https://github.com/tunnckoCore/gitcommit "Lightweight and joyful `git commit` replacement. Conventional Commits compliant.")
- [recommended-bump](https://www.npmjs.com/package/recommended-bump): Calculates recommended bump (next semver version) based on given array… [more](https://github.com/tunnckoCoreLabs/recommended-bump) | [homepage](https://github.com/tunnckoCoreLabs/recommended-bump "Calculates recommended bump (next semver version) based on given array of commit messages following Conventional Commits specification")

**[back to top](#thetop)**

## Contributing

### Follow the Guidelines

Please read the [Contributing Guide](./CONTRIBUTING.md) and [Code of Conduct](./CODE_OF_CONDUCT.md) documents for advices.  
For bugs reports and feature requests, [please create an issue][open-issue-url] or ping
[@tunnckoCore](https://twitter.com/tunnckoCore) at Twitter.

### Support the project

[Become a Partner or Sponsor?][patreon-url] :dollar: Check the **Partner**, **Sponsor** or **Omega-level** tiers! :tada: You can get your company logo, link & name on this file. It's also rendered on package page in [npmjs.com][npmv-url] and [yarnpkg.com](https://yarnpkg.com/en/package/detect-next-version) sites too! :rocket:

Not financial support? Okey! [Pull requests](https://github.com/tunnckoCoreLabs/contributing#opening-a-pull-request), stars and all kind of [contributions](https://opensource.guide/how-to-contribute/#what-it-means-to-contribute) are always
welcome. :sparkles:

### OPEN Open Source

This project is following [OPEN Open Source](http://openopensource.org) model

> Individuals making significant and valuable contributions are given commit-access to the project to contribute as they see fit. This project is built on collective efforts and it's not strongly guarded by its founders.

There are a few basic ground-rules for its contributors

1. Any **significant modifications** must be subject to a pull request to get feedback from other contributors.
2. [Pull requests](https://github.com/tunnckoCoreLabs/contributing#opening-a-pull-request) to get feedback are _encouraged_ for any other trivial contributions, but are not required.
3. Contributors should attempt to adhere to the prevailing code-style and development workflow.

### Wonderful Contributors

Thanks to the hard work of these wonderful people this project is alive! It follows the
[all-contributors](https://github.com/kentcdodds/all-contributors) specification.  
Don't hesitate to add yourself to that list if you have made any contribution! ;) [See how,
here](https://github.com/jfmengels/all-contributors-cli#usage).

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
| [<img src="https://avatars3.githubusercontent.com/u/5038030?v=4" width="120px;"/><br /><sub><b>Charlike Mike Reagent</b></sub>](https://tunnckocore.com)<br />[💻](https://github.com/tunnckoCoreLabs/detect-next-version/commits?author=tunnckoCore "Code") [📖](https://github.com/tunnckoCoreLabs/detect-next-version/commits?author=tunnckoCore "Documentation") [💬](#question-tunnckoCore "Answering Questions") [👀](#review-tunnckoCore "Reviewed Pull Requests") [🔍](#fundingFinding-tunnckoCore "Funding Finding") |
| :---: |

<!-- ALL-CONTRIBUTORS-LIST:END -->

Consider showing your [support](#support-the-project) to them. :sparkling_heart:

## License

Copyright (c) 2017-present, [Charlike Mike Reagent](https://tunnckocore.com) `<mameto2011@gmail.com>` & [contributors](#wonderful-contributors).  
Released under the [Apache-2.0 License][license-url].

<!-- Heading badges -->

[npmv-url]: https://www.npmjs.com/package/detect-next-version
[npmv-img]: https://badgen.net/npm/v/detect-next-version?icon=npm

[ghrelease-url]: https://github.com/tunnckoCoreLabs/detect-next-version/releases/latest
[ghrelease-img]: https://badgen.net/github/release/tunnckoCoreLabs/detect-next-version?icon=github

[license-url]: https://github.com/tunnckoCoreLabs/detect-next-version/blob/master/LICENSE
[license-img]: https://badgen.net/npm/license/detect-next-version

<!-- Front line badges -->

[codestyle-url]: https://github.com/airbnb/javascript
[codestyle-img]: https://badgen.net/badge/code%20style/airbnb/ff5a5f?icon=airbnb

[linuxbuild-url]: https://circleci.com/gh/tunnckoCoreLabs/detect-next-version/tree/master
[linuxbuild-img]: https://badgen.net/circleci/github/tunnckoCoreLabs/detect-next-version/master?label=build&icon=circleci

[codecoverage-url]: https://codecov.io/gh/tunnckoCoreLabs/detect-next-version
[codecoverage-img]: https://badgen.net/codecov/c/github/tunnckoCoreLabs/detect-next-version?icon=codecov

[dependencies-url]: https://david-dm.org/tunnckoCoreLabs/detect-next-version
[dependencies-img]: https://badgen.net/david/dep/tunnckoCoreLabs/detect-next-version?label=deps

[ccommits-url]: https://conventionalcommits.org/
[ccommits-img]: https://badgen.net/badge/conventional%20commits/v1.0.0/dfb317
[new-release-url]: https://ghub.io/new-release
[new-release-img]: https://badgen.net/badge/semantically/released/05c5ff

[downloads-weekly-img]: https://badgen.net/npm/dw/detect-next-version
[downloads-monthly-img]: https://badgen.net/npm/dm/detect-next-version
[downloads-total-img]: https://badgen.net/npm/dt/detect-next-version

[renovateapp-url]: https://renovatebot.com
[renovateapp-img]: https://badgen.net/badge/renovate/enabled/green
[prs-welcome-img]: https://badgen.net/badge/PRs/welcome/green
[prs-welcome-url]: http://makeapullrequest.com
[paypal-donate-url]: https://paypal.me/tunnckoCore/10
[paypal-donate-img]: https://badgen.net/badge/$/support/purple
[patreon-url]: https://www.patreon.com/bePatron?u=5579781
[patreon-img]: https://badgen.net/badge/patreon/tunnckoCore/F96854?icon=patreon
[patreon-sponsor-img]: https://badgen.net/badge/become/a%20sponsor/F96854?icon=patreon

[shareu]: https://twitter.com/intent/tweet?text=https://github.com/tunnckoCoreLabs/detect-next-version&via=tunnckoCore
[shareb]: https://badgen.net/badge/twitter/share/1da1f2?icon=twitter
[open-issue-url]: https://github.com/tunnckoCoreLabs/detect-next-version/issues/new

[execa]: https://github.com/sindresorhus/execa
[new-release]: https://github.com/tunnckoCore/new-release
[parse-commit-message]: https://github.com/olstenlarck/parse-commit-message
[recommended-bump]: https://github.com/tunnckoCoreLabs/recommended-bump
[semantic-release]: https://github.com/semantic-release/semantic-release