// Supabase database types for the HKBK website.
// Regenerate from the live project after any schema change:
//   SUPABASE_PROJECT_ID=your-ref npm run db:types
// This file follows the output format of `supabase gen types typescript`.

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "12"
  }
  public: {
    Tables: {
      ai_people: {
        Row: {
          id: string
          slug: string
          name: string
          role: string
          department: string | null
          bio: string | null
          photo_url: string | null
          sort_order: number
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          name: string
          role: string
          department?: string | null
          bio?: string | null
          photo_url?: string | null
          sort_order?: number
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          name?: string
          role?: string
          department?: string | null
          bio?: string | null
          photo_url?: string | null
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      consultancy_projects: {
        Row: {
          id: string
          slug: string
          title: string
          client: string | null
          department: string | null
          status: string
          year: number | null
          summary: string | null
          is_sample: boolean
          sort_order: number
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          title: string
          client?: string | null
          department?: string | null
          status?: string
          year?: number | null
          summary?: string | null
          is_sample?: boolean
          sort_order?: number
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          title?: string
          client?: string | null
          department?: string | null
          status?: string
          year?: number | null
          summary?: string | null
          is_sample?: boolean
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      dashboards: {
        Row: {
          id: string
          slug: string
          title: string
          category: string
          description: string | null
          url: string | null
          status: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          title: string
          category: string
          description?: string | null
          url?: string | null
          status?: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          title?: string
          category?: string
          description?: string | null
          url?: string | null
          status?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      departments: {
        Row: {
          id: string
          slug: string
          name: string
          short_name: string | null
          kind: string
          programmes: string | null
          description: string | null
          vision: string | null
          mission: string[]
          has_research_centre: boolean
          research_areas: string[]
          sort_order: number
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          name: string
          short_name?: string | null
          kind?: string
          programmes?: string | null
          description?: string | null
          vision?: string | null
          mission?: string[]
          has_research_centre?: boolean
          research_areas?: string[]
          sort_order?: number
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          name?: string
          short_name?: string | null
          kind?: string
          programmes?: string | null
          description?: string | null
          vision?: string | null
          mission?: string[]
          has_research_centre?: boolean
          research_areas?: string[]
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      editors: {
        Row: {
          user_id: string
          email: string
          role: string
          created_at: string
        }
        Insert: {
          user_id: string
          email: string
          role?: string
          created_at?: string
        }
        Update: {
          user_id?: string
          email?: string
          role?: string
          created_at?: string
        }
        Relationships: []
      }
      enquiries: {
        Row: {
          id: string
          type: string
          name: string
          email: string | null
          phone: string | null
          message: string | null
          details: Json
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          type: string
          name: string
          email?: string | null
          phone?: string | null
          message?: string | null
          details?: Json
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          type?: string
          name?: string
          email?: string | null
          phone?: string | null
          message?: string | null
          details?: Json
          status?: string
          created_at?: string
        }
        Relationships: []
      }
      hostel_facilities: {
        Row: {
          id: string
          slug: string
          title: string
          description: string | null
          is_sample: boolean
          sort_order: number
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          title: string
          description?: string | null
          is_sample?: boolean
          sort_order?: number
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          title?: string
          description?: string | null
          is_sample?: boolean
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      houses: {
        Row: {
          id: string
          slug: string
          name: string
          namesake: string | null
          about: string | null
          motto: string | null
          is_placeholder: boolean
          sort_order: number
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          name: string
          namesake?: string | null
          about?: string | null
          motto?: string | null
          is_placeholder?: boolean
          sort_order?: number
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          name?: string
          namesake?: string | null
          about?: string | null
          motto?: string | null
          is_placeholder?: boolean
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      journey_milestones: {
        Row: {
          id: string
          slug: string
          period: string
          title: string
          summary: string | null
          points: string[]
          badge: string | null
          icon: string
          inline_photo: Json | null
          layer: number | null
          photos: Json
          sort_order: number
          status: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          period: string
          title: string
          summary?: string | null
          points?: string[]
          badge?: string | null
          icon?: string
          inline_photo?: Json | null
          layer?: number | null
          photos?: Json
          sort_order?: number
          status?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          period?: string
          title?: string
          summary?: string | null
          points?: string[]
          badge?: string | null
          icon?: string
          inline_photo?: Json | null
          layer?: number | null
          photos?: Json
          sort_order?: number
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      site_content: {
        Row: {
          key: string
          value: Json
          updated_at: string
        }
        Insert: {
          key: string
          value: Json
          updated_at?: string
        }
        Update: {
          key?: string
          value?: Json
          updated_at?: string
        }
        Relationships: []
      }
      site_history: {
        Row: {
          id: number
          key: string
          label: string
          old_value: Json | null
          new_value: Json | null
          created_at: string
        }
        Insert: {
          id?: number
          key: string
          label: string
          old_value?: Json | null
          new_value?: Json | null
          created_at?: string
        }
        Update: {
          id?: number
          key?: string
          label?: string
          old_value?: Json | null
          new_value?: Json | null
          created_at?: string
        }
        Relationships: []
      }
      admin_security: {
        Row: {
          id: number
          failed_attempts: number
          locked_until: string | null
        }
        Insert: {
          id: number
          failed_attempts?: number
          locked_until?: string | null
        }
        Update: {
          id?: number
          failed_attempts?: number
          locked_until?: string | null
        }
        Relationships: []
      }
      key_figures: {
        Row: {
          id: string
          slug: string
          label: string
          value: number | null
          suffix: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          label: string
          value?: number | null
          suffix?: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          label?: string
          value?: number | null
          suffix?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      leadership_messages: {
        Row: {
          slug: string
          name: string | null
          designation: string
          organisation: string | null
          excerpt: string | null
          photo_url: string | null
          body_md: string
          sort_order: number
          section: string
          updated_at: string
        }
        Insert: {
          slug: string
          name?: string | null
          designation: string
          organisation?: string | null
          excerpt?: string | null
          photo_url?: string | null
          body_md?: string
          sort_order?: number
          section?: string
          updated_at?: string
        }
        Update: {
          slug?: string
          name?: string | null
          designation?: string
          organisation?: string | null
          excerpt?: string | null
          photo_url?: string | null
          body_md?: string
          sort_order?: number
          section?: string
          updated_at?: string
        }
        Relationships: []
      }
      mous: {
        Row: {
          id: string
          slug: string
          partner: string
          partner_type: string
          purpose: string | null
          signed_on: string | null
          valid_until: string | null
          document_url: string | null
          logo_url: string | null
          sort_order: number
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          partner: string
          partner_type?: string
          purpose?: string | null
          signed_on?: string | null
          valid_until?: string | null
          document_url?: string | null
          logo_url?: string | null
          sort_order?: number
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          partner?: string
          partner_type?: string
          purpose?: string | null
          signed_on?: string | null
          valid_until?: string | null
          document_url?: string | null
          logo_url?: string | null
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      news_items: {
        Row: {
          id: string
          slug: string
          kind: string
          title: string
          summary: string | null
          published_on: string
          event_date: string | null
          link_url: string | null
          is_sample: boolean
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          kind?: string
          title: string
          summary?: string | null
          published_on?: string
          event_date?: string | null
          link_url?: string | null
          is_sample?: boolean
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          kind?: string
          title?: string
          summary?: string | null
          published_on?: string
          event_date?: string | null
          link_url?: string | null
          is_sample?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      pages: {
        Row: {
          slug: string
          title: string
          summary: string | null
          body_md: string
          updated_at: string
        }
        Insert: {
          slug: string
          title: string
          summary?: string | null
          body_md?: string
          updated_at?: string
        }
        Update: {
          slug?: string
          title?: string
          summary?: string | null
          body_md?: string
          updated_at?: string
        }
        Relationships: []
      }
      portals: {
        Row: {
          id: string
          slug: string
          title: string
          description: string | null
          url: string | null
          category: string
          icon: string
          status: string
          related_page: string | null
          menu_group: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          title: string
          description?: string | null
          url?: string | null
          category?: string
          icon?: string
          status?: string
          related_page?: string | null
          menu_group?: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          title?: string
          description?: string | null
          url?: string | null
          category?: string
          icon?: string
          status?: string
          related_page?: string | null
          menu_group?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      research_projects: {
        Row: {
          id: string
          slug: string
          title: string
          investigator: string | null
          funding_agency: string | null
          status: string
          year: number | null
          summary: string | null
          is_sample: boolean
          sort_order: number
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          title: string
          investigator?: string | null
          funding_agency?: string | null
          status?: string
          year?: number | null
          summary?: string | null
          is_sample?: boolean
          sort_order?: number
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          title?: string
          investigator?: string | null
          funding_agency?: string | null
          status?: string
          year?: number | null
          summary?: string | null
          is_sample?: boolean
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      training_programs: {
        Row: {
          id: string
          slug: string
          title: string
          track: string
          duration: string | null
          mode: string | null
          audience: string | null
          summary: string | null
          is_sample: boolean
          sort_order: number
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          title: string
          track: string
          duration?: string | null
          mode?: string | null
          audience?: string | null
          summary?: string | null
          is_sample?: boolean
          sort_order?: number
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          title?: string
          track?: string
          duration?: string | null
          mode?: string | null
          audience?: string | null
          summary?: string | null
          is_sample?: boolean
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      uhv_activities: {
        Row: {
          id: string
          slug: string
          activity_type: string
          title: string
          description: string | null
          sort_order: number
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          activity_type: string
          title: string
          description?: string | null
          sort_order?: number
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          activity_type?: string
          title?: string
          description?: string | null
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_editor: {
        Args: never
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database["public"]

export type Tables<T extends keyof PublicSchema["Tables"]> = PublicSchema["Tables"][T]["Row"]
export type TablesInsert<T extends keyof PublicSchema["Tables"]> = PublicSchema["Tables"][T]["Insert"]
export type TablesUpdate<T extends keyof PublicSchema["Tables"]> = PublicSchema["Tables"][T]["Update"]
export type TableName = keyof PublicSchema["Tables"]
