import type { PlatformKey, StatusKey } from "./constants";

export type Post = {
  id: string;
  title: string;
  content: string;
  platform: PlatformKey;
  status: StatusKey;
  plannedDate: string;
  publishedAt: string | null;
  mediaNote: string;
  metaPostId: string | null;
  impressions: number;
  reach: number;
  likes: number;
  comments: number;
  shares: number;
  clicks: number;
  metricsSyncedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type PostForm = {
  title: string;
  content: string;
  platform: PlatformKey;
  status: StatusKey;
  plannedDate: string;
  mediaNote: string;
  metaPostId: string;
  impressions: number;
  reach: number;
  likes: number;
  comments: number;
  shares: number;
  clicks: number;
};
