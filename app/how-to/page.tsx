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
            <h1 className="text-3xl font-semibold mt-6 mb-2">
              Getting Started
            </h1>
            <p className="text-slate-500 mb-8">
              Securely publish and share content from private GitHub
              repositories as authenticated websites.
            </p>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                Setting Up the Dashboard
              </h2>

              <div className="mb-6 sm:w-full w-96">
                <h3 className="text-xl font-semibold mb-2">
                  <span className="font-mono text-slate-500">Step 1:</span>{" "}
                  Clone and Configure Repository
                </h3>
                <p className="text-slate-500 mb-2">
                  Clone this repository and make it private. Generate a
                  fine-grained access token with clone and push permissions.
                </p>
                <div className="bg-gray-50 p-3 rounded font-mono text-sm">
                  git clone https://github.com/ssm123ssm/preview_public.git
                  <br />
                  cd preview_public
                </div>
              </div>

              <div className="mb-6 sm:w-full w-96">
                <h3 className="text-xl font-semibold mb-2">
                  <span className="font-mono text-slate-500">Step 2:</span> Set
                  Up Clerk Authentication
                </h3>
                <p className="text-slate-500">
                  Register at Clerk, create an organization named "My
                  organization" and obtain your API keys.
                </p>
              </div>

              <div className="mb-6 sm:w-full w-96">
                <h3 className="text-xl font-semibold mb-2">
                  <span className="font-mono text-slate-500">Step 3:</span>{" "}
                  Configure Environment Variables
                </h3>
                <p className="text-slate-500 mb-2">
                  Create a <span className="font-mono">.env.local</span> file:
                </p>
                <div className="bg-gray-50 p-3 rounded font-mono text-sm">
                  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key_here
                  <br />
                  CLERK_SECRET_KEY=your_secret_key_here
                </div>
              </div>

              <div className="mb-6 sm:w-full w-96">
                <h3 className="text-xl font-semibold mb-2">
                  <span className="font-mono text-slate-500">Step 4:</span>{" "}
                  Deploy to Vercel
                </h3>
                <p className="text-slate-500">
                  Deploy your application and add environment variables in
                  Vercel dashboard.
                </p>
              </div>
            </div>

            <div className="border-t border-gray-200 my-8" />

            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                Sharing Content from Private Repositories
              </h2>

              <div className="mb-6 sm:w-full w-96">
                <h3 className="text-xl font-semibold mb-2">
                  <span className="font-mono text-slate-500">Step 1:</span>{" "}
                  Generate and Share{" "}
                  <a
                    href="https://github.blog/security/application-security/introducing-fine-grained-personal-access-tokens-for-github/"
                    className="text-purple-700 hover:underline"
                  >
                    Fine-Grained Access Token
                  </a>
                </h3>
                <p className="text-slate-500 mb-2">
                  Generate a token with appropriate permissions for your private
                  repository.
                </p>
                <Token />
              </div>

              <div className="mb-6 sm:w-full w-96">
                <h3 className="text-xl font-semibold mb-2">
                  <span className="font-mono text-slate-500">Step 2:</span>{" "}
                  Configure{" "}
                  <a
                    href="https://docs.github.com/en/actions/security-for-github-actions/security-guides/using-secrets-in-github-actions"
                    className="text-purple-700 hover:underline"
                  >
                    Repository Secrets
                  </a>
                </h3>
                <p className="text-slate-500">
                  Add your access token as a repository secret in GitHub
                  Settings → Secrets and variables → Actions.
                </p>
              </div>

              <div className="mb-6 sm:w-full w-96">
                <h3 className="text-xl font-semibold mb-2">
                  <span className="font-mono text-slate-500">Step 3:</span> Set
                  Up GitHub Action Workflow
                </h3>
                <p className="text-slate-500 mb-2">
                  Choose one of these methods:
                </p>
                <div className="mb-3">
                  <p className="font-semibold text-sm mb-1">
                    Option A: Using NPX (Recommended)
                  </p>
                  <div className="bg-gray-50 p-3 rounded font-mono text-sm">
                    <a
                      href="https://www.npmjs.com/package/create-preview-workflow"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-700 hover:underline"
                    >
                      npx create-preview-workflow
                    </a>
                  </div>
                </div>
                <div className="mb-3">
                  <p className="font-semibold text-sm mb-1">
                    Option B: Manual Setup
                  </p>
                  <p className="text-sm text-slate-500">
                    Copy the <span className="font-mono">sync.yml</span> file
                    into your repository at{" "}
                    <span className="font-mono">
                      /.github/workflows/sync.yml
                    </span>
                  </p>
                </div>
              </div>

              <YML />

              <div className="mb-6 sm:w-full w-96">
                <h3 className="text-xl font-semibold mb-2">
                  <span className="font-mono text-slate-500">Step 4:</span>{" "}
                  Configure Workflow Parameters
                </h3>
                <p className="text-slate-500 mb-2">
                  When using the NPX tool, provide:
                </p>
                <ul className="text-sm text-slate-500 list-disc ml-6 space-y-1">
                  <li>
                    <strong>Directory to share:</strong> Path to content you
                    want to publish
                  </li>
                  <li>
                    <strong>Organization name:</strong> "My organization" (must
                    match Clerk organization)
                  </li>
                  <li>
                    <strong>Preview repository username:</strong> Your preview
                    repository username
                  </li>
                </ul>
                <p className="text-sm text-slate-500 mt-2">
                  Update the directory path in the{" "}
                  <span className="font-mono">sync.yml</span> file to match your
                  repository structure.
                </p>
              </div>

              <div className="mb-6 sm:w-full w-96">
                <h3 className="text-xl font-semibold mb-2">
                  <span className="font-mono text-slate-500">Step 5:</span>{" "}
                  Commit and Sync
                </h3>
                <p className="text-slate-500 mb-2">
                  Commit the workflow file and push changes:
                </p>
                <div className="bg-gray-50 p-3 rounded font-mono text-sm mb-2">
                  git add .github/workflows/sync.yml
                  <br />
                  git commit -m "Add preview workflow"
                  <br />
                  git push origin main
                </div>
                <p className="text-slate-500">
                  When content in your specified directory is updated, the
                  workflow automatically triggers and syncs to your preview
                  repository.
                </p>
              </div>

              <div className="mb-6 sm:w-full w-96">
                <h3 className="text-xl font-semibold mb-2">
                  <span className="font-mono text-slate-500">Step 6:</span>{" "}
                  Access Content
                </h3>
                <p className="text-slate-500">
                  Content becomes accessible through the Preview Dashboard.
                  Shareable links for individual files can be copied from the
                  Dashboard and are only accessible to authenticated users in
                  your organization.
                </p>
              </div>
            </div>

            <div className="border-t border-gray-200 my-6" />

            <div className="mb-6 sm:w-full w-96">
              <h2 className="text-xl font-semibold mb-2">
                Access Control and Management
              </h2>
              <p className="text-slate-500">
                Control user access through your Clerk organization dashboard
                and manage collaborators and their permission levels from the
                Preview Dashboard.
              </p>
            </div>

            <div className="border-t border-gray-200 my-6" />

            <div className="mb-6 sm:w-full w-96">
              <h2 className="text-xl font-semibold mb-2">
                Removing the Connection
              </h2>
              <p className="text-slate-500">
                To stop syncing content, delete the{" "}
                <span className="font-mono">sync.yml</span> file from your
                repository's{" "}
                <span className="font-mono">/.github/workflows/</span>{" "}
                directory. Content will no longer sync to the Preview Dashboard.
              </p>
            </div>
          </div>
        </div>
      </main>
      <LearnMore cards={CARDS} />
      <Footer />
    </>
  );
}
