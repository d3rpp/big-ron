import { Article } from '../types/wordpress/Article';
import { User } from '../types/wordpress/User';

import { ArticlePost } from './article';

export const API_ROOT = 'https://randy.gg';

// https://developer.wordpress.org/rest-api/using-the-rest-api/global-parameters/
const API_QUERY_FIELDS = 'id,date_gmt,yoast_head_json.og_title,yoast_head_json.og_description,yoast_head_json.canonical,yoast_head_json.og_image[].url,yoast_head_json.author,date';

// eslint-disable-next-line max-len, no-async-promise-executor
export const getArticleDetails = (APIRoot: string, postId: string): Promise<ArticlePost> => new Promise<ArticlePost>(async (resolve, reject) => {
  try {
    // gets Post with id
    const articleResponse = await fetch(
      `${APIRoot}/wp-json/wp/v2/posts/${postId}?_fields=${API_QUERY_FIELDS}`,
    );
    const articleResponseTyped = (await articleResponse.json()) as Article;

    // Get Author Props
    const authorResponse = await fetch(
      `${API_ROOT}/wp-json/wp/v2/users/${articleResponseTyped.author}`,
    );

    const authorResponseTyped = (await authorResponse.json()) as User;

    const authPfp = authorResponseTyped.avatar_urls;

    // eslint-disable-next-line max-len
    const pfpSizes: string[] = Object.keys(authPfp).sort((a, b) => parseInt(a, 10) - parseInt(b, 10));

    const returnValue: ArticlePost = {
      author: {
        profile_picture_url: (authorResponseTyped.avatar_urls as any)[pfpSizes[-1]],
        profile_name: authorResponseTyped.name,
      },
      title: articleResponseTyped.yoast_head_json.og_title,
      caption: articleResponseTyped.yoast_head_json.og_description,
      url: articleResponseTyped.yoast_head_json.canonical,
      // Hopefully the largest available
      thumbnail_url: articleResponseTyped.yoast_head_json.og_image[0].url,
      date: articleResponseTyped.date_gmt,
    };

    resolve(returnValue);
  } catch (e) {
    reject(e);
  }
});
