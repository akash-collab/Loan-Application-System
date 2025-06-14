// src/components/NotificationList.tsx
import { useEffect, useState } from "react";
import { db } from "../services/firebase";
import { ref, get } from "firebase/database";
import { useAuth } from "../contexts/AuthContext";

interface NotificationItem {
  id: string;
  message: string;
  timestamp: number;
}

export default function NotificationList({ limit }: { limit?: number }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user?.uid) return;
      const snapshot = await get(ref(db, `notifications/${user.uid}`));

      if (snapshot.exists()) {
        const data = Object.entries(snapshot.val()).map(([id, value]: any) => ({
          id,
          ...value,
        })) as NotificationItem[];

        const sorted = data.sort((a, b) => b.timestamp - a.timestamp);
        setNotifications(limit ? sorted.slice(0, limit) : sorted);
      }
    };

    fetchNotifications();
  }, [user, limit]);

  return (
    <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
      {notifications.length === 0 && <li className="text-xs text-gray-400">No notifications</li>}
      {notifications.map((n) => (
        <li key={n.id} className="border-l-2 border-indigo-500 pl-2">
          {n.message}
        </li>
      ))}
    </ul>
  );
}
