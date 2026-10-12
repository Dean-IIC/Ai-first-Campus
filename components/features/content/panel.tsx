import type { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TONE, type Tone } from "@/lib/ui";

/**
 * A shadcn Card with an optional header. The coloured top edge and icon use
 * the section's tone, so colour always tells visitors where they are.
 */
export default function Panel({
  title,
  icon: Icon,
  tone,
  action,
  id,
  className,
  bodyClassName,
  children,
}: {
  title?: string;
  icon?: LucideIcon;
  tone?: Tone;
  action?: React.ReactNode;
  id?: string;
  className?: string;
  bodyClassName?: string;
  children: React.ReactNode;
}) {
  const t = tone ? TONE[tone] : null;
  return (
    <Card id={id} className={cn("scroll-mt-24", t && `border-t-[3px] ${t.borderTop}`, className)}>
      {title && (
        <CardHeader>
          <CardTitle>
            {Icon && (
              <span className={cn("grid size-8 place-items-center rounded-md", t ? `${t.tint} ${t.text}` : "bg-brand-tint text-primary")}>
                <Icon aria-hidden="true" className="size-[1.125rem]" />
              </span>
            )}
            {title}
          </CardTitle>
          {action}
        </CardHeader>
      )}
      <CardContent className={bodyClassName}>{children}</CardContent>
    </Card>
  );
}
