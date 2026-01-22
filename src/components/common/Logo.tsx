"use client";

interface LogoProps {
  size?: number;
  className?: string;
  animate?: boolean;
}

export function Logo({ size = 36, className = "", animate = true }: LogoProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      className={className}
    >
      {/* 左の点（キッチンカー側） */}
      <circle
        cx="20"
        cy="50"
        r="12"
        fill="#d35f2d"
        className={animate ? "logo-dot-left" : ""}
      />
      <circle cx="20" cy="50" r="16" fill="#d35f2d" fillOpacity="0.2" />

      {/* 右の点（スペース側） */}
      <circle
        cx="80"
        cy="50"
        r="12"
        fill="#e8a86b"
        className={animate ? "logo-dot-right" : ""}
      />
      <circle cx="80" cy="50" r="16" fill="#e8a86b" fillOpacity="0.2" />

      {/* 結びのライン（水引をイメージ） */}
      <path
        d="M32 50 Q50 25 50 50 Q50 75 68 50"
        stroke="#d35f2d"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
        className={animate ? "logo-musubi-line" : ""}
      />
      <path
        d="M32 50 Q50 75 50 50 Q50 25 68 50"
        stroke="#e8a86b"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
        className={animate ? "logo-musubi-line" : ""}
      />

      {/* 中央の結び目 */}
      <circle cx="50" cy="50" r="6" fill="#c94e20" />
    </svg>
  );
}
