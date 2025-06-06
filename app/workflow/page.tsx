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
        <div className="grid grid-cols-1 gap-10  ">
          <div>
            <header className="flex items-center justify-between md:w-full w-96 h-16 gap-4">
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
            <h1 className="text-3xl font-semibold mt-6 mb-2">Workflow</h1>
            <div className="max-w-[600px] mt-10">
              <p className="text-slate-500">
                <span className="font-semibold">Preview</span> is a NextJS
                application. The{" "}
                <a
                  href="https://github.com/ssm123ssm/preview_public"
                  className="text-purple-700 hover:underline"
                  target="_blank"
                >
                  repository
                </a>{" "}
                is private. The Fine-Grained Access Token allows limited
                operations to be performed on the repository by those who
                implement the workflow.
              </p>
              <p className="text-slate-500">
                {" "}
                Students can setup a GitHub Action workflow by creating a new
                file in their repository at{" "}
                <code className="text-sm text-slate-500">
                  /.github/workflows/sync.yml
                </code>{" "}
                either manually with the help of the template or using the npm
                package{" "}
                <code className="text-sm text-purple-500">
                  <a
                    href="https://www.npmjs.com/package/create-preview-workflow"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    create-preview-workflow
                  </a>
                </code>{" "}
                . The workflow will be triggered on every push to the selected
                directory in the repository, and it will sync the latest changes
                to the Preview application.
              </p>

              <p className="text-slate-500">
                The workflow requires the access token{" "}
                <code className="text-sm text-slate-500">GH_SYNC_TOKEN</code> to
                be set as a secret in the GitHub repository by the student. The
                access token is shared by the advisor.
              </p>

              <p className="text-slate-500">
                Another CI/CD pipeline gets triggered on every change to the
                Preview repository (which happens when the student pushes
                changes to their repository). This pipeline builds and deploys
                the Preview application and the web application itself is
                public.
              </p>

              <p className="text-slate-500">
                All the routes in the Preview application are protected by
                Clerk, which allows only the users who have access granted by
                the advisor to view the content.
              </p>

              <p className="text-slate-500">
                In summary, the workflow keeps the content of the target
                repository in sync with the Preview application and exposes it
                to collaborators with access granted by the advisor.
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
