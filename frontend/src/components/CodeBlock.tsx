import { useRef, useState } from "react";

function CodeBlock({ children }: { children: React.ReactNode }) {
  const preRef = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const text = preRef.current?.innerText ?? "";
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard unavailable (e.g. insecure context) — silently ignore.
    }
  };

  return (
    <div className="group/code relative my-3 overflow-hidden rounded-lg border border-neutral-800 bg-[#0d1117]">
      <button
        type="button"
        onClick={handleCopy}
        className="absolute right-2 top-2 z-10 rounded-md border border-neutral-700 bg-neutral-800/80 px-2 py-1 text-[11px] font-medium text-neutral-300 opacity-0 backdrop-blur transition hover:bg-neutral-700 hover:text-neutral-100 focus:opacity-100 group-hover/code:opacity-100"
        aria-label="Copy code"
      >
        {copied ? "Copied" : "Copy"}
      </button>

      <pre
        ref={preRef}
        className="overflow-x-auto px-4 py-3 text-[13px] leading-relaxed"
      >
        {children}
      </pre>
    </div>
  );
}

export default CodeBlock;
