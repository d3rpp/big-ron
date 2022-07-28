import { Article } from "../types/wordpress/Article";
import { User } from "../types/wordpress/User";

import { ArticlePost } from "./article";

export const API_ROOT = "https://randy.gg";

// https://developer.wordpress.org/rest-api/using-the-rest-api/global-parameters/
const API_QUERY_FIELDS =
    "id,date_gmt,yoast_head_json.og_title,yoast_head_json.og_description,yoast_head_json.canonical,yoast_head_json.og_image[].url,yoast_head_json.author,date";

export const get_article_details = (post_id: string): Promise<ArticlePost> => {
    return new Promise<ArticlePost>(async (resolve, reject) => {

		try {
			// gets Post with id
            let article_response = await fetch(
                `${API_ROOT}/wp-json/wp/v2/posts/${post_id}?_fields=${API_QUERY_FIELDS}`
            );
			let article_response_typed = (await article_response.json()) as Article;

			// Get Author Props
			let author_response = await fetch(
				`${API_ROOT}/wp-json/wp/v2/users/${article_response_typed.author}`
			);

			let author_response_typed = (await author_response.json()) as User;

			let auth_pfp = author_response_typed.avatar_urls;

			let pfp_sizes: string[] = Object.keys(auth_pfp).sort((a, b) => {
				return parseInt(a) - parseInt(b);
			});


            let return_value: ArticlePost = {
				author: {
					profile_picture_url: (author_response_typed.avatar_urls as any)[pfp_sizes[-1]],
					profile_name: author_response_typed.name
				},
				title: article_response_typed.yoast_head_json.og_title,
				caption: article_response_typed.yoast_head_json.og_description,
				url: article_response_typed.yoast_head_json.canonical,
				// Hopefully the largest available
				thumbnail_url: article_response_typed.yoast_head_json.og_image[0].url,
				date: article_response_typed.date_gmt
			};

            resolve(return_value);
        } catch (e) {
            reject(e);
        }
    });
};
