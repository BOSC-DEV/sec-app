
import React from 'react';
import { ChatMessage as ChatMessageType } from '@/types/dataTypes';
import { formatTimeAgo } from '@/utils/formatTime';
import { useBadgeTier } from '@/hooks/useBadgeTier';
import BadgeTier from '../profile/BadgeTier';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Clock, Trash2 } from 'lucide-react';
import ReactionButton from './ReactionButton';

interface ChatMessageProps {
  message: ChatMessageType;
  isUserAdmin: boolean;
  currentUserWalletAddress?: string;
  onDeleteMessage: (messageId: string) => Promise<void>;
}

const ChatMessageComponent: React.FC<ChatMessageProps> = ({ 
  message, 
  isUserAdmin, 
  currentUserWalletAddress,
  onDeleteMessage 
}) => {
  const badgeInfo = useBadgeTier(message.author_sec_balance || 0);
  const isOwnMessage = message.author_id === currentUserWalletAddress;

  return (
    <div 
      key={message.id} 
      className={`flex items-start gap-3 ${isOwnMessage ? 'flex-row-reverse' : ''}`}
    >
      <Avatar className="h-8 w-8 border border-blue-400/30 flex-shrink-0">
        {message.author_profile_pic ? (
          <AvatarImage 
            src={message.author_profile_pic} 
            alt={message.author_name} 
          />
        ) : (
          <AvatarFallback className="bg-blue-700 text-blue-100">
            {message.author_name?.charAt(0) || '?'}
          </AvatarFallback>
        )}
      </Avatar>
      
      <div 
        className={`
          max-w-[75%] p-3 rounded-lg relative
          ${isOwnMessage 
            ? 'bg-blue-700/80 text-blue-50 rounded-tr-none' 
            : 'bg-blue-800/40 text-blue-50 rounded-tl-none border border-blue-700/30'
          }
        `}
      >
        <div className="flex items-center gap-2 mb-1 text-xs">
          <span className="font-semibold flex items-center gap-1">
            {message.author_name}
            {message.author_username && (
              <span className="text-blue-300/70">@{message.author_username}</span>
            )}
            {badgeInfo && (
              <BadgeTier 
                badgeInfo={badgeInfo} 
                size="sm"
                context="chat"
              />
            )}
          </span>
          <span className="opacity-70 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatTimeAgo(message.created_at)}
          </span>
        </div>
        
        {message.content && (
          <p className="text-sm break-words whitespace-pre-wrap">{message.content}</p>
        )}
        
        {message.image_url && (
          <a 
            href={message.image_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="block mt-2"
          >
            <img 
              src={message.image_url} 
              alt="Attachment" 
              className="max-w-full max-h-64 rounded object-contain bg-black/20"
              onError={(e) => {
                e.currentTarget.src = '/placeholder.svg';
                e.currentTarget.alt = 'Image failed to load';
              }}
            />
          </a>
        )}
        
        <div className="mt-2 flex items-center justify-end gap-2">
          <ReactionButton
            itemId={message.id}
            itemType="message"
            size="xs"
            iconOnly
            variant="ghost"
          />
          
          {(isUserAdmin || isOwnMessage) && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6 opacity-70 hover:opacity-100 hover:bg-red-900/30 hover:text-red-400" 
              onClick={() => onDeleteMessage(message.id)}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessageComponent;
