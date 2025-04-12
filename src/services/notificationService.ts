
import { supabase } from '@/integrations/supabase/client';
import { Notification, NotificationType, EntityType } from '@/types/dataTypes';
import { handleError } from '@/utils/errorHandling';

// Get notifications for the current user
export const getUserNotifications = async (userId: string): Promise<Notification[]> => {
  try {
    // Check if the notifications table exists
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('recipient_id', userId)
      .order('created_at', { ascending: false })
      .limit(50);
      
    if (error) {
      console.error("Error fetching notifications:", error);
      return [];
    }
    
    return data as Notification[] || [];
  } catch (error) {
    handleError(error, 'Error fetching notifications');
    return [];
  }
};

// Get unread notifications count
export const getUnreadNotificationsCount = async (userId: string): Promise<number> => {
  try {
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('recipient_id', userId)
      .eq('is_read', false);
      
    if (error) {
      console.error("Error counting unread notifications:", error);
      return 0;
    }
    
    return count || 0;
  } catch (error) {
    handleError(error, 'Error fetching unread notifications count');
    return 0;
  }
};

// Mark notification as read
export const markNotificationAsRead = async (notificationId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);
      
    if (error) {
      console.error("Error marking notification as read:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    handleError(error, 'Error marking notification as read');
    return false;
  }
};

// Mark all notifications as read
export const markAllNotificationsAsRead = async (userId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('recipient_id', userId);
      
    if (error) {
      console.error("Error marking all notifications as read:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    handleError(error, 'Error marking all notifications as read');
    return false;
  }
};

// Create notification
export const createNotification = async (notification: Omit<Notification, 'id' | 'created_at'>): Promise<Notification | null> => {
  try {
    // Don't notify if the actor is the same as the recipient
    if (notification.actor_id === notification.recipient_id) {
      return null;
    }
    
    const { data, error } = await supabase
      .from('notifications')
      .insert({
        recipient_id: notification.recipient_id,
        type: notification.type,
        content: notification.content,
        entity_id: notification.entity_id,
        entity_type: notification.entity_type,
        actor_id: notification.actor_id,
        actor_name: notification.actor_name,
        actor_username: notification.actor_username,
        actor_profile_pic: notification.actor_profile_pic,
        is_read: false
      })
      .select()
      .single();
      
    if (error) {
      console.error("Error creating notification:", error);
      return null;
    }
    
    return data as Notification;
  } catch (error) {
    handleError(error, 'Error creating notification');
    return null;
  }
};

// Function to create a notification for a like on a scammer post
export const notifyScammerLike = async (
  scammerId: string,
  scammerName: string,
  recipientId: string,
  actorId: string,
  actorName: string,
  actorUsername?: string,
  actorProfilePic?: string
): Promise<void> => {
  try {
    await createNotification({
      recipient_id: recipientId,
      type: NotificationType.LIKE,
      content: `${actorName} liked your post about ${scammerName}`,
      entity_id: scammerId,
      entity_type: EntityType.SCAMMER,
      actor_id: actorId,
      actor_name: actorName,
      actor_username: actorUsername,
      actor_profile_pic: actorProfilePic,
      is_read: false
    });
  } catch (error) {
    console.error('Error creating like notification:', error);
  }
};

// Function to create a notification for a comment on a scammer post
export const notifyScammerComment = async (
  scammerId: string,
  scammerName: string,
  commentId: string,
  recipientId: string,
  actorId: string,
  actorName: string,
  actorUsername?: string,
  actorProfilePic?: string
): Promise<void> => {
  try {
    await createNotification({
      recipient_id: recipientId,
      type: NotificationType.COMMENT,
      content: `${actorName} commented on your post about ${scammerName}`,
      entity_id: commentId,
      entity_type: EntityType.COMMENT,
      actor_id: actorId,
      actor_name: actorName,
      actor_username: actorUsername,
      actor_profile_pic: actorProfilePic,
      is_read: false
    });
  } catch (error) {
    console.error('Error creating comment notification:', error);
  }
};

// Function to create a notification for a bounty on a scammer post
export const notifyScammerBounty = async (
  scammerId: string,
  scammerName: string,
  amount: number,
  recipientId: string,
  actorId: string,
  actorName: string,
  actorUsername?: string,
  actorProfilePic?: string
): Promise<void> => {
  try {
    await createNotification({
      recipient_id: recipientId,
      type: NotificationType.BOUNTY,
      content: `${actorName} added a bounty of ${amount} SOL on your post about ${scammerName}`,
      entity_id: scammerId,
      entity_type: EntityType.SCAMMER,
      actor_id: actorId,
      actor_name: actorName,
      actor_username: actorUsername,
      actor_profile_pic: actorProfilePic,
      is_read: false
    });
  } catch (error) {
    console.error('Error creating bounty notification:', error);
  }
};

// Function to create a notification for a reaction to a comment, reply, or announcement
export const notifyReaction = async (
  entityId: string,
  entityType: EntityType,
  entityName: string,
  reactionType: string,
  recipientId: string,
  actorId: string,
  actorName: string,
  actorUsername?: string,
  actorProfilePic?: string
): Promise<void> => {
  try {
    let content = '';
    switch (entityType) {
      case EntityType.COMMENT:
        content = `${actorName} reacted with ${reactionType} to your comment`;
        break;
      case EntityType.ANNOUNCEMENT:
        content = `${actorName} reacted with ${reactionType} to your announcement`;
        break;
      case EntityType.REPLY:
        content = `${actorName} reacted with ${reactionType} to your reply`;
        break;
      case EntityType.CHAT_MESSAGE:
        content = `${actorName} reacted with ${reactionType} to your message`;
        break;
      default:
        content = `${actorName} reacted with ${reactionType} to your post`;
    }
    
    await createNotification({
      recipient_id: recipientId,
      type: NotificationType.REACTION,
      content,
      entity_id: entityId,
      entity_type: entityType,
      actor_id: actorId,
      actor_name: actorName,
      actor_username: actorUsername,
      actor_profile_pic: actorProfilePic,
      is_read: false
    });
  } catch (error) {
    console.error('Error creating reaction notification:', error);
  }
};
