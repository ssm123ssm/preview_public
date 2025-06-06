import { UserDetails } from "../components/user-details";
import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import { CodeSwitcher } from "../components/code-switcher";
import { LearnMore } from "../components/learn-more";
import { Footer } from "../components/footer";
import { CopyToClipboard } from "../components/copy-to-clipboard";
import { ClerkLogo } from "../components/clerk-logo";
import { NextLogo } from "../components/next-logo";
import fs from "fs";
import path from "path";
import Link from "next/link";

import { CARDS } from "../consts/cards";
import { auth } from "@clerk/nextjs/server";
import { currentUser } from "@clerk/nextjs/server";

interface DashboardPageProps {
  searchParams: Promise<{ folder?: string }>;
}

// Get the content in the public directory
const getPublicFiles = (folderName?: string) => {
  const basePath = folderName
    ? path.join(process.cwd(), "public/protected", folderName)
    : path.join(process.cwd(), "public/protected/PF");

  try {
    return fs.readdirSync(basePath);
  } catch (error) {
    return [];
  }
};

// Get the folder list at public/protected
const getPublicFolders = (user: any) => {
  try {
    const protectedPath = path.join(process.cwd(), "public/protected");

    return fs.readdirSync(protectedPath).filter((folder) => {
      const folderPath = path.join(protectedPath, folder);

      // Check if it's a directory
      if (!fs.statSync(folderPath).isDirectory()) {
        return false;
      }

      try {
        // Check if .sync_log file exists
        const syncLogPath = path.join(folderPath, ".sync_log");
        if (!fs.existsSync(syncLogPath)) {
          return false;
        }

        // Read the .sync_log file
        const syncLogContent = fs.readFileSync(syncLogPath, "utf8");

        // Extract the org value from the line "Org: d3md"
        const orgMatch = syncLogContent.match(/^Org:\s*(.+)$/m);
        if (!orgMatch) {
          return false;
        }

        const folderOrg = orgMatch[1].trim();
        const userOrg = user;

        // Return true if the org matches the user's org
        return folderOrg === userOrg;
      } catch (error) {
        // If there's an error reading the .sync_log file, exclude this folder
        console.error(`Error reading .sync_log for folder ${folder}:`, error);
        return false;
      }
    });
  } catch (error) {
    console.error("Error reading protected folders:", error);
    return [];
  }
};

// Get when each folder was last modified using the .sync_log file. It will contain in the first line as "Last sync: 2025-06-01 05:24:27 UTC" etc
const getFolderLastModified = (folderName: string) => {
  const logFilePath = path.join(
    process.cwd(),
    "public/protected",
    folderName,
    ".sync_log"
  );

  try {
    if (fs.existsSync(logFilePath)) {
      const logContent = fs.readFileSync(logFilePath, "utf-8");
      const match = logContent.match(/Last sync:\s*(.+)/);
      if (match && match[1]) {
        return new Date(match[1]);
      }
    }
  } catch (error) {
    console.error(`Error reading log file for ${folderName}:`, error);
  }
  return null;
};

//Get commit message from the .sync_log file
const getFolderCommitMessage = (folderName: string) => {
  const logFilePath = path.join(
    process.cwd(),
    "public/protected",
    folderName,
    ".sync_log"
  );

  try {
    if (fs.existsSync(logFilePath)) {
      const logContent = fs.readFileSync(logFilePath, "utf-8");
      const match = logContent.match(/Last commit:\s*(.+)/);
      if (match && match[1]) {
        return match[1];
      }
    }
  } catch (error) {
    console.error(`Error reading log file for ${folderName}:`, error);
  }
  return null;
};

const getFolderCommitUrl = (folderName: string) => {
  const logFilePath = path.join(
    process.cwd(),
    "public/protected",
    folderName,
    ".sync_log"
  );

  try {
    if (fs.existsSync(logFilePath)) {
      const logContent = fs.readFileSync(logFilePath, "utf-8");
      const match = logContent.match(/View diff:\s*(.+)/);
      if (match && match[1]) {
        return match[1];
      }
    }
  } catch (error) {
    console.error(`Error reading log file for ${folderName}:`, error);
  }
  return null;
};

