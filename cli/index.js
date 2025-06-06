#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const prompts = require("prompts");
const { execSync } = require("child_process");

function getGitHubInfo() {
  const remoteUrl = execSync("git config --get remote.origin.url")
    .toString()
    .trim();

  const httpsPattern = /https:\/\/github\.com\/(.+?)\/(.+?)(\.git)?$/;
  const sshPattern = /git@github\.com:(.+?)\/(.+?)(\.git)?$/;
  let match = remoteUrl.match(httpsPattern) || remoteUrl.match(sshPattern);

  if (!match) {
    throw new Error("Could not determine GitHub username and repo name.");
  }

  return {
    username: match[1],
    repo: match[2],
  };
}

(async () => {
  const response = await prompts([
    {
      type: "select",
      name: "action",
      message: "What would you like to do with the shared directory?",
      choices: [
        {
          title: "Create/Update - Sync content to shared directory",
          value: "sync",
        },
        {
          title:
            "Delete - Remove the remote connection to the shared directory",
          value: "delete",
        },
      ],
    },
    {
      type: (prev) => (prev === "sync" ? "text" : null),
      name: "sourcePath",
      message:
        "Enter the source directory to sync (e.g., 2_scripts) without leading slash:",
    },
    {
      type: "text",
      name: "org",
      message: "Enter the organization:",
    },
    {
      type: "text",
      name: "user",
      message: "Enter the username of the preview git repo:",
    },
  ]);

  const { username, repo } = getGitHubInfo();
  let workflow;

  if (response.action === "sync") {
    const sourceDir = path.join(process.cwd(), response.sourcePath);
    const fileNames = fs
      .readdirSync(sourceDir)
      .filter((file) => fs.statSync(path.join(sourceDir, file)).isFile());

    const baseUrl = `PREVIEW_APP_URL/protected/${username}@${repo}`;
    const urls = fileNames.map((file) => `${baseUrl}/${file}`);
    console.log("\n📂 File access URLs:");
    urls.forEach((url) => console.log(`- ${url}`));

    workflow = `# .github/workflows/sync.yml
name: Sync Directory

on:
  push:
    paths:
      - "${response.sourcePath}/**"
      - ".github/workflows/sync.yml"

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
      with:
        fetch-depth: 2

    - name: Set variables
      run: |
        USER="\${{ github.actor }}"
        REPO="\${{ github.event.repository.name }}"
        DIR="\${USER}@\${REPO}"
        COMMIT_MSG="\$(git log -1 --pretty=format:'%s')"
        COMMIT_SHA="\$(git log -1 --pretty=format:'%H')"
        PUSH_TIME="\$(date -u '+%Y-%m-%d %H:%M:%S UTC')"
        GITHUB_URL="https://github.com/\${USER}/\${REPO}/commit/\${COMMIT_SHA}"
        echo "USER=\$USER" >> \$GITHUB_ENV
        echo "REPO=\$REPO" >> \$GITHUB_ENV
        echo "DIR=\$DIR" >> \$GITHUB_ENV
        echo "COMMIT_MSG=\$COMMIT_MSG" >> \$GITHUB_ENV
        echo "COMMIT_SHA=\$COMMIT_SHA" >> \$GITHUB_ENV
        echo "PUSH_TIME=\$PUSH_TIME" >> \$GITHUB_ENV
        echo "GITHUB_URL=\$GITHUB_URL" >> \$GITHUB_ENV

    - name: Clone target repo and sync content
      run: |
        git clone https://\${{ secrets.GH_SYNC_TOKEN }}@github.com/${response.user}/preview.git
        rm -rf preview/public/protected/\$DIR
        mkdir -p preview/public/protected/\$DIR
        cp -r ${response.sourcePath}/. preview/public/protected/\$DIR/
        echo "Last sync: \$PUSH_TIME" > preview/public/protected/\$DIR/.sync_log
        echo "Last commit: \$COMMIT_MSG" >> preview/public/protected/\$DIR/.sync_log
        echo "Commit SHA: \$COMMIT_SHA" >> preview/public/protected/\$DIR/.sync_log
        echo "Source: \$USER/\$REPO" >> preview/public/protected/\$DIR/.sync_log
        echo "View diff: \$GITHUB_URL" >> preview/public/protected/\$DIR/.sync_log   
        echo "Org: ${response.org}" >> preview/public/protected/\$DIR/.sync_log   
        cd preview
        git config user.name "GitHub Actions"
        git config user.email "actions@github.com"
        git add .
        if ! git diff --cached --quiet; then
          git commit -m "Sync content from source repo"
          git push
        else
          echo "No changes to commit"
        fi
`;
  } else {
    workflow = `# .github/workflows/sync.yml
name: Delete Directory

on:
  push:
    paths:
      - ".github/workflows/sync.yml"

jobs:
  delete:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3

    - name: Set variables
      run: |
        USER="\${{ github.actor }}"
        REPO="\${{ github.event.repository.name }}"
        DIR="\${USER}@\${REPO}"
        echo "USER=\$USER" >> \$GITHUB_ENV
        echo "REPO=\$REPO" >> \$GITHUB_ENV
        echo "DIR=\$DIR" >> \$GITHUB_ENV

    - name: Clone target repo and remove directory
      run: |
        git clone https://\${{ secrets.GH_SYNC_TOKEN }}@github.com/${response.user}/preview.git
        rm -rf preview/public/protected/\$DIR
        cd preview
        git config user.name "GitHub Actions"
        git config user.email "actions@github.com"
        git add .
        if ! git diff --cached --quiet; then
          git commit -m "Remove directory from shared repo"
          git push
        else
          echo "No changes to commit"
        fi
`;
  }

  const destDir = path.join(process.cwd(), ".github", "workflows");
  fs.mkdirSync(destDir, { recursive: true });
  fs.writeFileSync(path.join(destDir, "sync.yml"), workflow);

  const actionText =
    response.action === "sync" ? "sync content to" : "delete content from";
  console.log(
    `\n✅ GitHub Actions workflow to ${actionText} shared directory created at .github/workflows/sync.yml. Make sure to add the GH_SYNC_TOKEN secret in your repository settings.`
  );
})();
