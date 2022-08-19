mod bot;
mod config;
mod database;
mod types;
mod wordpress;
use anyhow::Result;
use bot::{init, post_articles};
use database::get_guild_configs;
use futures::future::join_all;
use std::time::Duration;
use tokio::time;
use wordpress::get_new_articles;

// NOTE(dylhack): INTERVALS = 10 minutes
const INTERVALS: Duration = Duration::from_secs(10 * 60);

async fn post_new_articles() -> Result<()> {
    let configs = get_guild_configs().await?;
    let mut posting_jobs = vec![];

    for config in configs {
        // NOTE(dylhack): with caching involved we won't have to worry
        //                about this being an await loop.
        let res = get_new_articles(&config).await;
        if let Ok(articles) = res {
            // NOTE(dylhack): post_articles will handle it's own errors so
            //                even if one guild/wordpress link is faulty then
            //                the others will deliver.
            let job = post_articles(config, articles);
            posting_jobs.push(job);
        }
    }

    join_all(posting_jobs).await;

    Ok(())
}

#[tokio::main]
async fn main() -> Result<()> {
    let mut client = init().await?;

    // NOTE(dylhack): This spawns the Article Worker, this MUST happen after
    //                the client has been initialized so that the HTTP client
    //                is available.
    tokio::spawn(async move {
        let mut interval = time::interval(INTERVALS);
        loop {
            interval.tick().await;
            if let Err(why) = post_new_articles().await {
                println!("Failed to post new articles.\n{}\n", why);
            }
        }
    });

    if let Err(why) = client.start().await {
        panic!("Failed to start connection with Discord.\n{}\n", why);
    }

    Ok(())
}
