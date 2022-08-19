use anyhow::Result;
use futures::future::join_all;
use serde::{Deserialize, Serialize};

use crate::database::get_posted_ids;
use crate::types::{Article, Articles, GuildConfig};

const API_QUERY_FIELDS: &str = "id,date_gmt,yoast_head_json.og_title,yoast_head_json.og_description,yoast_head_json.canonical,yoast_head_json.og_image,yoast_head_json.author,date";
const POSTS_QUERY: &str = "?_fields=id&order=asc&orderby=date&page=1&per_page=50";

#[derive(Deserialize, Serialize)]
struct PostId {
    id: i32,
}

async fn get_article(wordpress: &String, post_id: i32) -> Result<Article> {
    let url = format!(
        "{}/wp-json/wp/v2/posts/{}?_fields={}",
        wordpress, post_id, API_QUERY_FIELDS,
    );
    let resp = reqwest::get(url).await?.json::<Article>().await?;

    Ok(resp)
}

async fn get_article_ids(config: &GuildConfig) -> Result<Vec<i32>> {
    let url = format!("{}/wp-json/wp/v2/posts{}", config.wordpress, POSTS_QUERY,);
    let resp = reqwest::get(url).await?.json::<Vec<PostId>>().await?;

    let result = {
        let mut result = vec![];
        for ele in resp {
            result.push(ele.id);
        }
        result
    };

    Ok(result)
}

async fn get_new_article_ids(config: &GuildConfig) -> Result<Vec<i32>> {
    let mut new_ids = get_article_ids(config).await?;
    let old_ids = get_posted_ids(&config.guild_id, &config.wordpress).await?;
    let filter = |opt_id: Option<&i32>| {
        if let Some(id) = opt_id {
            return !old_ids.contains(id);
        }
        return false;
    };

    let max = new_ids.len();
    let mut i = 0;
    while i < max {
        let opt_val = new_ids.get(i);
        if !filter(opt_val) {
            new_ids.remove(i);
        } else {
            i += 1;
        }
    }

    Ok(new_ids)
}

pub async fn get_new_articles(config: &GuildConfig) -> Result<Articles> {
    let article_ids = get_new_article_ids(config).await?;
    let mut jobs = vec![];

    for post_id in article_ids {
        let job = get_article(&config.wordpress, post_id);
        jobs.push(job);
    }

    let finished = join_all(jobs).await;
    let mut articles = vec![];
    for ele in finished {
        if let Ok(article) = ele {
            articles.push(article);
        }
    }

    Ok(articles)
}
