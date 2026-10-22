import type { TableName, Tables } from "./database.types";

/*
 * App-level types, derived from the generated Supabase schema in
 * lib/database.types.ts. Database-only columns (id, updated_at) are left out
 * so the same types also describe the fallback files in /content.
 */
type Content<T extends TableName> = Omit<Tables<T>, "id" | "updated_at">;

export type Page = Pick<Tables<"pages">, "slug" | "title" | "summary" | "body_md">;
export type LeadershipMessage = Omit<Tables<"leadership_messages">, "updated_at">;
export type Department = Content<"departments">;
export type Dashboard = Content<"dashboards">;
export type UhvActivity = Content<"uhv_activities">;
export type ResearchProject = Content<"research_projects">;
export type ConsultancyProject = Content<"consultancy_projects">;
export type TrainingProgram = Content<"training_programs">;
/** Event fields kept only in the admin content store (list:news_items), set with the on-card editor. */
export type EventExtras = { end_date?: string | null; event_time?: string | null; venue?: string | null; category?: string | null; poster_url?: string | null };
export type NewsItem = Content<"news_items"> & EventExtras;
export type Portal = Content<"portals">;
export type AiPerson = Content<"ai_people">;
export type KeyFigure = Content<"key_figures">;
export type House = Content<"houses">;
/** MoU fields kept only in the admin content store (list:mous), set with the on-card editor. */
export type MouExtras = { departments?: string | null; document_path?: string | null; document_public?: boolean | null; status?: "Automatic" | "Active" | "Expired" | null };
export type Mou = Content<"mous"> & MouExtras;
export type JourneyMilestone = Content<"journey_milestones">;
export type JourneyPhoto = { src: string; alt: string; fit?: "cover" | "contain" };

export type ListTables = {
  departments: Department;
  dashboards: Dashboard;
  uhv_activities: UhvActivity;
  research_projects: ResearchProject;
  consultancy_projects: ConsultancyProject;
  training_programs: TrainingProgram;
  news_items: NewsItem;
  portals: Portal;
  ai_people: AiPerson;
  key_figures: KeyFigure;
  houses: House;
  mous: Mou;
  journey_milestones: JourneyMilestone;
};

export type ListTable = keyof ListTables;
