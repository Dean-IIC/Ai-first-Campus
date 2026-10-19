/* eslint-disable @next/next/no-img-element */
/** The HKBK College of Engineering crest. Pass `className` to size it some other way (for example to fill a frame). */
export default function Logo({ size = "md", className }: { size?: "xs" | "sm" | "md" | "lg"; className?: string }) {
  const dims = { xs: "size-11", sm: "size-12", md: "size-14", lg: "size-20" }[size];
  return <img src="/images/hkbk-logo.png" alt="HKBK College of Engineering logo" width={256} height={256} className={className ?? `${dims} shrink-0`} />;
}
