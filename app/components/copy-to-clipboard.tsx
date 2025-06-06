"use client";
// The copy link to clipboard client component
import { useState } from "react";
import { Clipboard } from "../components/svgs";
interface CopyToClipboardProps {
  text: string;
}

export function CopyToClipboard({ text }: CopyToClipboardProps) {
  //append the hostname to the text
  if (!text.startsWith("http")) {
    text = `${window.location.origin}${text}`;
  }

  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      setCopied(false);
    }
  };
  return (
    <button
      className="flex flex-row text-xs gap-2 text-slate-500"
      onClick={handleCopy}
      title="Copy shareable link to clipboard"
    >
      {copied ? "Copied!" : ""}
      <Clipboard />
    </button>
  );
}
