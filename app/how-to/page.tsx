import { YML } from "../components/yml";
import { Token } from "../components/token";
import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import { CodeSwitcher } from "../components/code-switcher";
import { LearnMore } from "../components/learn-more";
import { Footer } from "../components/footer";
import { ClerkLogo } from "../components/clerk-logo";
import { NextLogo } from "../components/next-logo";

import { CARDS } from "../consts/cards";

export default async function DashboardPage() {
  return (
    <>
      <main className="max-w-[75rem] w-full mx-auto p-6">
        <div className="grid grid-cols-1 gap-10">
          <div>
            <header className="flex items-center justify-between sm:w-full w-96 h-16 gap-4">
              <div className="flex gap-4">
                <ClerkLogo />
              </div>
              <div className="flex items-center gap-2">
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      userButtonAvatarBox: "size-6",
                    },
                  }}
                />
              </div>
            </header>
            <h1 className="text-3xl font-semibold mt-6 mb-2">Quick Start</h1>
            <p className="text-slate-500">
              Complete workflow can be found{" "}
              <a href="/workflow" className="text-purple-700 hover:underline">
                here
              </a>
            </p>
            <div className="mb-4 sm:w-full w-96">
              <h2 className="text-xl font-semibold mt-6 mb-2">
                <span className="font-mono text-slate-500">Step 1:</span>{" "}
                Advisor shares the{" "}
                <a
                  href="https://github.blog/security/application-security/introducing-fine-grained-personal-access-tokens-for-github/"
                  className="text-purple-700 hover:underline"
                >
                  Fine-Grained Access Token
                </a>{" "}
                with the student
              </h2>
              <Token />
            </div>
            <div className="border-t border-gray-200 my-4" />
            <div className="mb-4 sm:w-full w-96">
              <h2 className="text-xl font-semibold mb-2">
                <span className="font-mono text-slate-500">Step 2:</span>{" "}
                Student enters the access token as a{" "}
                <a
                  href="https://docs.github.com/en/actions/security-for-github-actions/security-guides/using-secrets-in-github-actions"
                  className="text-purple-700 hover:underline"
                >
                  repository secret
                </a>{" "}
                in GitHub
              </h2>
            </div>
            <div className="border-t border-gray-200 my-4" />
            <div className="mb-4 sm:w-full w-96">
              <h2 className="text-xl font-semibold mb-2">
                <span className="font-mono text-slate-500">Step 3:</span>{" "}
                Student sets up the GitHub Action workflow, by running{" "}
                <span className="font-mono text-purple-700">
                  <a
                    href="https://www.npmjs.com/package/create-preview-workflow"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    npx create-preview-workflow
                  </a>
                </span>{" "}
                at the repository root ( requires Node.js ) or by copying the
                <span className="font-mono text-slate-500"> sync.yml</span> file
                into their repository at{" "}
                <span className="font-mono text-slate-500">
                  /.github/workflows/sync.yml
                </span>
              </h2>
              <p className="text-sm text-slate-500">
                Change the{" "}
                <span className="font-mono text-slate-500">2_scripts</span> path
                in the{" "}
                <span className="font-mono text-slate-500">sync.yml</span> file
                to match the repository structure.
              </p>
            </div>
            <YML />
            <div className="border-t border-gray-200 my-4" />
            <div className="mb-4 sm:w-full w-96">
              <h2 className="text-xl font-semibold mb-2">
                <span className="font-mono text-slate-500">Step 4:</span> The
                student commits the changes to the repository and when the
                source directory is updated, the workflow will be triggered and
                the content will be accessible at Preview Dashboard to the
                advisor ( and the collaborators who were given access)
              </h2>
            </div>

            <p className="text-slate-500">
              {" "}
              Shareable link for each file can be copied from the Dashboard. The
              link will be only accessible to the advisor and the collaborators
              who were given access.
            </p>

            <div className="border-t border-gray-200 my-4" />
            <div className="mb-4 sm:w-full w-96">
              <h2 className="text-xl font-semibold mb-2">
                <span className="font-mono text-slate-500">Step 5:</span> The
                connection can be removed by deleting the{" "}
                <span className="font-mono text-slate-500"> sync.yml</span> file
                from the repository and the content will no longer be synced to
                the Preview Dashboard.
              </h2>
            </div>
          </div>
        </div>
      </main>
      <LearnMore cards={CARDS} />
      <Footer />
    </>
  );
}
