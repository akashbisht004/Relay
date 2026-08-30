function Logo({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-amber-400 to-orange-600 shadow-sm shadow-amber-500/25 ${className}`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24" className="h-full w-full">
        <text
          x="12"
          y="17"
          textAnchor="middle"
          fontSize="15"
          fontWeight="800"
          fill="white"
          fontFamily="ui-sans-serif, system-ui, sans-serif"
        >
          R
        </text>
      </svg>
    </span>
  );
}

export default Logo;
