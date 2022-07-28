import { afterIdPosted, checkIdsInDB } from '../database';

// eslint-disable-next-line no-unused-vars
export type UpdateCallback = (id: number) => Promise<void>;

type PostResponse = { id: number }[];

/**
 * @param url The url that returns a bunch of post ids
 * @param callback callback that gets run for every post that isn't up at the time of checking
 */
export const getUpdates = async (url: string, callback: UpdateCallback) => {
  const postResponses = await fetch(url);
  const ids: PostResponse = await postResponses.json();

  const idsToCheck = ids.map((item) => item.id);
  const idsNotPosted = await checkIdsInDB(idsToCheck);

  idsNotPosted.forEach((item) => {
    callback(item).then(() => {
      afterIdPosted(item);
    });
  });
};
