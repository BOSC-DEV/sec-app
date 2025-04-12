
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
}

const EmojiPicker: React.FC<EmojiPickerProps> = ({ onEmojiSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('reactions');

  const reactionEmojis = [
    '👍', '❤️', '😂', '😮', '😢', '😡'
  ];

  const popularEmojis = [
    '👍', '❤️', '😂', '🔥', '👏', 
    '🎉', '🤔', '👀', '🙌', '😍',
    '🤩', '😮', '💯', '⭐', '🚀',
    '💪', '👌', '🤣', '😊', '🙏'
  ];

  const animalEmojis = [
    '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯',
    '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🐤', '🦆',
    '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋',
    '🐌', '🐞', '🐜', '🦗', '🕷️', '🦂', '🦟', '🦠', '🐢', '🐍',
    '🦎', '🦖', '🦕', '🐙', '🦑', '🦐', '🦞', '🦀', '🐡', '🐠',
    '🐟', '🐬', '🐳', '🐋', '🦈', '🐊', '🐅', '🐆', '🦓', '🦍',
    '🦧', '🐘', '🦛', '🦏', '🐪', '🐫', '🦒', '🦘', '🐃', '🐂',
    '🐄', '🐎', '🐖', '🐏', '🐑', '🦙', '🐐', '🦌', '🐕', '🐩',
    '🦮', '🐕‍🦺', '🐈', '🐓', '🦃', '🦚', '🦜', '🦢', '🦩', '🕊️',
    '🐇', '🦝', '🦨', '🦡', '🦦', '🦥', '🐁', '🐀', '🐿️', '🦔'
  ];

  const foodEmojis = [
    '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈',
    '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🥑', '🥦', '🥬',
    '🥒', '🌶️', '🌽', '🥕', '🧄', '🧅', '🥔', '🍠', '🥐', '🥯',
    '🍞', '🥖', '🥨', '🧀', '🥚', '🍳', '🧈', '🥞', '🧇', '🥩',
    '🍗', '🍖', '🦴', '🌭', '🍔', '🍟', '🍕', '🥪', '🥙', '🧆',
    '🌮', '🌯', '🥗', '🥘', '🥫', '🍝', '🍜', '🍲', '🍛', '🍣',
    '🍱', '🥟', '🦪', '🍤', '🍙', '🍚', '🍘', '🍥', '🥠', '🥮',
    '🍢', '🍡', '🍧', '🍨', '🍦', '🥧', '🧁', '🍰', '🎂', '🍮',
    '🍭', '🍬', '🍫', '🍿', '🍩', '🍪', '🌰', '🥜', '🍯', '🥛',
    '🍼', '☕', '🫖', '🍵', '🧃', '🥤', '🧋', '🍶', '🍺', '🍻'
  ];

  const travelEmojis = [
    '🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '🚐',
    '🛻', '🚚', '🚛', '🚜', '🦯', '🦽', '🦼', '🛴', '🚲', '🛵',
    '🏍️', '🛺', '🚨', '🚔', '🚍', '🚘', '🚖', '🚡', '🚠', '🚟',
    '🚃', '🚋', '🚞', '🚝', '🚄', '🚅', '🚈', '🚂', '🚆', '🚇',
    '🚊', '🚉', '✈️', '🛫', '🛬', '🛩️', '💺', '🛰️', '🚀', '🛸',
    '🚁', '🛶', '⛵', '🚤', '🛥️', '🛳️', '⛴️', '🚢', '⚓', '🪝',
    '⛽', '🚧', '🚦', '🚥', '🚏', '🗺️', '🗿', '🗽', '🗼', '🏰',
    '🏯', '🏟️', '🎡', '🎢', '🎠', '⛲', '⛱️', '🏖️', '🏝️', '🏜️',
    '🌋', '⛰️', '🏔️', '🗻', '🏕️', '⛺', '🏠', '🏡', '🏘️', '🏚️',
    '🏗️', '🏢', '🏬', '🏣', '🏤', '🏥', '🏦', '🏨', '🏪', '🏫'
  ];

  const activityEmojis = [
    '⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱',
    '🪀', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🪃', '🥅', '⛳',
    '🪁', '🏹', '🎣', '🤿', '🥊', '🥋', '🎽', '🛹', '🛼', '🛷',
    '⛸️', '🥌', '🎿', '⛷️', '🏂', '🪂', '🏋️', '🤼', '🤸', '⛹️',
    '🤺', '🤾', '🏌️', '🏇', '🧘', '🏄', '🏊', '🤽', '🚣', '🧗',
    '🚵', '🚴', '🏆', '🥇', '🥈', '🥉', '🏅', '🎖️', '🏵️', '🎗️',
    '🎫', '🎟️', '🎪', '🤹', '🎭', '🩰', '🎨', '🎬', '🎤', '🎧',
    '🎼', '🎹', '🥁', '🎷', '🎺', '🎸', '🪕', '🎻', '🎲', '♟️',
    '🎯', '🎳', '🎮', '🎰', '🧩', '🎭', '🎨', '🧵', '🧶', '👕'
  ];

  const allEmojiCategories = [
    { id: 'reactions', name: 'Reactions', emojis: reactionEmojis },
    { id: 'popular', name: 'Popular', emojis: popularEmojis },
    { id: 'animals', name: 'Animals', emojis: animalEmojis },
    { id: 'food', name: 'Food', emojis: foodEmojis },
    { id: 'travel', name: 'Travel', emojis: travelEmojis },
    { id: 'activities', name: 'Activities', emojis: activityEmojis },
  ];

  const filteredEmojis = searchTerm 
    ? allEmojiCategories.flatMap(category => category.emojis).filter(emoji => {
        const emojiName = getEmojiName(emoji).toLowerCase();
        return emojiName.includes(searchTerm.toLowerCase());
      })
    : allEmojiCategories.find(category => category.id === activeTab)?.emojis || [];

  function getEmojiName(emoji: string): string {
    const emojiMap: Record<string, string> = {
      '🐶': 'dog',
      '🐱': 'cat',
      '🐭': 'mouse',
      '🐹': 'hamster',
      '🐰': 'rabbit bunny',
      '🦊': 'fox',
      '🐻': 'bear',
      '🐼': 'panda',
      '🐨': 'koala',
      '🐯': 'tiger', 
      '👍': 'thumbs up like',
      '❤️': 'heart love',
      '😂': 'laugh joy',
      '😮': 'wow surprised',
      '😢': 'sad crying',
      '😡': 'angry mad',
    };
    
    return emojiMap[emoji] || emoji;
  }
  
  return (
    <Card className="w-72 shadow-md border">
      <CardContent className="p-2">
        <div className="relative mb-2">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search emojis..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 text-sm h-9"
          />
        </div>
        
        {searchTerm ? (
          <ScrollArea className="h-64">
            <div className="grid grid-cols-5 gap-2 p-1">
              {filteredEmojis.map((emoji) => (
                <button
                  key={emoji}
                  className="p-2 hover:bg-muted rounded-md transition-colors text-xl"
                  onClick={() => onEmojiSelect(emoji)}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <Tabs defaultValue="reactions" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full mb-2 flex justify-start overflow-x-auto h-7 bg-muted/20 p-0.5 rounded-md">
              {allEmojiCategories.map(category => (
                <TabsTrigger 
                  key={category.id} 
                  value={category.id}
                  className="text-xs flex-shrink-0 px-2 py-0.5 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                >
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {allEmojiCategories.map(category => (
              <TabsContent key={category.id} value={category.id} className="m-0">
                <ScrollArea className="h-56">
                  <div className="grid grid-cols-5 gap-2 p-1">
                    {category.emojis.map((emoji) => (
                      <button
                        key={emoji}
                        className="p-2 hover:bg-muted rounded-md transition-colors text-xl"
                        onClick={() => onEmojiSelect(emoji)}
                        title={getEmojiName(emoji)}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};

export default EmojiPicker;
