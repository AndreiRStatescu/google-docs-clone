"use client";

import { FullscreenLoader } from "@/components/fullscreen-loader";
import { ClientSideSuspense, LiveblocksProvider, RoomProvider } from "@liveblocks/react/suspense";
import { useParams } from "next/navigation";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { getUsers } from "./action";

type User = {
  id: string;
  name: string;
  avatar: string;
};

export function Room({ children }: { children: ReactNode }) {
  const params = useParams();

  const [users, setUsers] = useState<User[]>([]);

  const fetchUsers = useMemo(
    () => async () => {
      try {
        const list = await getUsers();
        setUsers(list);
      } catch (error) {
        toast.error("Failed to fetch users: " + error);
      }
    },
    []
  );

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const authEndpoint = async () => {
    const endpoint = "/api/liveblocks-auth";
    const room = params.documentId as string;

    const response = await fetch(endpoint, {
      method: "POST",
      body: JSON.stringify({ room }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch Liveblocks auth token");
    }

    return await response.json();
  };

  const resolveUsers = ({ userIds }: { userIds: string[] }) => {
    return userIds.map(userId => users.find(user => user.id === userId) ?? undefined);
  };

  const resolveMentionSuggestions = ({ text }: { text: string }) => {
    let filteredUsers = users;
    if (text) {
      filteredUsers = users.filter(user => user.name.toLowerCase().includes(text.toLowerCase()));
    }
    return filteredUsers.map(user => user.id);
  };

  const resolveRoomsInfo = () => [];

  return (
    <LiveblocksProvider
      throttle={16}
      authEndpoint={authEndpoint}
      resolveUsers={resolveUsers}
      resolveMentionSuggestions={resolveMentionSuggestions}
      resolveRoomsInfo={resolveRoomsInfo}
    >
      <RoomProvider id={params.documentId as string}>
        <ClientSideSuspense fallback={<FullscreenLoader label="Room loading..." />}>
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}
