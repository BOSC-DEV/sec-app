
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { useProfile } from '@/contexts/ProfileContext';

interface CompactHeroProps {
  title: string;
  subtitle?: string;
}

const CompactHero: React.FC<CompactHeroProps> = ({ title, subtitle = "Stay up to date with live chats & announcements." }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedSubtitle, setEditedSubtitle] = useState(subtitle);
  const { isConnected } = useProfile();

  const handleDoubleClick = () => {
    if (isConnected) {
      setIsEditing(true);
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setIsEditing(false);
    }
  };

  return (
    <div className="relative bg-icc-blue dark:bg-icc-blue-dark text-white">
      <div className="absolute inset-0 bg-[url('/images/cyber-pattern.png')] opacity-10"></div>
      <div className="icc-container py-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-white mb-3">
            {title}
          </h1>
          {subtitle && (
            isEditing ? (
              <Input
                className="text-lg md:text-xl text-gray-900 max-w-2xl mx-auto bg-white/90"
                value={editedSubtitle}
                onChange={(e) => setEditedSubtitle(e.target.value)}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                autoFocus
              />
            ) : (
              <p 
                className="text-lg md:text-xl text-gray-100 max-w-2xl mx-auto cursor-pointer" 
                onDoubleClick={handleDoubleClick}
                title={isConnected ? "Double-click to edit" : "Connect wallet to edit"}
              >
                {editedSubtitle}
              </p>
            )
          )}
        </div>
      </div>
      <div className="h-4 bg-gradient-to-r from-icc-gold-dark via-icc-gold to-icc-gold-dark"></div>
    </div>
  );
};

export default CompactHero;
