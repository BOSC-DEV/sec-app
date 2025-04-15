
import React from 'react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Edit, Trash2, UserX } from 'lucide-react';

interface AdminContextMenuProps {
  children: React.ReactNode;
  onEdit?: () => void;
  onDelete: () => void;
  onBanUser?: () => void;
  canEdit?: boolean;
}

const AdminContextMenu: React.FC<AdminContextMenuProps> = ({ 
  children, 
  onEdit, 
  onDelete,
  onBanUser,
  canEdit = true
}) => {
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
        {onBanUser && (
          <ContextMenuItem onClick={onBanUser} className="cursor-pointer text-destructive focus:text-destructive">
            <UserX className="h-4 w-4 mr-2" />
            Ban User
          </ContextMenuItem>
        )}
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default AdminContextMenu;
