import React, { useEffect, useMemo, useState } from 'react';
import { useAdminGuard } from '@/hooks/useAdminGuard';
import { supabase } from '@/integrations/supabase/client';

type TabKey = 'analytics' | 'moderation' | 'reports' | 'users';

export default function AdminDashboard() {
  const { loading, isAdmin } = useAdminGuard();
  const [active, setActive] = useState<TabKey>('analytics');

  if (loading) return <div>Loading admin...</div>;
  if (!isAdmin) return <div>Unauthorized</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ marginBottom: 16 }}>Admin Dashboard</h2>
      <nav style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <button onClick={() => setActive('analytics')} disabled={active==='analytics'}>Analytics</button>
        <button onClick={() => setActive('moderation')} disabled={active==='moderation'}>Moderation Queue</button>
        <button onClick={() => setActive('reports')} disabled={active==='reports'}>Report Review</button>
        <button onClick={() => setActive('users')} disabled={active==='users'}>User Management</button>
      </nav>
      {active === 'analytics' && <AnalyticsOverview />}
      {active === 'moderation' && <ModerationQueue />}
      {active === 'reports' && <ReportReview />}
      {active === 'users' && <UserManagement />}
    </div>
  );
}

function AnalyticsOverview() {
  const [counts, setCounts] = useState<{[k:string]: number}>({});
  useEffect(() => {
    (async () => {
      const tables = ['profiles','scammers','bounty_contributions','report_submissions','announcements','chat_messages'];
      const entries: [string, number][] = [];
      for (const t of tables) {
        const { count } = await supabase.from(t as any).select('*', { count: 'exact', head: true });
        entries.push([t, count || 0]);
      }
      setCounts(Object.fromEntries(entries));
    })();
  }, []);
  return (
    <div>
      <h3>Overview</h3>
      <ul>
        {Object.entries(counts).map(([k,v]) => (
          <li key={k}>{k}: {v}</li>
        ))}
      </ul>
    </div>
  );
}

function ModerationQueue() {
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('report_submissions')
        .select('id, scammer_name, description, created_at, user_id, status')
        .eq('status', 'pending')
        .order('created_at', { ascending: true });
      setItems(data || []);
    })();
  }, []);
  return (
    <div>
      <h3>Content Moderation Queue</h3>
      {items.length === 0 ? <div>No pending items</div> : (
        <ul>
          {items.map(i => (
            <li key={i.id} style={{ marginBottom: 12 }}>
              <div><strong>{i.scammer_name}</strong> · {new Date(i.created_at).toLocaleString()}</div>
              <div>{i.description}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ReportReview() {
  const [reports, setReports] = useState<any[]>([]);
  const refresh = async () => {
    const { data } = await supabase
      .from('report_submissions')
      .select('id, scammer_name, description, created_at, user_id, status')
      .order('created_at', { ascending: false });
    setReports(data || []);
  };
  useEffect(() => { void refresh(); }, []);

  const act = async (id: string, status: 'approved'|'rejected') => {
    await supabase
      .from('report_submissions')
      .update({ status, reviewed_at: new Date().toISOString() })
      .eq('id', id);
    await refresh();
  };

  return (
    <div>
      <h3>Report Review</h3>
      {reports.length === 0 ? <div>No reports</div> : (
        <table>
          <thead>
            <tr>
              <th>When</th>
              <th>Scammer</th>
              <th>Description</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.map(r => (
              <tr key={r.id}>
                <td>{new Date(r.created_at).toLocaleString()}</td>
                <td>{r.scammer_name}</td>
                <td>{r.description}</td>
                <td>{r.status}</td>
                <td>
                  <button onClick={() => act(r.id, 'approved')} disabled={r.status==='approved'}>Approve</button>
                  <button onClick={() => act(r.id, 'rejected')} disabled={r.status==='rejected'} style={{ marginLeft: 8 }}>Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function UserManagement() {
  const [users, setUsers] = useState<any[]>([]);
  const refresh = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('id, display_name, username, wallet_address, is_admin, is_banned, suspended_until, sec_balance')
      .order('created_at', { ascending: false })
      .limit(100);
    setUsers(data || []);
  };
  useEffect(() => { void refresh(); }, []);

  const toggleBan = async (id: string, is_banned: boolean) => {
    await supabase.from('profiles').update({ is_banned: !is_banned }).eq('id', id);
    await refresh();
  };
  const suspend = async (id: string, days: number) => {
    const until = new Date();
    until.setDate(until.getDate() + days);
    await supabase.from('profiles').update({ suspended_until: until.toISOString() }).eq('id', id);
    await refresh();
  };
  const clearSuspend = async (id: string) => {
    await supabase.from('profiles').update({ suspended_until: null }).eq('id', id);
    await refresh();
  };

  return (
    <div>
      <h3>User Management</h3>
      {users.length === 0 ? <div>No users</div> : (
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Wallet</th>
              <th>Admin</th>
              <th>Banned</th>
              <th>Suspended Until</th>
              <th>SEC</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>{u.display_name || u.username || u.id.slice(0,8)}</td>
                <td>{u.wallet_address}</td>
                <td>{u.is_admin ? 'Yes' : 'No'}</td>
                <td>{u.is_banned ? 'Yes' : 'No'}</td>
                <td>{u.suspended_until ? new Date(u.suspended_until).toLocaleString() : '-'}</td>
                <td>{u.sec_balance ?? 0}</td>
                <td>
                  <button onClick={() => toggleBan(u.id, u.is_banned)}>{u.is_banned ? 'Unban' : 'Ban'}</button>
                  <button onClick={() => suspend(u.id, 7)} style={{ marginLeft: 8 }}>Suspend 7d</button>
                  <button onClick={() => clearSuspend(u.id)} style={{ marginLeft: 8 }}>Clear Suspension</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}