const getOrg = (folderName: string) => {
  const logFilePath = path.join(
    process.cwd(),
    "public/protected",
    folderName,
    ".sync_log"
  );

  try {
    if (fs.existsSync(logFilePath)) {
      const logContent = fs.readFileSync(logFilePath, "utf-8");
      const match = logContent.match(/Org:\s*(.+)/);
      if (match && match[1]) {
        return match[1];
      }
    }
  } catch (error) {
    console.error(`Error reading log file for ${folderName}:`, error);
  }
  return null;
};

// Get files in a specific folder
const getFilesInFolder = (folderName: string, user: any) => {
  try {
    const folderPath = path.join(process.cwd(), "public/protected", folderName);

    // First check if the folder belongs to the user's organization
    try {
      const syncLogPath = path.join(folderPath, ".sync_log");
      if (!fs.existsSync(syncLogPath)) {
        return []; // No .sync_log file, deny access
      }

      // Read the .sync_log file
      const syncLogContent = fs.readFileSync(syncLogPath, "utf8");

      // Extract the org value from the line "Org: d3md"
      const orgMatch = syncLogContent.match(/^Org:\s*(.+)$/m);
      if (!orgMatch) {
        return []; // No org line found, deny access
      }

      const folderOrg = orgMatch[1].trim();
      const userOrg = user;

      console.log("Folder user ", folderOrg);
      console.log("auth user ", userOrg);

      // If org doesn't match, return empty array
      if (folderOrg !== userOrg) {
        return [];
      }
    } catch (syncLogError) {
      console.error(
        `Error reading .sync_log for folder ${folderName}:`,
        syncLogError
      );
      return []; // Error reading sync log, deny access
    }

    // If org matches, return the files (excluding .sync_log)
    return fs.readdirSync(folderPath).filter((file) => {
      const filePath = path.join(folderPath, file);
      return fs.statSync(filePath).isFile() && file !== ".sync_log";
    });
  } catch (error) {
    console.error(`Error reading folder ${folderName}:`, error);
    return [];
  }
};

