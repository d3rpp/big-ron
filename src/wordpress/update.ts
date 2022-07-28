/* eslint-disable no-await-in-loop */
import { GuildConfig } from '@prisma/client';
import { fetch } from 'undici';

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
    const postResponses = await fetch(`${guildConfig.wordpress}/wp-json/wp/v2/posts?_fields=id&order=asc&orderby=date&page=1&per_page=50`);
    const ids: PostResponse = await postResponses.json() as PostResponse;

    const idsToCheck = ids.map((item) => item.id);
    const idsPosted = await checkIdsInDB(idsToCheck, guildConfig.wordpress, guildConfig.guildId);

    for (let i = 0; i < idsToCheck.length; i += 1) {
      const item = idsToCheck[i];

      // eslint-disable-next-line no-continue
      if (idsPosted.includes(item)) continue;

      const articleDetails = await getArticleDetails(guildConfig.wordpress, item.toString(10));

      await callback(guildConfig, articleDetails);
      await afterIdPosted(item, guildConfig.wordpress, guildConfig.guildId);
    }
  });
};
