import { Clock, Users } from "lucide-react";
import ContentPage, { pageMetadata } from "@/components/features/layout/content-page";
import EnquiryForm from "@/components/features/forms/enquiry-form";
import Tabs from "@/components/features/content/content-tabs";
import { Chip, SampleTag } from "@/components/features/content/bits";
import { getList } from "@/lib/content";

export const revalidate = 300;
export const generateMetadata = () => pageMetadata("corporate-training", "Corporate training");

export default async function CorporateTrainingPage() {
  const programs = await getList("training_programs");

  return (
    <ContentPage
      slug="corporate-training"
      fallbackTitle="Corporate training"
      current="/corporate-training"
      layout={(body) => (
        <Tabs
          label="Corporate training"
          tone="amber"
          items={[
            { id: "why-hkbk", label: "Why train with us", content: body },
            {
              id: "programmes",
              label: `Programmes (${programs.length})`,
              content: (
                <>
                  <p className="mb-5 text-muted-foreground">
                    {programs.length > 0
                      ? "Every programme can be shortened, extended or combined to fit your team."
                      : "This year's programmes will be listed here soon. Use the enquiry form to plan a custom programme for your team."}
                  </p>
                  <ul className="grid gap-4 md:grid-cols-2">
                    {programs.map((p) => (
                      <li key={p.slug} className="flex flex-col rounded-md border border-border border-l-[3px] border-l-t-amber p-5">
                        <Chip tone="amber">{p.track}</Chip>
                        <h3 className="mt-2 font-semibold leading-snug text-heading">
                          {p.title}
                          {p.is_sample && <SampleTag />}
                        </h3>
                        {p.summary && <p className="mt-1.5 flex-1 text-sm text-muted-foreground">{p.summary}</p>}
                        <p className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-sm">
                          <span className="flex items-center gap-1.5">
                            <Clock aria-hidden="true" className="size-4 text-t-amber dark:text-t-amber-light" />
                            {p.duration ?? "Flexible"}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Users aria-hidden="true" className="size-4 text-t-amber dark:text-t-amber-light" />
                            {p.audience ?? "Working professionals"}
                          </span>
                        </p>
                      </li>
                    ))}
                  </ul>
                </>
              ),
            },
            {
              id: "enquire",
              label: "Plan a programme",
              content: (
                <>
                  <p className="mb-6 max-w-[64ch] text-muted-foreground">
                    Tell us who needs training and what they should be able to do afterwards. We will propose a plan, dates and fees.
                  </p>
                  <EnquiryForm
                    type="corporate_training"
                    submitLabel="Send training enquiry"
                    extraFields={[
                      { name: "organisation", label: "Organisation", required: true },
                      {
                        name: "programme",
                        label: "Programme",
                        type: "select",
                        options: [...programs.map((p) => p.title), "A custom programme"],
                        required: true,
                      },
                      { name: "participants", label: "Number of participants", type: "number" },
                      { name: "mode", label: "Where should it run?", type: "select", options: ["At HKBK campus", "At our office", "Online", "Mixed"] },
                    ]}
                    messageLabel="Goals for the training"
                    messagePlaceholder="For example: our support team should be able to use AI tools safely with customer data"
                  />
                </>
              ),
            },
          ]}
        />
      )}
    />
  );
}