// Force no cache for the public files
export const dynamic = "force-dynamic";

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const user = await auth();
  const { folder: currentFolder } = await searchParams;
  const userOrg =
    user.sessionClaims &&
    user.sessionClaims.o &&
    typeof user.sessionClaims.o === "object" &&
    "slg" in user.sessionClaims.o
      ? user.sessionClaims.o.slg
      : undefined;
  console.log(userOrg);
  const publicFolders = getPublicFolders(userOrg);
  const publicFiles = currentFolder
    ? getFilesInFolder(currentFolder, userOrg)
    : [];

  //if (!canManage) return null;
  return (
    <>
      <main className="max-w-[75rem] md:w-full w-80 mx-auto">
        <div className="grid md:grid-cols-[1fr_20.5rem] grid-cols-1 gap-10 pb-10">
          <div className="mx-4">
            <header className="flex items-center justify-between w-full h-16 gap-4">
              <div className="flex gap-4">
                <ClerkLogo />
              </div>
              <div className="flex items-center gap-2">
                <OrganizationSwitcher />
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

            {/* Navigation breadcrumb */}
            <div className="flex items-center gap-2 mt-6 text-sm text-gray-600">
              <Link
                href="/dashboard"
                className="hover:text-gray-900 transition-colors"
              >
                Protected Files
              </Link>
              {currentFolder && (
                <>
                  <span>/</span>
                  <span className="text-gray-900 font-medium">
                    {currentFolder}
                  </span>
                </>
              )}
            </div>

            <h1
              className="text-3xl font-semibold mt-2 w-full overflow-hidden truncate"
              title={currentFolder}
            >
              {currentFolder
                ? `Files in ${currentFolder.split("@")[1]}`
                : "Protected files shared with you"}
            </h1>

            {/* Back button when viewing folder contents */}
            {currentFolder && (
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 mt-4 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                ← Back to folders
              </Link>
            )}

            <div className="grid grid-cols-1  md:grid-cols-3 gap-6 mt-6 ">
              {!currentFolder ? (
                // Show folders
                publicFolders
                  .map((folder) => ({
                    name: folder,
                    lastModified: getFolderLastModified(folder),
                    fileCount: getFilesInFolder(folder, userOrg).length,
                    org: getOrg(folder),
                  }))
                  .sort((a, b) => {
                    // Sort descending: most recently modified first
                    if (!a.lastModified) return 1;
                    if (!b.lastModified) return -1;
                    return b.lastModified.getTime() - a.lastModified.getTime();
                  })
                  .map(({ name: folder, fileCount }) => {
                    return (
                      <div
                        key={folder}
                        className="bg-white  rounded-lg shadow p-4 flex flex-col hover:shadow-md transition-shadow cursor-pointer border border-gray-200  hover:border-blue-300  text-clip overflow-hidden "
                      >
                        {" "}
                        <Link
                          key={folder}
                          href={`/dashboard?folder=${encodeURIComponent(
                            folder
                          )}`}
                          className=""
                        >
                          {getOrg(folder)}
                          <div className="flex items-center gap-2 overflow-hidden w-[200px]">
                            <div className="overflow-hidden whitespace-nowrap">
                              <div className="relative flex flex-col overflow-hidden rounded-lg">
                                {/* SVG background with fade effect */}
                                {/* Content */}
                                <div className="relative z-10">
                                  <h2 className="text-lg font-semibold truncate">
                                    {folder.split("@")[1]}
                                  </h2>
                                  <div className="text-sm text-gray-500  mt-0.5">
                                    {folder.split("@")[0]}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <p className="text-xs text-gray-600 mt-4 mb-2">
                            Contains {fileCount} file
                            {fileCount !== 1 ? "s" : ""}
                          </p>
                          <p className="text-xs text-gray-500">
                            Last modified:{" "}
                            {(() => {
                              const lastModified =
                                getFolderLastModified(folder);
                              return lastModified
                                ? lastModified.toLocaleString()
                                : "Unknown";
                            })()}
                          </p>{" "}
                        </Link>
                        <Link
                          href={getFolderCommitUrl(folder) || "#"}
                          rel="noopener noreferrer"
                          target="_blank"
                          title="View commit details"
                          className="text-purple-500 hover:underline z-10 text-xs"
                        >
                          {getFolderCommitMessage(folder) ||
                            "No commit message available"}
                        </Link>
                      </div>
                    );
                  })
              ) : // Show files in current folder
              publicFiles.length > 0 ? (
                publicFiles.map((file) => {
                  const fileExtension = path.extname(file).toLowerCase();
                  const fileName = path.basename(file, fileExtension);
                  const filePath = `/protected/${encodeURIComponent(
                    currentFolder
                  )}/${encodeURIComponent(file)}`;

                  // Determine if file should open in new tab or download
                  const viewableExtensions = [
                    ".pdf",
                    ".txt",
                    ".md",
                    ".json",
                    ".csv",
                    ".jpg",
                    ".jpeg",
                    ".png",
                    ".gif",
                    ".svg",
                    ".html",
                  ];
                  const isViewable = viewableExtensions.includes(fileExtension);

                  return (
                    <div
                      key={file}
                      className={`bg-white  rounded-lg shadow p-3 flex flex-col gap-1 border border-gray-200  `}
                    >
                      {/* File Copy link to clipboard at the left top */}
                      {fileExtension === ".html" && (
                        <span className="relative flex size-3 -top-4  -left-4 -mb-4">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-purple-400 opacity-75"></span>
                          <span className="relative inline-flex size-3 rounded-full bg-purple-500"></span>
                        </span>
                      )}
                      <div className="flex justify-end">
                        <CopyToClipboard text={filePath} />
                      </div>
                      <div className="flex items-center gap-2">
                        <svg
                          className="w-5 h-5 text-gray-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <h3
                          className="text-lg font-semibold truncate"
                          title={file}
                        >
                          {fileName}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-600">
                        {fileExtension.toUpperCase().slice(1)} file
                      </p>
                      <div className="flex gap-2 mt-2">
                        {isViewable ? (
                          <div className="flex w-full justify-between">
                            <a
                              href={filePath}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-2 text-sm font-medium text-gray-700 border border-purple-300 rounded-md hover:border-purple-500 transition-colors text-center w-2/3"
                            >
                              View
                            </a>
                            <a
                              href={filePath}
                              download
                              className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200  transition-colors"
                              title="Download file"
                            >
                              ⬇
                            </a>
                          </div>
                        ) : (
                          <a
                            href={filePath}
                            download
                            className="flex-1 px-3 py-2 text-sm font-medium text-sla
                              rounded-md hover:border-gray-500 transition-colors text-center border border-gray-300 "
                          >
                            Download
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-full text-center py-8 text-gray-500 ">
                  <svg
                    className="w-12 h-12 mx-auto mb-4 text-gray-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p>No files found in this folder</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <LearnMore cards={CARDS} />
      <Footer />
    </>
  );
}
