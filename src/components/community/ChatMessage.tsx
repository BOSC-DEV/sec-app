
import React from 'react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Download } from 'lucide-react';
import CommunityInteractionButtons from './CommunityInteractionButtons';
import BadgeTier from '@/components/profile/BadgeTier';
import { formatTimeAgo } from '@/utils/formatTime';
import { useBadgeTier } from '@/hooks/useBadgeTier';
import AdminContextMenu from './AdminContextMenu';

interface ChatMessageProps {
  message: any;
  isCurrentUser: boolean;
  isUserAdmin: boolean;
  onDelete: (messageId: string) => void;
  onBanUser: (username: string | undefined) => void;
}

const ChatMessage = ({ message, isCurrentUser, isUserAdmin, onDelete, onBanUser }: ChatMessageProps) => {
  const userBadge = useBadgeTier(message.author_id);
  const time = formatTimeAgo(message.created_at);

  const messageContent = (
    <div className="flex my-6">
      <div className={`flex ${isCurrentUser ? 'flex-row-reverse self-end ml-auto' : 'flex-row'} space-x-2 ${isCurrentUser ? 'space-x-reverse' : ''}`}>
        <div className="flex-shrink-0">
          <Link to={message.author_username ? `/profile/${message.author_username}` : '#'}>
            <Avatar className={`h-10 w-10 cursor-pointer border-2 border-background ${isCurrentUser ? 'order-last' : ''}`}>
              <AvatarImage src={message.author_profile_pic} alt={message.author_name} />
              <AvatarFallback className="text-xs">{message.author_name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
          </Link>
        </div>
        
        <div className={`min-w-[180px] max-w-[75%] md:max-w-[60%] rounded-lg px-3 py-2 ${isCurrentUser ? 'bg-icc-blue-light text-white rounded-tr-none self-end' : 'bg-card rounded-tl-none'}`}>
          <div className="flex items-center gap-1 mb-1 flex-wrap">
            <span className={`font-semibold text-sm ${isCurrentUser ? 'text-icc-gold' : 'text-icc-gold'}`}>
              {message.author_name}
            </span>
            {userBadge && <BadgeTier badgeInfo={userBadge} size="sm" showTooltip={true} context="chat" />}
            {isUserAdmin && message.author_username === 'sec' && <span className="text-xs bg-icc-gold/20 text-icc-gold px-1 rounded ml-1">admin</span>}
          </div>
          
          <div className="text-sm break-words">
            {message.content}
          </div>
          
          {message.image_url && <div className="mt-2 relative group">
              <img src={message.image_url} alt="Chat attachment" className="max-h-40 rounded-md object-contain bg-muted/20" />
              <a href={message.image_url} target="_blank" rel="noopener noreferrer" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity 
                bg-background/80 rounded-full p-1" title="View full image">
                <Download className="h-4 w-4" />
              </a>
            </div>}
          
          <div className="flex justify-between items-center mt-1">
            <CommunityInteractionButtons itemId={message.id} itemType="message" initialLikes={message.likes} initialDislikes={message.dislikes} />
            <span className="text-xs text-muted-foreground">
              {time}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return isUserAdmin ? (
    <AdminContextMenu onDelete={() => onDelete(message.id)} onBanUser={() => onBanUser(message.author_username)}>
      {messageContent}
    </AdminContextMenu>
  ) : messageContent;
};

export default ChatMessage;
