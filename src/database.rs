mod cache;
use anyhow::Result;
use serenity::model::prelude::{ChannelId, GuildId, RoleId};

use crate::types::GuildConfig;

pub async fn get_posted_ids(guild_id: &GuildId, wordpress: &String) -> Result<Vec<i32>> {
    Ok(vec![])
}

pub async fn get_guild_configs() -> Result<Vec<GuildConfig>> {
    Ok(vec![])
}

pub async fn get_config(guild_id: GuildId) -> Result<GuildConfig> {
    todo!()
}

pub async fn add_config(config: &GuildConfig) -> Result<()> {
    Ok(())
}

pub async fn set_wordpress(guild_id: GuildId, wordpress: String) -> Result<()> {
    Ok(())
}

pub async fn set_channel_id(guild_id: GuildId, channel_id: ChannelId) -> Result<()> {
    Ok(())
}

pub async fn set_role_id(guild_id: GuildId, role_id: RoleId) -> Result<()> {
    Ok(())
}
