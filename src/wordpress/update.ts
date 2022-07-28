/* eslint-disable no-unused-vars */
import { getPrismaClient } from "../database";

export type UpdateCallback = () => void;

type PostResponse = { id: number; date: string }[];

// TODO(d3rpp) figure out what the callback gets
/**
 * @param url The url that returns a bunch of post ids
 * @param callback callback that gets run for every post that isn't up at the time of checking
 */
export const getUpdates = async (url: string, callback: UpdateCallback) => {
  const postResponses = await fetch(url);
  const ids: PostResponse = await postResponses.json();

  const prisma = getPrismaClient();
};
