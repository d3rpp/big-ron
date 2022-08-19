use std::sync::Arc;

use crate::{config::Config, types::GuildConfig};
use anyhow::Result;
use once_cell::sync::OnceCell;
use redis::{Commands, FromRedisValue, ToRedisArgs, RedisResult};
use serenity::model::prelude::{ChannelId, GuildId, RoleId};

const CACHE_CLIENT: OnceCell<Arc<redis::Client>> = OnceCell::new();

struct CacheClient;
impl CacheClient {
    fn new_client() -> Arc<redis::Client> {
        let config = Config::get();
        let client = redis::Client::open(config.redis_url.clone())
            .expect("Failed to initialize redis client");
        Arc::new(client)
    }

    fn get_client() -> Arc<redis::Client> {
        if let Some(client) = CACHE_CLIENT.get() {
            client.clone()
        } else {
            let client = Self::new_client();
            CACHE_CLIENT
                .set(client)
                .expect("Failed to set global client.");
            Self::get_client()
        }
    }
}

fn get_client() -> Result<redis::Connection> {
    let client = CacheClient::get_client();
    let conn = client.get_connection()?;
    Ok(conn)
}

fn set_cache<J: ToRedisArgs, K: ToRedisArgs, H: ToRedisArgs>(
    key: J,
    field: K,
    value: H,
) {
    let cl_opt = get_client();

    if let Ok(client) = cl_opt {
        if let Err(why) = client.hset(key, field, value) {
            println!("Failed to H_SET {}", why);
        }
    }
}

fn get_cache<T: redis::FromRedisValue, J: ToRedisArgs, K: ToRedisArgs>(
    key: J,
    field: K,
) -> Option<T> {
    let cl_opt = get_client();

    if let Ok(client) = cl_opt {
        match client.hget(key, field) {
            Ok(res) => Some(res),
            Err(why) => {
                println!("Failed to get cache.\n{}\n", why);
                None
            }
        }
    } else {
        None
    }
}

fn get_cache_all<T: redis::FromRedisValue, J: ToRedisArgs>(key: J) -> Vec<T> {
    let cl_opt = get_client();

    if let Ok(client) = cl_opt {
        match client.hvals(key) {
            Ok(res) => res,
            Err(why) => {
                println!("Failed to get cache.\n{}\n", why);
                vec![]
            }
        }
    } else {
        vec![]
    }
}

async fn get_wordpress(guild_id: GuildId) -> Option<String> {
    get_cache(guild_id.0, "wordpress")
}

async fn get_channel_id(guild_id: GuildId) -> Option<ChannelId> {
    match get_cache(guild_id.0, "channel_id") {
        Some(channel_id) => Some(ChannelId(channel_id)),
        None => None,
    }
}

async fn get_role_id(guild_id: GuildId) -> Option<RoleId> {
    match get_cache(guild_id.0, "role_id") {
        Some(role_id) => Some(RoleId(role_id)),
        None => None,
    }
}

pub async fn get_posted_ids(guild_id: &GuildId, wordpress: &String) -> Vec<i32> {}

pub async fn get_configs() -> Option<Vec<GuildConfig>> {
    Ok(vec![])
}

pub async fn get_config(guild_id: GuildId) -> Option<GuildConfig> {
    todo!()
}

pub async fn add_config(config: &GuildConfig) -> Result<()> {
    Ok(())
}

pub async fn set_wordpress(guild_id: GuildId, wordpress: String) {
    set_cache(guild_id.0, "wordpress", wordpress);
}

pub async fn set_channel_id(guild_id: GuildId, channel_id: ChannelId) {
    set_cache(guild_id.0, "channel_id", channel_id.0);
}

pub async fn set_role_id(guild_id: GuildId, role_id: RoleId) {
    set_cache(guild_id.0, "role_id", role_id.0);
}
