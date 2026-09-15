export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      applicant_skills: {
        Row: {
          applicant_id: string
          id: string
          proficiency: Database["public"]["Enums"]["skill_proficiency"]
          skill_id: string
        }
        Insert: {
          applicant_id: string
          id?: string
          proficiency?: Database["public"]["Enums"]["skill_proficiency"]
          skill_id: string
        }
        Update: {
          applicant_id?: string
          id?: string
          proficiency?: Database["public"]["Enums"]["skill_proficiency"]
          skill_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "applicant_skills_applicant_id_fkey"
            columns: ["applicant_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applicant_skills_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      application_status_history: {
        Row: {
          application_id: string
          changed_at: string
          changed_by: string
          id: string
          status: Database["public"]["Enums"]["app_status"]
        }
        Insert: {
          application_id: string
          changed_at?: string
          changed_by: string
          id?: string
          status: Database["public"]["Enums"]["app_status"]
        }
        Update: {
          application_id?: string
          changed_at?: string
          changed_by?: string
          id?: string
          status?: Database["public"]["Enums"]["app_status"]
        }
        Relationships: [
          {
            foreignKeyName: "application_status_history_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "application_status_history_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      applications: {
        Row: {
          applicant_id: string
          applied_at: string
          declared_skills_snapshot: Json
          id: string
          listing_id: string
          match_score: number
          message: string | null
          resume_link: string
          status: Database["public"]["Enums"]["app_status"]
        }
        Insert: {
          applicant_id: string
          applied_at?: string
          declared_skills_snapshot: Json
          id?: string
          listing_id: string
          match_score: number
          message?: string | null
          resume_link: string
          status?: Database["public"]["Enums"]["app_status"]
        }
        Update: {
          applicant_id?: string
          applied_at?: string
          declared_skills_snapshot?: Json
          id?: string
          listing_id?: string
          match_score?: number
          message?: string | null
          resume_link?: string
          status?: Database["public"]["Enums"]["app_status"]
        }
        Relationships: [
          {
            foreignKeyName: "applications_applicant_id_fkey"
            columns: ["applicant_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      listing_requirements: {
        Row: {
          id: string
          listing_id: string
          requirement_type: Database["public"]["Enums"]["requirement_type"]
          skill_id: string
        }
        Insert: {
          id?: string
          listing_id: string
          requirement_type?: Database["public"]["Enums"]["requirement_type"]
          skill_id: string
        }
        Update: {
          id?: string
          listing_id?: string
          requirement_type?: Database["public"]["Enums"]["requirement_type"]
          skill_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "listing_requirements_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listing_requirements_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      listings: {
        Row: {
          created_at: string
          deadline: string
          description: string
          id: string
          org_id: string
          status: Database["public"]["Enums"]["listing_status"]
          title: string
          type: Database["public"]["Enums"]["listing_type"]
        }
        Insert: {
          created_at?: string
          deadline: string
          description: string
          id?: string
          org_id: string
          status?: Database["public"]["Enums"]["listing_status"]
          title: string
          type?: Database["public"]["Enums"]["listing_type"]
        }
        Update: {
          created_at?: string
          deadline?: string
          description?: string
          id?: string
          org_id?: string
          status?: Database["public"]["Enums"]["listing_status"]
          title?: string
          type?: Database["public"]["Enums"]["listing_type"]
        }
        Relationships: [
          {
            foreignKeyName: "listings_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string
          id: string
          name: string
          status: Database["public"]["Enums"]["org_status"]
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          status?: Database["public"]["Enums"]["org_status"]
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          status?: Database["public"]["Enums"]["org_status"]
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string
          id: string
          organization_id: string | null
          role: Database["public"]["Enums"]["user_role"]
        }
        Insert: {
          created_at?: string
          full_name: string
          id: string
          organization_id?: string | null
          role?: Database["public"]["Enums"]["user_role"]
        }
        Update: {
          created_at?: string
          full_name?: string
          id?: string
          organization_id?: string | null
          role?: Database["public"]["Enums"]["user_role"]
        }
        Relationships: [
          {
            foreignKeyName: "profiles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      skills: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_match_score: {
        Args: { p_applicant_id: string; p_listing_id: string }
        Returns: number
      }
      create_application: {
        Args: { p_listing_id: string; p_message: string; p_resume_link: string }
        Returns: string
      }
    }
    Enums: {
      app_status:
        | "Applied"
        | "Under Review"
        | "Shortlisted"
        | "Hired"
        | "Rejected"
        | "Withdrawn"
      listing_status: "draft" | "published" | "closed" | "archived"
      listing_type: "job" | "internship"
      org_status: "pending" | "approved" | "rejected"
      requirement_type: "required" | "nice_to_have"
      skill_proficiency: "Beginner" | "Intermediate" | "Advanced"
      user_role: "applicant" | "org_admin" | "platform_admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_status: [
        "Applied",
        "Under Review",
        "Shortlisted",
        "Hired",
        "Rejected",
        "Withdrawn",
      ],
      listing_status: ["draft", "published", "closed", "archived"],
      listing_type: ["job", "internship"],
      org_status: ["pending", "approved", "rejected"],
      requirement_type: ["required", "nice_to_have"],
      skill_proficiency: ["Beginner", "Intermediate", "Advanced"],
      user_role: ["applicant", "org_admin", "platform_admin"],
    },
  },
} as const
