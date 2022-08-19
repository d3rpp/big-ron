use crate::types::{Article, GuildConfig};
use serenity::prelude::Mentionable;

use super::get_http;

pub async fn post_article(guild: &GuildConfig, article: Article) {
    let bot = get_http();
    let role = guild.role_id.mention();
    let id = article.id.clone().unwrap_or(0);
    let embed = article.into();
    let res = guild
        .channel_id
        .send_message(bot, |msg| msg.content(role).set_embed(embed))
        .await;

    if let Err(why) = res {
        println!(
            "Failed to send article {} to {} in {} because...\n{}\n",
            id, guild.channel_id, guild.guild_id, why,
        );
    }
}
