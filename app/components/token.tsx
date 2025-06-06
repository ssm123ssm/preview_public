"use client";

import { useState } from "react";

export function Token() {
  const [show, setShow] = useState(false);

  return (
    <div className="p-8 rounded-lg border border-[#EDEDED] bg-[#F1F1F2] background relative">
      <div className="p-8 rounded-xl bg-white shadow-[0_5px_15px_rgba(0,0,0,0.08),0_15px_35px_-5px_rgba(25,28,33,0.2)] ring-1 ring-gray-950/5 ">
        <div className="space-y-5">
          <div className="max-w-sm mb-5">
            <label
              htmlFor="token-password"
              className="block text-sm mb-2 dark:text-white"
            >
              <pre className="whitespace-pre-wrap text-xs font-mono text-slate-600">
                GH_SYNC_TOKEN
              </pre>
            </label>
            <div className="relative">
              <input
                id="token-password"
                type={show ? "text" : "password"}
                className="py-2.5 sm:py-3 ps-4 pe-10 block w-full border-gray-200 rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600 whitespace-pre-wrap text-xs font-mono text-slate-600"
                placeholder="Enter current password"
                value="github_pat_*************************"
                readOnly
              />
              <button
                type="button"
                onClick={() => setShow((v) => !v)}
                className="absolute inset-y-0 end-0 flex items-center z-20 px-3 cursor-pointer text-gray-400 rounded-e-md focus:outline-hidden focus:text-blue-600 dark:text-neutral-600 dark:focus:text-blue-500"
                aria-label={show ? "Hide password" : "Show password"}
                tabIndex={0}
              >
                {show ? (
                  // Eye open
                  <svg
                    className="shrink-0 size-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7S2 12 2 12Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                ) : (
                  // Eye closed
                  <svg
                    className="shrink-0 size-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7S2 12 2 12Z" />
                    <circle cx="12" cy="12" r="3" />
                    <path d="M1 1l22 22" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
