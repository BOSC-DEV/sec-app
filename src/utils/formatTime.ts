
export const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  // Less than 60 seconds
  if (diffInSeconds < 60) return '1m';
  
  // Minutes (1-59)
  const minutes = Math.floor(diffInSeconds / 60);
  if (minutes < 60) return `${minutes}m`;
  
  // Hours (1-23)
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  
  // Days (1-6)
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  
  // Weeks (1-3)
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}w`;
  
  // Months (1-11)
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo`;
  
  // Years
  const years = Math.floor(days / 365);
  return `${years}y`;
};
