"use client";

import {
  ACTIVITY_CHATBOT,
  ACTIVITY_EXPLORER,
  ACTIVITY_RECENT,
  ACTIVITY_SEARCH,
  ACTIVITY_STARRED,
} from "@/app/constants/activities";
import { ACTIVITY_BAR_WIDTH } from "@/app/constants/defaults";
import { Clock, FolderOpen, MessageSquare, Search, Star } from "lucide-react";
import { useState } from "react";

interface ActivityBarProps {
  onActivityChange?: (activity: string | null) => void;
}

export const ActivityBar = ({ onActivityChange }: ActivityBarProps) => {
  const [activeActivity, setActiveActivity] = useState<string | null>(ACTIVITY_EXPLORER);

  const handleActivityClick = (activity: string) => {
    const newActivity = activeActivity === activity ? null : activity;
    setActiveActivity(newActivity);
    onActivityChange?.(newActivity);
  };

  const activities = [
    { id: ACTIVITY_EXPLORER, icon: FolderOpen, label: "Explorer" },
    { id: ACTIVITY_SEARCH, icon: Search, label: "Search" },
    { id: ACTIVITY_RECENT, icon: Clock, label: "Recent" },
    { id: ACTIVITY_STARRED, icon: Star, label: "Starred" },
    { id: ACTIVITY_CHATBOT, icon: MessageSquare, label: "Chatbot" },
  ];

  return (
    <aside
      style={{ width: `${ACTIVITY_BAR_WIDTH}px` }}
      className="bg-gray-50 border-r border-gray-200 h-screen fixed left-0 top-[102px] flex flex-col items-center py-4 gap-2 print:hidden"
    >
      {activities.map(activity => {
        const Icon = activity.icon;
        return (
          <button
            key={activity.id}
            onClick={() => handleActivityClick(activity.id)}
            className={`p-2 rounded-lg transition-colors ${
              activeActivity === activity.id
                ? "bg-blue-100 text-blue-700"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            }`}
            title={activity.label}
          >
            <Icon className="w-5 h-5" />
          </button>
        );
      })}
    </aside>
  );
};
