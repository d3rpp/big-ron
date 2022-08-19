use std::sync::Arc;

use once_cell::sync::OnceCell;
use serenity::model::prelude::{Activity, GuildId};

macro_rules! get_val {
    ($key:expr, false) => {
        std::env::var($key).ok()
    };
    ($key:expr, true) => {
        std::env::var($key).expect(concat!("Failed to get env var ", $key))
    };
}

pub struct Config {
    pub bot_token: String,
    pub bot_status: Option<Activity>,
    pub database_url: String,
    pub redis_url: String,
    pub dev_server: Option<GuildId>,
}

static CONFIG: OnceCell<Arc<Config>> = OnceCell::new();

impl Config {
    fn new() -> Config {
        let bot_token = get_val!("BOT_TOKEN", true);
        let bot_status_str = get_val!("BOT_STATUS", false);
        let database_url = get_val!("DATABASE_URL", true);
        let redis_url = get_val!("REDIS_URL", true);
        let dev_server_str = get_val!("DEV_SERVER", false);
        let mut dev_server = None;

        // convert dev_server str to int
        if let Some(dev_s) = dev_server_str {
            dev_server = Some(GuildId(
                dev_s.parse().expect("Failed to parse given DEV_SERVER"),
            ));
        }

        // set status to activity
        let mut bot_status = None;

        if let Some(status) = bot_status_str {
            bot_status = Some(Activity::playing(status));
        }

        Config {
            bot_token,
            bot_status,
            database_url,
            redis_url,
            dev_server,
        }
    }

    pub fn get() -> Arc<Config> {
        if let Some(result) = CONFIG.get() {
            result.clone()
        } else {
            let config = Arc::new(Config::new());
            if let Err(_why) = CONFIG.set(config) {
                panic!("Failed to set config globally.");
            }
            Self::get()
        }
    }
}
