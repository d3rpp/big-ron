mod articles;
mod commands;
mod embeds;
mod events;
mod register;
use std::sync::Arc;

use crate::{
    config::Config,
    types::{Articles, GuildConfig},
};
use anyhow::Result;
use once_cell::sync::OnceCell;
use serenity::{
    http::{Http, HttpBuilder},
    prelude::GatewayIntents,
    Client,
};

use self::articles::post_article;

const DISCORD_HTTP: OnceCell<Arc<Http>> = OnceCell::new();

fn set_http(http_opt: Option<Arc<Http>>) {
    let config = Config::get();
    let http = match http_opt {
        Some(http) => http,
        None => Arc::new(HttpBuilder::new(config.bot_token.clone()).build()),
    };
    DISCORD_HTTP
        .set(http)
        .expect("Failed to set global Discord HTTP client.");
}

pub fn get_http() -> Arc<Http> {
    if let Some(http) = DISCORD_HTTP.get() {
        http.clone()
    } else {
        // NOTE(dylhack): this shouldn't happen if start is
        //                called before get_http.
        set_http(None);
        get_http()
    }
}

pub async fn init() -> Result<Client> {
    let config = Config::get();
    let intents = GatewayIntents::non_privileged() | GatewayIntents::MESSAGE_CONTENT;
    let client = Client::builder(config.bot_token.clone(), intents)
        .event_handler(events::Handler)
        .await?;

    set_http(Some(client.cache_and_http.http.clone()));
    Ok(client)
}

pub async fn post_articles(guild: GuildConfig, articles: Articles) {
    for article in articles {
        // NOTE(dylhack): This is an intentional await loop to post the articles
        //                in chronological order.
        post_article(&guild, article.clone()).await;
    }
}
