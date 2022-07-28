import { Article } from "../types/wordpress/Article";
import { User } from "../types/wordpress/User";

import { ArticlePost } from "./article";

export const API_ROOT = "https://randy.gg";

// https://developer.wordpress.org/rest-api/using-the-rest-api/global-parameters/
// eslint-disable-next-line operator-linebreak
const API_QUERY_FIELDS =
  "id,date_gmt,yoast_head_json.og_title,yoast_head_json.og_description,yoast_head_json.canonical,yoast_head_json.og_image[].url,yoast_head_json.author,date";

export const getArticleDetails = (postId: string): Promise<ArticlePost> =>
  // eslint-disable-next-line implicit-arrow-linebreak, no-async-promise-executor
  new Promise<ArticlePost>(async (resolve, reject) => {
    try {
      // gets Post with id
      const articleResponse = await fetch(
        `${API_ROOT}/wp-json/wp/v2/posts/${postId}?_fields=${API_QUERY_FIELDS}`,
      );
      const articleResponseTypes = (await articleResponse.json()) as Article;

      // Get Author Props
      const authorResponse = await fetch(
        `${API_ROOT}/wp-json/wp/v2/users/${articleResponseTypes.author}`,
      );

      const authorResponseTypes = (await authorResponse.json()) as User;

      const authorPfp = authorResponseTypes.avatar_urls;

      // eslint-disable-next-line max-len
      const pfpSizes: string[] = Object.keys(authorPfp).sort((a, b) => parseInt(a, 10) - parseInt(b, 10));

      const returnValue: ArticlePost = {
        author: {
          profile_picture_url: (authorResponseTypes.avatar_urls as any)[
            pfpSizes[-1]
          ],
          profile_name: authorResponseTypes.name,
        },
        title: articleResponseTypes.yoast_head_json.og_title,
        caption: articleResponseTypes.yoast_head_json.og_description,
        url: articleResponseTypes.yoast_head_json.canonical,
        // Hopefully the largest available
        thumbnail_url: articleResponseTypes.yoast_head_json.og_image[0].url,
        date: articleResponseTypes.date_gmt,
      };

      resolve(returnValue);
    } catch (e) {
      reject(e);
    }
  });
