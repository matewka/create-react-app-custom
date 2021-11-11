# Getting Started with @mgaw/Create-React-App

This project is a custom wrapper over [Create React App](https://github.com/facebook/create-react-app).

You can run it with

```shell
npx @mgaw/custom-react-app your-app-name
```

just like you used to run `create-react-app my-app-name --template=typescript`.

## Enhancements

What this wrapper does, it first installs CRA __with TypeScript__ and then does the following:

* Adds `.idea` to `.gitignore`
* Adds `styled-components`
* Adds `test:coverage` script to `package.json` and proper configuration
* Adds `prettier` with a common config
* Sets up `data-test` as default test attribute for `@testing-library/react`
* Adds common setting stylelint
* Commits all the changes to GIT