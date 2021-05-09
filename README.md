# MTG Deck Editor

A project built with [Gatsby](https://www.gatsbyjs.org), a static site generator
using [React](https://reactjs.org).

If you have any problems setting up or running the project, please file an
issue.

### Project Status

This is a very early, work in progress project. It's final form and home is TBD.

## Prerequisites

-   [Node 12.16.3](https://nodejs.org/en/):
    [nvm](https://github.com/creationix/nvm) is recommended to manage Node
    versions
-   [Yarn](https://yarnpkg.com/en/): manages JavaScript Dependencies
-   [Gatsby CLI](https://www.gatsbyjs.org/docs/gatsby-cli/)

## Setup

In the project directory, install dependencies with:

```sh
$ yarn install
```

### Development Server

Run the development server with:

```sh
$ yarn start
```

View the site in a browser at `localhost:8000`

### Validating Javascript

A few tools are used to enhance and validate JavaScript. It's recommended to
install plugins for these in your text editor, if available, to validate and
format on save.

-   Typescript is used to type-check JavaScript. Run `$ yarn types:check` to
    check manually.
-   [Prettier](https://prettier.io) formats JavaScript and CSS, enforcing
    consistency and reducing incidental changes. Run `$ yarn format` to manually
    format.
-   [ESLint](https://eslint.org) checks for some kinds of JavaScript errors. Run
    `$ yarn lint` to manually check.

### Troubleshooting

Sometimes the app gets into a broken state that does not provide meaningful
errors. This happens especially when changing the structure of data or files
names. In this case try:

-   Restarting the development server
-   Check the console running `$ yarn start` for errors
-   Run `$ yarn clean` to remove cache and build folders and restart

### Updating Dependencies

After pulling changes, update all installed dependencies to the locked versions
with:

```sh
$ yarn install
```
