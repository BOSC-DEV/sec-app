
import React from 'react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Edit, Trash2, UserX } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { banUser } from '@/utils/adminUtils';

interface AdminContextMenuProps {
  children: React.ReactNode;
  onEdit?: () => void;
  onDelete: () => void;
  onBanUser?: () => void;
  canEdit?: boolean;
  authorUsername?: string;
}

const AdminContextMenu: React.FC<AdminContextMenuProps> = ({ 
  children, 
  onEdit, 
  onDelete,
  onBanUser,
  canEdit = true,
  authorUsername
}) => {
  const handleBanUser = () => {
    if (authorUsername && onBanUser) {
      banUser(authorUsername);
      toast({
        title: "User banned",
        description: `${authorUsername} has been banned from commenting`,
      });
      onBanUser();
    }
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        {canEdit && onEdit && (
          <ContextMenuItem onClick={onEdit} className="cursor-pointer">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </ContextMenuItem>
        )}
        <ContextMenuItem onClick={onDelete} className="cursor-pointer text-destructive focus:text-destructive">
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </ContextMenuItem>
        {authorUsername && onBanUser && (
          <ContextMenuItem onClick={handleBanUser} className="cursor-pointer text-destructive focus:text-destructive">
            <UserX className="h-4 w-4 mr-2" />
            Ban User
          </ContextMenuItem>
        )}
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default AdminContextMenu;
