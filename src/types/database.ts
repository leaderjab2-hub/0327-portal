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
      tenants: {
        Row: {
          id: string;
          name: string;
          contractor_email: string | null;
          manager_email: string | null;
          created_at: string | null;
          contract: Json | null;
        };
        Insert: {
          id: string;
          name: string;
          contractor_email?: string | null;
          manager_email?: string | null;
          created_at?: string | null;
          contract?: Json | null;
        };
        Update: {
          id?: string;
          name?: string;
          contractor_email?: string | null;
          manager_email?: string | null;
          created_at?: string | null;
          contract?: Json | null;
        };
      };
      subtenants: {
        Row: {
          id: string;
          tenant_id: string | null;
          name: string;
          status: string | null;
          products: Json | null;
          start_date: string | null;
          end_date: string | null;
          pm: string | null;
          member_count: number | null;
          assigned_nodes: Json | null;
        };
        Insert: {
          id: string;
          tenant_id: string;
          name: string;
          status?: string | null;
          products?: Json | null;
          start_date?: string | null;
          end_date?: string | null;
          pm?: string | null;
          member_count?: number | null;
          assigned_nodes?: Json | null;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          name?: string;
          status?: string | null;
          products?: Json | null;
          start_date?: string | null;
          end_date?: string | null;
          pm?: string | null;
          member_count?: number | null;
          assigned_nodes?: Json | null;
        };
      };
      node_allocations: {
        Row: {
          id: number;
          tenant_id: string | null;
          subtenant_id: string | null;
          node_id: string;
          allocated_at: string | null;
        };
        Insert: {
          id?: number;
          tenant_id?: string | null;
          subtenant_id?: string | null;
          node_id: string;
          allocated_at?: string | null;
        };
        Update: {
          id?: number;
          tenant_id?: string | null;
          subtenant_id?: string | null;
          node_id?: string;
          allocated_at?: string | null;
        };
      };
      billings: {
        Row: {
          id: number;
          tenant_id: string | null;
          subtenant_id: string | null;
          period_start: string | null;
          period_end: string | null;
          gpu_fee: number | null;
          cpu_fee: number | null;
          storage_fee: number | null;
          network_fee: number | null;
          credit_deduction: number | null;
          credit_deduct?: number | null;
          total_fee: number | null;
          invoice_url: string | null;
          memo: string | null;
          registered_at: string | null;
        };
        Insert: {
          id?: number;
          tenant_id?: string | null;
          subtenant_id?: string | null;
          period_start?: string | null;
          period_end?: string | null;
          gpu_fee?: number | null;
          cpu_fee?: number | null;
          storage_fee?: number | null;
          network_fee?: number | null;
          credit_deduction?: number | null;
          credit_deduct?: number | null;
          total_fee?: number | null;
          invoice_url?: string | null;
          memo?: string | null;
          registered_at?: string | null;
        };
        Update: {
          id?: number;
          tenant_id?: string | null;
          subtenant_id?: string | null;
          period_start?: string | null;
          period_end?: string | null;
          gpu_fee?: number | null;
          cpu_fee?: number | null;
          storage_fee?: number | null;
          network_fee?: number | null;
          credit_deduction?: number | null;
          credit_deduct?: number | null;
          total_fee?: number | null;
          invoice_url?: string | null;
          memo?: string | null;
          registered_at?: string | null;
        };
      };
      notices: {
        Row: {
          id: number;
          type: string | null;
          title: string;
          content: string | null;
          author_id: string | null;
          author_name: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: number;
          type?: string | null;
          title: string;
          content?: string | null;
          author_id?: string | null;
          author_name?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: number;
          type?: string | null;
          title?: string;
          content?: string | null;
          author_id?: string | null;
          author_name?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      tickets: {
        Row: {
          id: number;
          ticket_number: string;
          type: string | null;
          title: string;
          content: string | null;
          status: string | null;
          author_id: string | null;
          author_name: string | null;
          tenant_id: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: number;
          ticket_number: string;
          type?: string | null;
          title: string;
          content?: string | null;
          status?: string | null;
          author_id?: string | null;
          author_name?: string | null;
          tenant_id?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: number;
          ticket_number?: string;
          type?: string | null;
          title?: string;
          content?: string | null;
          status?: string | null;
          author_id?: string | null;
          author_name?: string | null;
          tenant_id?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      ticket_comments: {
        Row: {
          id: number;
          ticket_id: number;
          author_id: string | null;
          author_name: string | null;
          content: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: number;
          ticket_id: number;
          author_id?: string | null;
          author_name?: string | null;
          content?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: number;
          ticket_id?: number;
          author_id?: string | null;
          author_name?: string | null;
          content?: string | null;
          created_at?: string | null;
        };
      };
      incidents: {
        Row: {
          id: number;
          type: string | null;
          occurred_at: string | null;
          recovered_at: string | null;
          duration_minutes: number | null;
          node_type: string | null;
          node_id: string | null;
          instance_name: string | null;
          registered_by: string | null;
          memo: string | null;
          recovery_note: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: number;
          type?: string | null;
          occurred_at?: string | null;
          recovered_at?: string | null;
          duration_minutes?: number | null;
          node_type?: string | null;
          node_id?: string | null;
          instance_name?: string | null;
          registered_by?: string | null;
          memo?: string | null;
          recovery_note?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: number;
          type?: string | null;
          occurred_at?: string | null;
          recovered_at?: string | null;
          duration_minutes?: number | null;
          node_type?: string | null;
          node_id?: string | null;
          instance_name?: string | null;
          registered_by?: string | null;
          memo?: string | null;
          recovery_note?: string | null;
          created_at?: string | null;
        };
      };
      incident_customers: {
        Row: {
          id: number;
          incident_id: number;
          tenant_id: string | null;
          subtenant_id: string | null;
          gpu_count: number | null;
        };
        Insert: {
          id?: number;
          incident_id: number;
          tenant_id?: string | null;
          subtenant_id?: string | null;
          gpu_count?: number | null;
        };
        Update: {
          id?: number;
          incident_id?: number;
          tenant_id?: string | null;
          subtenant_id?: string | null;
          gpu_count?: number | null;
        };
      };
      credits: {
        Row: {
          id: number;
          tenant_id: string | null;
          subtenant_id: string | null;
          source_type: string | null;
          source_id: number | null;
          amount: number | null;
          note: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: number;
          tenant_id?: string | null;
          subtenant_id?: string | null;
          source_type?: string | null;
          source_id?: number | null;
          amount?: number | null;
          note?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: number;
          tenant_id?: string | null;
          subtenant_id?: string | null;
          source_type?: string | null;
          source_id?: number | null;
          amount?: number | null;
          note?: string | null;
          created_at?: string | null;
        };
      };
    };
  };
};
