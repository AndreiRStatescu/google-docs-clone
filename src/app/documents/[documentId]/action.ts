"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { ConvexHttpClient } from "convex/browser";

import { generateColorFromName } from "@/lib/utils";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function getDocuments(ids: Id<"documents">[]) {
  return await convex.query(api.documents.getByIds, { ids });
}

export async function getUsers() {
  const { orgId } = await auth();
  const clerk = await clerkClient();

  const response = await clerk.users.getUserList({
    organizationId: [orgId as string],
  });

  const users = response.data.map(user => ({
    id: user.id,
    name: user.fullName ?? "Anonymous",
    avatar: user.imageUrl,
    color: generateColorFromName(user.fullName ?? "Anonymous"),
  }));

  return users;
}
