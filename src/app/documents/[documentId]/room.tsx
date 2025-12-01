"use client";

import { DOC_INITIAL_LEFT_MARGIN, DOC_INITIAL_RIGHT_MARGIN } from "@/app/constants/defaults";
import { FullscreenLoader } from "@/components/fullscreen-loader";
import { ClientSideSuspense, LiveblocksProvider, RoomProvider } from "@liveblocks/react/suspense";
import { useParams } from "next/navigation";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Id } from "../../../../convex/_generated/dataModel";
import { getDocuments, getUsers } from "./action";

type User = {
  id: string;
  name: string;
  avatar: string;
  color: string;
};

export function Room({ children }: { children: ReactNode }) {
  const params = useParams();

  const [users, setUsers] = useState<User[]>([]);

  const fetchUsers = useCallback(async () => {
    try {
      const list = await getUsers();
      setUsers(list);
    } catch (error) {
      toast.error("Failed to fetch users: " + error);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
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

  const resolveRoomsInfo = async ({ roomIds }: { roomIds: string[] }) => {
    const documents = await getDocuments(roomIds as Id<"documents">[]);
    return documents.map(doc => ({ id: doc.id, name: doc.name }));
  };

  return (
    <LiveblocksProvider
      throttle={16}
      authEndpoint={authEndpoint}
      resolveUsers={resolveUsers}
      resolveMentionSuggestions={resolveMentionSuggestions}
      resolveRoomsInfo={resolveRoomsInfo}
    >
      <RoomProvider
        id={params.documentId as string}
        initialStorage={{
          leftMargin: DOC_INITIAL_LEFT_MARGIN,
          rightMargin: DOC_INITIAL_RIGHT_MARGIN,
        }}
      >
        <ClientSideSuspense fallback={<FullscreenLoader label="Room loading..." />}>
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}
