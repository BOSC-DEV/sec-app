import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, Ban, Clock, CheckCircle2, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  display_name: string | null;
  username: string | null;
  wallet_address: string;
  is_admin: boolean;
  is_banned: boolean;
  suspended_until: string | null;
  sec_balance: number;
  created_at: string;
}

export default function UserManagementSection() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Error',
        description: 'Failed to load users',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleBan = async (userId: string, currentBanStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_banned: !currentBanStatus })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: currentBanStatus ? 'User Unbanned' : 'User Banned',
        description: currentBanStatus ? 'User can now access the platform' : 'User has been banned from the platform',
      });

      await fetchUsers();
    } catch (error) {
      console.error('Error toggling ban:', error);
      toast({
        title: 'Error',
        description: 'Failed to update user status',
        variant: 'destructive',
      });
    }
  };

  const suspendUser = async (userId: string, days: number) => {
    try {
      const until = new Date();
      until.setDate(until.getDate() + days);

      const { error } = await supabase
        .from('profiles')
        .update({ suspended_until: until.toISOString() })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: 'User Suspended',
        description: `User suspended for ${days} days`,
      });

      await fetchUsers();
    } catch (error) {
      console.error('Error suspending user:', error);
      toast({
        title: 'Error',
        description: 'Failed to suspend user',
        variant: 'destructive',
      });
    }
  };

  const clearSuspension = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ suspended_until: null })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: 'Suspension Cleared',
        description: 'User suspension has been removed',
      });

      await fetchUsers();
    } catch (error) {
      console.error('Error clearing suspension:', error);
      toast({
        title: 'Error',
        description: 'Failed to clear suspension',
        variant: 'destructive',
      });
    }
  };

  const filteredUsers = users.filter(user =>
    user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.display_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.wallet_address?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">User Management</h1>
        <p className="text-muted-foreground">
          Manage user accounts, bans, and suspensions
        </p>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by username, display name, or wallet..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button onClick={fetchUsers} variant="outline">
            Refresh
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-pulse">Loading users...</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Wallet</TableHead>
                  <TableHead>SEC Balance</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Suspension</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div>
                          <div className="font-medium">
                            {user.display_name || user.username || 'Anonymous'}
                          </div>
                          {user.username && (
                            <div className="text-xs text-muted-foreground">@{user.username}</div>
                          )}
                        </div>
                        {user.is_admin && (
                          <Badge variant="outline" className="text-xs">
                            <Shield className="h-3 w-3 mr-1" />
                            Admin
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {user.wallet_address.slice(0, 8)}...{user.wallet_address.slice(-6)}
                    </TableCell>
                    <TableCell>{user.sec_balance.toLocaleString()}</TableCell>
                    <TableCell>
                      {user.is_banned ? (
                        <Badge variant="destructive">
                          <Ban className="h-3 w-3 mr-1" />
                          Banned
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-green-600">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Active
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {user.suspended_until ? (
                        <Badge variant="secondary">
                          <Clock className="h-3 w-3 mr-1" />
                          Until {new Date(user.suspended_until).toLocaleDateString()}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-sm">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant={user.is_banned ? "outline" : "destructive"}
                          onClick={() => toggleBan(user.id, user.is_banned)}
                        >
                          {user.is_banned ? 'Unban' : 'Ban'}
                        </Button>
                        {!user.is_banned && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => suspendUser(user.id, 7)}
                            >
                              Suspend 7d
                            </Button>
                            {user.suspended_until && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => clearSuspension(user.id)}
                              >
                                Clear
                              </Button>
                            )}
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {filteredUsers.length === 0 && !loading && (
          <div className="text-center py-12 text-muted-foreground">
            No users found matching your search.
          </div>
        )}
      </Card>
    </div>
  );
}
