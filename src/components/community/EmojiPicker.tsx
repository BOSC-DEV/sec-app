
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
}

const EmojiPicker: React.FC<EmojiPickerProps> = ({ onEmojiSelect }) => {
  const popularEmojis = [
    '👍', '❤️', '😂', '🔥', '👏', 
    '🎉', '🤔', '👀', '🙌', '😍',
    '🤩', '😮', '💯', '⭐', '🚀',
    '💪', '👌', '🤣', '😊', '🙏'
  ];

  return (
    <Card className="w-64 shadow-md">
      <CardContent className="p-2">
        <div className="grid grid-cols-5 gap-2">
          {popularEmojis.map((emoji) => (
            <button
              key={emoji}
              className="p-2 hover:bg-muted rounded-md transition-colors text-xl"
              onClick={() => onEmojiSelect(emoji)}
            >
              {emoji}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default EmojiPicker;
