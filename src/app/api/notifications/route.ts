import { NextResponse } from "next/server";
import { requireCurrentUser } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

type NotificationItem = {
  id: string;
  type: 'registration' | 'ticket' | 'incident';
  message: string;
  time: string;
  read: boolean;
};

type TicketRecord = {
  id: number;
  ticket_number: string;
  created_at: string;
  tenant_id: string;
};

type IncidentRecord = {
  id: number;
  instance_name: string | null;
  occurred_at: string;
};

export async function GET() {
  try {
    const currentUser = await requireCurrentUser();
    
    // Roles: admin, tenant_admin, subtenant_member, pending
    if (currentUser.role === 'subtenant_member' || currentUser.role === 'pending') {
      return NextResponse.json({ data: [] });
    }

    const notifications: NotificationItem[] = [];

    // 1. Pending Users (Admins and Tenant Admins)
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.listUsers({
      perPage: 100
    });

    if (!userError && userData?.users) {
      let companyName: string | null = null;
      if (currentUser.role === 'tenant_admin' && currentUser.tenantId) {
        const { data: tenant } = await supabaseAdmin.from('tenants').select('name').eq('id', currentUser.tenantId).single() as { data: { name: string } | null };
        companyName = tenant?.name ?? null;
      }

      userData.users.forEach(u => {
        const uRole = u.user_metadata?.role;
        const uTenantName = u.user_metadata?.tenantName;
        
        if (uRole === 'pending') {
          if (currentUser.role === 'admin' || (currentUser.role === 'tenant_admin' && uTenantName === companyName)) {
            notifications.push({
              id: `pending-${u.id}`,
              type: 'registration',
              message: `${u.user_metadata?.name || u.email}님이 가입 신청했습니다.`,
              time: u.created_at,
              read: false
            });
          }
        }
      });
    }

    // 2. Recent Tickets
    let ticketQuery = supabaseAdmin.from('tickets').select('id, ticket_number, created_at, tenant_id').order('created_at', { ascending: false }).limit(5);
    if (currentUser.role === 'tenant_admin' && currentUser.tenantId) {
      ticketQuery = ticketQuery.eq('tenant_id', currentUser.tenantId);
    }
    const { data: tickets } = await ticketQuery;
    
    (tickets as unknown as TicketRecord[] || []).forEach(t => {
      notifications.push({
        id: `ticket-${t.id}`,
        type: 'ticket',
        message: `새 티켓이 접수되었습니다. (${t.ticket_number})`,
        time: t.created_at,
        read: false
      });
    });

    // 3. Recent Incidents
    // For simplicity, we'll fetch recent incidents.
    // In a real app, we'd filter by tenant mapping.
    let incidentQuery = supabaseAdmin.from('incidents').select('id, instance_name, occurred_at').order('occurred_at', { ascending: false }).limit(5);
    const { data: incidents } = await incidentQuery;
    
    (incidents as unknown as IncidentRecord[] || []).forEach(i => {
      notifications.push({
        id: `incident-${i.id}`,
        type: 'incident',
        message: `장애가 등록되었습니다. (${i.instance_name || i.id})`,
        time: i.occurred_at,
        read: false
      });
    });

    // Sort all by time
    notifications.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

    return NextResponse.json({ data: notifications });
  } catch (error) {
    console.error('Notification API Error:', error);
    return NextResponse.json({ data: [] });
  }
}
