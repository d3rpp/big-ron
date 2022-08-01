import { fetch } from 'undici';

import { Article } from '../types/wordpress/Article';
import { User } from '../types/wordpress/User';

import { ArticlePost } from './article';

// https://developer.wordpress.org/rest-api/using-the-rest-api/global-parameters/
const API_QUERY_FIELDS = 'id,date_gmt,yoast_head_json.og_title,yoast_head_json.og_description,yoast_head_json.canonical,yoast_head_json.og_image,yoast_head_json.author,date';

// eslint-disable-next-line max-len, no-async-promise-executor, import/prefer-default-export
export const getArticleDetails = (APIRoot: string, postId: string): Promise<ArticlePost> => new Promise<ArticlePost>(async (resolve, reject) => {
  try {
    // gets Post with id
    const articleResponse = await fetch(
      `${APIRoot}/wp-json/wp/v2/posts/${postId}?_fields=${API_QUERY_FIELDS}`,
    );
    const articleResponseTyped = (await articleResponse.json()) as Article;
    console.debug(articleResponseTyped);

    // Get Author Props
    // eslint-disable-next-line no-underscore-dangle
    const authorResponse = await fetch(`${articleResponseTyped._links.author[0].href}?_fields=name,avatar_urls`);

    const authorResponseTyped = (await authorResponse.json()) as User;

    const authPfp = authorResponseTyped.avatar_urls['96'];
    const ogImage = articleResponseTyped.yoast_head_json.og_image;
    const thumbnailUrl = ogImage !== undefined
      ? ogImage[0]?.url || null
      : null;

    const returnValue: ArticlePost = {
      author: {
        // This should hopefully get us the largest one
        profile_picture_url: authPfp,
        profile_name: authorResponseTyped.name,
      },
      title: articleResponseTyped.yoast_head_json.og_title,
      caption: articleResponseTyped.yoast_head_json.og_description,
      url: articleResponseTyped.yoast_head_json.canonical,
      // Hopefully the largest available
      thumbnailUrl,
      date: articleResponseTyped.date_gmt,
    };

    resolve(returnValue);
  } catch (e) {
    reject(e);
  }
});
