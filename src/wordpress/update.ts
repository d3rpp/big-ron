import { GuildConfig } from '@prisma/client';
import { getArticleDetails } from '.';
import { afterIdPosted, checkIdsInDB, getAllConfigs } from '../database';
import { ArticlePost } from './article';

// eslint-disable-next-line no-unused-vars
export type UpdateCallback = (guild: GuildConfig, article: ArticlePost) => Promise<void>;

type PostResponse = { id: number }[];

/**
 * @param callback callback that gets run for every post that isn't up at the time of checking
 */
export const getUpdates = async (callback: UpdateCallback) => {
  const configs = await getAllConfigs();

  configs.forEach(async (guildConfig) => {
    const postResponses = await fetch(`${guildConfig.wordpress}/wp-json/wp/v2/posts?_fields=id`);
    const ids: PostResponse = await postResponses.json();

    const idsToCheck = ids.map((item) => item.id);
    const idsNotPosted = await checkIdsInDB(idsToCheck);

    idsNotPosted.forEach(async (item) => {
      const articleDetails = await getArticleDetails(guildConfig.wordpress, item.toString(10));

      callback(guildConfig, articleDetails).then(() => {
        afterIdPosted(item);
      });
    });
  });
};
