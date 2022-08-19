use crate::types::Article;
use htmlentity::entity::*;
use serenity::builder::CreateEmbed;
use std::collections::HashMap;
use substring::Substring;

const MAX_DESC: usize = 2047;

fn fix_description(url: String, desc: &String) -> String {
    let mut result = String::new();
    let length = desc.len();

    decode_to(desc, &mut result);
    if length > MAX_DESC {
        let suffix = format!("... [View more here!]({})", url);
        let end = (MAX_DESC - 1) - suffix.len();
        let new_desc = result.substring(0, end);

        result = String::from(format!("{}{}", new_desc, suffix));
    }

    result
}

impl Into<CreateEmbed> for Article {
    fn into(self) -> CreateEmbed {
        let mut builder = CreateEmbed(HashMap::new());

        if let Some(json) = self.yoast_head_json {
            let url = json.canonical;
            if let Some(title) = json.og_title {
                builder.title(title);
            }
            if let Some(description) = json.og_description {
                let new_desc = fix_description(url, &description);
                builder.description(new_desc);
            } else {
                builder.description("description");
            }
        }

        builder
    }
}
