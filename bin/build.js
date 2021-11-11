#!/usr/bin/env node

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const appName = process.argv[2]
const runCommand = command => {
  try {
    execSync(command, {stdio: 'inherit'})
  } catch (e) {
    console.error(`Failed to execute ${command}`, e)
    return false
  }

  return true
}

const createModule = (fileName, data) => {
  fs.writeFileSync(path.resolve(fileName), JSON.stringify(data, null, 2))
}

const enhanceModule = (fileName, cb) => {
  const file = JSON.parse(fs.readFileSync(path.resolve(fileName)).toString())
  createModule(fileName, cb(file))
}

const appendToFile = (fileName, text) => {
  runCommand(`echo "${text}" >> ${path.resolve(fileName)}`)
}

console.log(`Creating React app ${appName}`)
runCommand(`npx create-react-app ${appName} --template typescript`)

console.log('Enhancing gitignore')
appendToFile(`${appName}/.gitignore`, '\\n.idea')

console.log('Adding dependencies and jest config to package.json')
enhanceModule(`${appName}/package.json`, packageJson => ({
  ...packageJson,
  dependencies:{
    ...packageJson.dependencies,
    "@types/styled-components": "^5.1.14",
    "prettier": "2.4.1",
    "styled-components": "5.3.1"
  },
  scripts: {
    ...packageJson.scripts,
    "test:coverage": "yarn test --coverage"
  },
  jest: {
    "collectCoverageFrom": [
      "**/*.{js,jsx,ts,tsx}",
      "!<rootDir>/node_modules/",
      "!<rootDir>/src/index.tsx",
      "!**/*.d.ts"
    ]
  }
}))

console.log('Installing dependencies')
runCommand(`cd ${appName} && yarn`)

console.log('Enhance setupTests.js')
appendToFile(`${appName}/src/setupTests.ts`, 'import { configure } from \'@testing-library/react\'\n' +
  '\n' +
  'configure({\n' +
  '  testIdAttribute: \'data-test\'\n' +
  '})')

console.log('Creating .prettierrc.json')
createModule(`${appName}/.prettierrc.json`, {
    "singleQuote": true,
    "semi": false,
    "trailingComma": "none",
    "overrides": [
      {
        "files": ["*.html"],
        "options": {
          "semi": true
        }
      }
    ]
  }
)

console.log('Creating .stylelintrc.json')
createModule(`${appName}/.stylelintrc.json`, {
    "extends": ["stylelint-config-standard", "stylelint-config-prettier"],
    "plugins": ["stylelint-scss"],
    "rules": {
      "rule-empty-line-before": [
        "always",
        {
          "except": ["after-single-line-comment", "first-nested"]
        }
      ],
      "no-descending-specificity": null,
      "at-rule-no-unknown": null,
      "scss/at-rule-no-unknown": true
    }
  }
)

console.log('Enhancing tsconfig.json')
enhanceModule(`${appName}/tsconfig.json`, tsconfig => ({
  ...tsconfig,
  compilerOptions: {
    ...tsconfig.compilerOptions,
    types: [
      "@testing-library/jest-dom"
    ]
  }
}))

console.log('Committing changes')
runCommand('git add .')
runCommand('git commit -m "Enhance project using @mgaw/custom-react-app"')