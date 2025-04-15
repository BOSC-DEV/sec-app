
// In NotificationDropdown.tsx - around line 66
const handleNotificationClick = async (notification: Notification) => {
  // Mark as read
  await markNotificationAsRead(notification.id);
  
  // Navigate based on entity type
  switch (notification.entity_type) {
    case EntityType.scammer:
      navigate(`/scammer/${notification.entity_id}`);
      break;
    case EntityType.comment:
      // For comments, we need to navigate to the scammer page
      navigate(`/scammer/${notification.entity_id.split('-')[1]}`);
      break;
    case EntityType.announcement:
      navigate('/community');
      break;
    case EntityType.reply:
      navigate('/community');
      break;
    case EntityType.chat_message:
      navigate('/community');
      break;
    default:
      // Default to community page
      navigate('/community');
  }
  
  refetch();
  refetchUnreadCount();
  onClose();
};
