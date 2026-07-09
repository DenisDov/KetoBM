export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      account_deletions: {
        Row: {
          deleted_at: string;
          email: string | null;
          id: string;
          reason: string | null;
          user_id: string;
        };
        Insert: {
          deleted_at?: string;
          email?: string | null;
          id?: string;
          reason?: string | null;
          user_id: string;
        };
        Update: {
          deleted_at?: string;
          email?: string | null;
          id?: string;
          reason?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      app_versions: {
        Row: {
          created_at: string;
          id: string;
          latest_version: string;
          min_supported_version: string;
          platform: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          latest_version: string;
          min_supported_version: string;
          platform: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          latest_version?: string;
          min_supported_version?: string;
          platform?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      devices: {
        Row: {
          bluetooth_enabled: boolean;
          bluetooth_id: string | null;
          connection_status: string;
          created_at: string;
          firmware_version: string | null;
          id: string;
          is_active: boolean;
          last_connected_at: string | null;
          model: string | null;
          name: string | null;
          operating_mode: string;
          paired_at: string | null;
          serial_number: string | null;
          user_id: string;
        };
        Insert: {
          bluetooth_enabled?: boolean;
          bluetooth_id?: string | null;
          connection_status?: string;
          created_at?: string;
          firmware_version?: string | null;
          id?: string;
          is_active?: boolean;
          last_connected_at?: string | null;
          model?: string | null;
          name?: string | null;
          operating_mode?: string;
          paired_at?: string | null;
          serial_number?: string | null;
          user_id: string;
        };
        Update: {
          bluetooth_enabled?: boolean;
          bluetooth_id?: string | null;
          connection_status?: string;
          created_at?: string;
          firmware_version?: string | null;
          id?: string;
          is_active?: boolean;
          last_connected_at?: string | null;
          model?: string | null;
          name?: string | null;
          operating_mode?: string;
          paired_at?: string | null;
          serial_number?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      help_articles: {
        Row: {
          audience: string;
          body: string;
          category: string | null;
          created_at: string;
          id: string;
          is_published: boolean;
          slug: string;
          sort_order: number;
          title: string;
          updated_at: string;
        };
        Insert: {
          audience?: string;
          body: string;
          category?: string | null;
          created_at?: string;
          id?: string;
          is_published?: boolean;
          slug: string;
          sort_order?: number;
          title: string;
          updated_at?: string;
        };
        Update: {
          audience?: string;
          body?: string;
          category?: string | null;
          created_at?: string;
          id?: string;
          is_published?: boolean;
          slug?: string;
          sort_order?: number;
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      help_videos: {
        Row: {
          article_id: string | null;
          created_at: string;
          duration_seconds: number | null;
          id: string;
          sort_order: number;
          thumbnail_url: string | null;
          title: string;
          video_url: string;
        };
        Insert: {
          article_id?: string | null;
          created_at?: string;
          duration_seconds?: number | null;
          id?: string;
          sort_order?: number;
          thumbnail_url?: string | null;
          title: string;
          video_url: string;
        };
        Update: {
          article_id?: string | null;
          created_at?: string;
          duration_seconds?: number | null;
          id?: string;
          sort_order?: number;
          thumbnail_url?: string | null;
          title?: string;
          video_url?: string;
        };
        Relationships: [
          {
            foreignKeyName: "help_videos_article_id_fkey";
            columns: ["article_id"];
            isOneToOne: false;
            referencedRelation: "help_articles";
            referencedColumns: ["id"];
          },
        ];
      };
      ketosis_stages: {
        Row: {
          color: string | null;
          id: string;
          max_mmol: number | null;
          min_mmol: number | null;
          mode: string;
          sort_order: number;
          stage_name: string;
          status_label: string | null;
        };
        Insert: {
          color?: string | null;
          id?: string;
          max_mmol?: number | null;
          min_mmol?: number | null;
          mode: string;
          sort_order: number;
          stage_name: string;
          status_label?: string | null;
        };
        Update: {
          color?: string | null;
          id?: string;
          max_mmol?: number | null;
          min_mmol?: number | null;
          mode?: string;
          sort_order?: number;
          stage_name?: string;
          status_label?: string | null;
        };
        Relationships: [];
      };
      note_presets: {
        Row: {
          id: string;
          is_active: boolean;
          label: string;
          sort_order: number;
        };
        Insert: {
          id?: string;
          is_active?: boolean;
          label: string;
          sort_order: number;
        };
        Update: {
          id?: string;
          is_active?: boolean;
          label?: string;
          sort_order?: number;
        };
        Relationships: [];
      };
      notes: {
        Row: {
          body: string | null;
          created_at: string;
          id: string;
          preset_id: string | null;
          reading_id: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          body?: string | null;
          created_at?: string;
          id?: string;
          preset_id?: string | null;
          reading_id: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          body?: string | null;
          created_at?: string;
          id?: string;
          preset_id?: string | null;
          reading_id?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "notes_preset_id_fkey";
            columns: ["preset_id"];
            isOneToOne: false;
            referencedRelation: "note_presets";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "notes_reading_id_fkey";
            columns: ["reading_id"];
            isOneToOne: true;
            referencedRelation: "readings";
            referencedColumns: ["id"];
          },
        ];
      };
      notification_settings: {
        Row: {
          created_at: string;
          id: string;
          permission_granted_at: string | null;
          push_enabled: boolean;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          permission_granted_at?: string | null;
          push_enabled?: boolean;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          permission_granted_at?: string | null;
          push_enabled?: boolean;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          created_at: string;
          deleted_at: string | null;
          email: string | null;
          first_name: string | null;
          gender: string | null;
          guided_tour_completed: boolean;
          id: string;
          meter_experience: string | null;
          onboarding_completed_at: string | null;
          onboarding_step: number;
          primary_goal: string | null;
          privacy_accepted_at: string | null;
          supplements: string[];
          terms_accepted_at: string | null;
          updated_at: string;
          year_of_birth: number | null;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string;
          deleted_at?: string | null;
          email?: string | null;
          first_name?: string | null;
          gender?: string | null;
          guided_tour_completed?: boolean;
          id: string;
          meter_experience?: string | null;
          onboarding_completed_at?: string | null;
          onboarding_step?: number;
          primary_goal?: string | null;
          privacy_accepted_at?: string | null;
          supplements?: string[];
          terms_accepted_at?: string | null;
          updated_at?: string;
          year_of_birth?: number | null;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string;
          deleted_at?: string | null;
          email?: string | null;
          first_name?: string | null;
          gender?: string | null;
          guided_tour_completed?: boolean;
          id?: string;
          meter_experience?: string | null;
          onboarding_completed_at?: string | null;
          onboarding_step?: number;
          primary_goal?: string | null;
          privacy_accepted_at?: string | null;
          supplements?: string[];
          terms_accepted_at?: string | null;
          updated_at?: string;
          year_of_birth?: number | null;
        };
        Relationships: [];
      };
      readings: {
        Row: {
          created_at: string;
          id: string;
          ketosis_stage_id: string | null;
          measured_at: string;
          meter_id: string | null;
          source: string;
          type: string;
          unit: string;
          user_id: string;
          value: number;
        };
        Insert: {
          created_at?: string;
          id?: string;
          ketosis_stage_id?: string | null;
          measured_at?: string;
          meter_id?: string | null;
          source: string;
          type: string;
          unit: string;
          user_id: string;
          value: number;
        };
        Update: {
          created_at?: string;
          id?: string;
          ketosis_stage_id?: string | null;
          measured_at?: string;
          meter_id?: string | null;
          source?: string;
          type?: string;
          unit?: string;
          user_id?: string;
          value?: number;
        };
        Relationships: [
          {
            foreignKeyName: "readings_ketosis_stage_id_fkey";
            columns: ["ketosis_stage_id"];
            isOneToOne: false;
            referencedRelation: "ketosis_stages";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "readings_meter_id_fkey";
            columns: ["meter_id"];
            isOneToOne: false;
            referencedRelation: "devices";
            referencedColumns: ["id"];
          },
        ];
      };
      reminders: {
        Row: {
          created_at: string;
          id: string;
          is_enabled: boolean;
          label: string | null;
          repeat: string;
          time_of_day: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          is_enabled?: boolean;
          label?: string | null;
          repeat?: string;
          time_of_day: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          is_enabled?: boolean;
          label?: string | null;
          repeat?: string;
          time_of_day?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      support_messages: {
        Row: {
          content: string;
          created_at: string;
          id: string;
          role: string;
          support_request_id: string;
          user_id: string;
        };
        Insert: {
          content: string;
          created_at?: string;
          id?: string;
          role: string;
          support_request_id: string;
          user_id: string;
        };
        Update: {
          content?: string;
          created_at?: string;
          id?: string;
          role?: string;
          support_request_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "support_messages_support_request_id_fkey";
            columns: ["support_request_id"];
            isOneToOne: false;
            referencedRelation: "support_requests";
            referencedColumns: ["id"];
          },
        ];
      };
      support_requests: {
        Row: {
          created_at: string;
          email: string;
          id: string;
          message: string;
          status: string;
          subject: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          email: string;
          id?: string;
          message: string;
          status?: string;
          subject: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          email?: string;
          id?: string;
          message?: string;
          status?: string;
          subject?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      process_account_deletions: { Args: never; Returns: number };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
