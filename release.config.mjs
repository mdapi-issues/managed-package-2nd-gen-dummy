import { readFileSync } from "node:fs";

const packageName = JSON.parse(
  readFileSync("sfdx-project.json", "utf8")
).packageDirectories.find(
  (packageDirectory) => packageDirectory.default
).package;

/**
 * @type {import('semantic-release').GlobalConfig}
 */
export default {
  plugins: [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    [
      "@semantic-release/exec",
      {
        shell: "/bin/bash",
        // update versionNumber for default package directory in sfdx-project.json
        prepareCmd: `yq --inplace '(.packageDirectories.[] | select (.package == "${packageName}").versionNumber)="\${nextRelease.version}.NEXT"' sfdx-project.json`,
        // create package version for default package directory
        publishCmd: `SF_PROJECT_AUTOUPDATE_DISABLE_FOR_PACKAGE_VERSION_CREATE="true" sf package version create --package "${packageName}" --version-number "\${nextRelease.version}.0" --code-coverage --installation-key-bypass --wait 30 --json`,
        // output package version id for GitHub Actions
        // promote package version
        successCmd: `echo packageVersionId="\${releases[0].result.SubscriberPackageVersionId}"\nversion="\${releases[0].result.VersionNumber}" >> \${process.env.GITHUB_OUTPUT};
          sf package version promote --package "\${releases[0].result.SubscriberPackageVersionId}" --no-prompt --json`
      }
    ],
    [
      "@semantic-release/git",
      {
        assets: ["sfdx-project.json"]
      }
    ],
    "@semantic-release/github"
  ]
};
