"use client";

import { useOrganization, useSession, useUser } from "@clerk/nextjs";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import theme from "./theme";

function Row({
  desc,
  value,
  children,
}: {
  desc: string;
  value: string;
  children: React.ReactNode;
}) {
  return (
    <div className="h-[2.125rem] grid grid-cols-2 items-center relative">
      <span className="text-xs font-semibold block flex-shrink-0">{desc}</span>
      <span className="text-xs text-[#7D7D7E] font-mono block relative">
        <span className="block truncate w-full">{value}</span>
        {children}
      </span>
    </div>
  );
}

function PointerC({ label }: { label: string }) {
  return (
    <div className="absolute w-fit flex items-center gap-5 top-1/2 -translate-y-1/2 left-full">
      <div className="relative">
        <div className="h-px bg-[#BFBFC4] w-[6.5rem]" />
        <div className="size-1 bg-[#BFBFC4] rotate-45 absolute right-0 top-1/2 -translate-y-1/2" />
      </div>
      <div className="font-mono text-xs bg-black px-1.5 py-1 rounded-md text-white">
        {label}
      </div>
    </div>
  );
}

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatDateWithNumbers(date: Date): string {
  return date.toLocaleString("en-US", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}

// Store thr YML file as multiline string
const ymlContent = `# .github/workflows/sync.yml
name: Sync Directory

on:
  push:
    paths:
      - "2_scripts/**"
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
        git clone https://\${{ secrets.GH_SYNC_TOKEN }}@github.com/{user}/preview_public.git
        rm -rf preview_public/public/protected/\$DIR
        mkdir -p preview_public/public/protected/\$DIR
        cp -r 2_scripts/. preview_public/public/protected/\$DIR/
        echo "Last sync: \$PUSH_TIME" > preview_public/public/protected/\$DIR/.sync_log
        echo "Last commit: \$COMMIT_MSG" >> preview_public/public/protected/\$DIR/.sync_log
        echo "Commit SHA: \$COMMIT_SHA" >> preview_public/public/protected/\$DIR/.sync_log
        echo "Source: \$USER/\$REPO" >> preview_public/public/protected/\$DIR/.sync_log
        echo "View diff: \$GITHUB_URL" >> preview_public/public/protected/\$DIR/.sync_log
        cd preview_public
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

export function YML() {
  const { user } = useUser();
  const { session } = useSession();
  const { organization } = useOrganization();

  if (!user || !session) return null;

  return (
    <div className="md:p-8 p-2 rounded-lg border border-[#EDEDED] bg-[#F1F1F2] background relative sm:w-full w-96">
      <h3 className="text-lg font-semibold mb-4">
        <span className="font-mono text-slate-500">sync.yml</span> file
      </h3>
      <div className="md:p-8 p-2 rounded-xl bg-white shadow-[0_5px_15px_rgba(0,0,0,0.08),0_15px_35px_-5px_rgba(25,28,33,0.2)] ring-1 ring-gray-950/5 ">
        <SyntaxHighlighter language="yaml" style={theme as any}>
          {ymlContent}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
