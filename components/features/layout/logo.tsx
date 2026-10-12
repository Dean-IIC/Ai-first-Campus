/* eslint-disable @next/next/no-img-element */
/** The HKBK College of Engineering crest. */
export default function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const dims = { sm: "size-12", md: "size-14", lg: "size-20" }[size];
  return <img src="/images/hkbk-logo.png" alt="HKBK College of Engineering logo" width={256} height={256} className={`${dims} shrink-0`} />;
}
