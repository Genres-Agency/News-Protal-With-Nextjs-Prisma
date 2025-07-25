"use server";

import { db } from "@/server/db";
import { MediaType } from "@prisma/client";

export const getAllMedia = async () => {
  try {
    const media = await db.media.findMany({
      orderBy: { createdAt: "desc" },
    });
    return media;
  } catch (error) {
    throw new Error(`Failed to fetch media: ${error}`);
  }
};

export const getMediaByType = async (type: MediaType) => {
  try {
    const media = await db.media.findMany({
      where: { type },
      orderBy: { createdAt: "desc" },
    });
    return media;
  } catch (error) {
    throw new Error(`Failed to fetch ${type.toLowerCase()}s: ${error}`);
  }
};

export const addMedia = async (data: {
  title: string;
  url: string;
  type: MediaType;
  description?: string;
  size: number;
  mimeType: string;
}) => {
  try {
    const media = await db.media.create({
      data,
    });
    return media;
  } catch (error) {
    throw new Error(`Failed to add media: ${error}`);
  }
};

export const deleteMedia = async (id: string) => {
  try {
    await db.media.delete({
      where: { id },
    });
    return true;
  } catch (error) {
    throw new Error(`Failed to delete media: ${error}`);
  }
};
