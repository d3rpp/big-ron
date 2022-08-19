use serenity::{
    async_trait,
    model::{application::interaction::Interaction, prelude::Ready},
    prelude::{Context, EventHandler},
};

use crate::config::Config;

use super::commands::cmd_resolve;

pub struct Handler;

#[async_trait]
impl EventHandler for Handler {
    async fn interaction_create(&self, ctx: Context, int: Interaction) {
        if let Some(cmd) = int.application_command() {
            cmd_resolve(ctx, cmd).await;
        }
    }

    async fn ready(&self, ctx: Context, _ready: Ready) {
        let config = Config::get();
        if let Some(activity) = config.bot_status.clone() {
            ctx.set_activity(activity).await;
        }
    }
}
