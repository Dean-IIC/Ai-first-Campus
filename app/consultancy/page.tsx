import ContentPage, { pageMetadata } from "@/components/features/layout/content-page";
import EnquiryForm from "@/components/features/forms/enquiry-form";
import ProjectList from "@/components/features/content/project-list";
import Tabs from "@/components/features/content/content-tabs";
import { getList } from "@/lib/content";

export const revalidate = 300;
export const generateMetadata = () => pageMetadata("consultancy", "Consultancy projects");

export default async function ConsultancyPage() {
  const [projects, departments] = await Promise.all([getList("consultancy_projects"), getList("departments")]);
  return (
    <ContentPage
      slug="consultancy"
      fallbackTitle="Consultancy projects"
      current="/consultancy"
      layout={(body) => (
        <Tabs
          label="Consultancy"
          tone="amber"
          items={[
            { id: "services", label: "Services", content: body },
            {
              id: "projects",
              label: `Recent projects (${projects.length})`,
              content: (
                <ProjectList
                  empty="No projects listed yet. Add rows to the consultancy_projects table in Supabase."
                  rows={projects.map((p) => ({
                    ...p,
                    meta: [
                      { label: "Client", value: p.client },
                      { label: "Department", value: p.department },
                    ],
                  }))}
                />
              ),
            },
            {
              id: "enquire",
              label: "Request consultancy",
              content: (
                <>
                  <p className="mb-6 max-w-[64ch] text-muted-foreground">
                    Describe the problem in a few lines. A faculty coordinator will contact you to scope the work and agree terms.
                  </p>
                  <EnquiryForm
                    type="consultancy"
                    submitLabel="Send consultancy request"
                    extraFields={[
                      { name: "organisation", label: "Organisation", required: true },
                      {
                        name: "department",
                        label: "Closest department",
                        type: "select",
                        options: [...departments.filter((d) => d.kind !== "Physical education").map((d) => d.name), "Not sure"],
                      },
                    ]}
                    messageLabel="What do you need help with?"
                    messagePlaceholder="The problem, any data or drawings you can share, and when you need results"
                    messageRequired
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
