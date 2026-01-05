/**
 * Firebase Notifications Service
 * 
 * Handles notification creation and retrieval
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
} from 'firebase/firestore';
import { db } from './config';
import { FirestoreNotification } from '@/types/firebase';

const NOTIFICATIONS_COLLECTION = 'notifications';

/**
 * Get a notification by ID
 */
export const getNotification = async (notificationId: string): Promise<FirestoreNotification | null> => {
  try {
    const notificationDoc = await getDoc(doc(db, NOTIFICATIONS_COLLECTION, notificationId));
    if (!notificationDoc.exists()) {
      return null;
    }
    return {
      notificationId: notificationDoc.id,
      ...notificationDoc.data(),
    } as FirestoreNotification;
  } catch (error) {
    console.error('Get notification error:', error);
    throw error;
  }
};

/**
 * Get all notifications for a user
 */
export const getNotificationsByUserId = async (
  userId: string,
  options?: { unreadOnly?: boolean; limit?: number }
): Promise<FirestoreNotification[]> => {
  try {
    let q = query(
      collection(db, NOTIFICATIONS_COLLECTION),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    if (options?.unreadOnly) {
      q = query(q, where('isRead', '==', false));
    }

    if (options?.limit) {
      q = query(q, limit(options.limit));
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      notificationId: doc.id,
      ...doc.data(),
    })) as FirestoreNotification[];
  } catch (error) {
    console.error('Get notifications by user ID error:', error);
    throw error;
  }
};

/**
 * Get unread notification count for a user
 */
export const getUnreadNotificationCount = async (userId: string): Promise<number> => {
  try {
    const q = query(
      collection(db, NOTIFICATIONS_COLLECTION),
      where('userId', '==', userId),
      where('isRead', '==', false)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.size;
  } catch (error) {
    console.error('Get unread notification count error:', error);
    throw error;
  }
};

/**
 * Create a notification
 */
export const createNotification = async (
  notificationData: Omit<FirestoreNotification, 'notificationId' | 'createdAt'>
): Promise<string> => {
  try {
    const notificationRef = doc(collection(db, NOTIFICATIONS_COLLECTION));
    const now = Timestamp.now();

    await setDoc(notificationRef, {
      ...notificationData,
      notificationId: notificationRef.id,
      createdAt: now,
    });

    return notificationRef.id;
  } catch (error) {
    console.error('Create notification error:', error);
    throw error;
  }
};

/**
 * Mark notification as read
 */
export const markNotificationAsRead = async (notificationId: string): Promise<void> => {
  try {
    await updateDoc(doc(db, NOTIFICATIONS_COLLECTION, notificationId), {
      isRead: true,
      readAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Mark notification as read error:', error);
    throw error;
  }
};

/**
 * Mark all notifications as read for a user
 */
export const markAllNotificationsAsRead = async (userId: string): Promise<void> => {
  try {
    const notifications = await getNotificationsByUserId(userId, { unreadOnly: true });
    const batch = notifications.map((notification) =>
      markNotificationAsRead(notification.notificationId)
    );
    await Promise.all(batch);
  } catch (error) {
    console.error('Mark all notifications as read error:', error);
    throw error;
  }
};

/**
 * Delete a notification
 */
export const deleteNotification = async (notificationId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, NOTIFICATIONS_COLLECTION, notificationId));
  } catch (error) {
    console.error('Delete notification error:', error);
    throw error;
  }
};

/**
 * Create a risk alert notification for a teacher
 */
export const createRiskAlertNotification = async (
  teacherUserId: string,
  studentId: string,
  studentName: string,
  riskLevel: 'Low' | 'Medium' | 'High'
): Promise<string> => {
  return createNotification({
    userId: teacherUserId,
    type: 'risk_alert',
    title: `${riskLevel} Risk Alert: ${studentName}`,
    message: `${studentName} has been identified as ${riskLevel} risk. Review their profile and consider intervention.`,
    isRead: false,
    studentId,
  });
};

