# newlibrary
maintainer facing readme

## Local Dev
### Installation
1. `npm i`
2. `npm start` (http://localhost:4200/)

### Code Quality Checks
- Linting - `npm run lint`
- Tests - `npm run test` | `npm run test-once`
   - The single run test command will also generate a code coverage report.

## Publishing a new version
1. Update the version number in `public/package.json`
   - Use [semver](https://semver.org/) standards
2. Merge the changeset through to master
   - The GitHub Action Pipeline will handle publishing a new version of the package
