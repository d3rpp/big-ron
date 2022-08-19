use serde::{Deserialize, Serialize};
use serde_json::Value;
use serenity::model::prelude::{ChannelId, GuildId, RoleId};

pub type Articles = Vec<Article>;

pub struct GuildConfig {
    pub wordpress: String,
    pub guild_id: GuildId,
    pub channel_id: ChannelId,
    pub role_id: RoleId,
}

// pub struct PostedId {
//     unique_id: String,
//     id: u32,
//     wordpress: String,
//     guild_id: GuildId,
// }

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct Article {
    pub id: Option<i64>,
    pub date: Option<String>,
    pub date_gmt: Option<String>,
    pub guid: Option<Guid>,
    pub modified: Option<String>,
    pub modified_gmt: Option<String>,
    pub slug: Option<String>,
    pub status: Option<String>,
    #[serde(rename = "type")]
    pub type_field: Option<String>,
    pub link: Option<String>,
    pub title: Option<Title>,
    pub content: Option<Content>,
    pub excerpt: Option<Excerpt>,
    pub author: Option<i64>,
    pub featured_media: Option<i64>,
    pub comment_status: Option<String>,
    pub ping_status: Option<String>,
    pub sticky: Option<bool>,
    pub template: Option<String>,
    pub format: Option<String>,
    pub meta: Option<Vec<Value>>,
    pub categories: Option<Vec<i64>>,
    pub tags: Option<Vec<Value>>,
    pub yoast_head: Option<String>,
    pub yoast_head_json: Option<YoastHeadJson>,
    #[serde(rename = "_links")]
    pub links: Option<Links>,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct Guid {
    pub rendered: String,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct Title {
    pub rendered: String,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct Content {
    pub rendered: String,
    pub protected: bool,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct Excerpt {
    pub rendered: String,
    pub protected: bool,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct YoastHeadJson {
    pub title: Option<String>,
    pub robots: Option<Robots>,
    pub canonical: String,
    pub og_locale: Option<String>,
    pub og_type: Option<String>,
    pub og_title: Option<String>,
    pub og_description: Option<String>,
    pub og_url: Option<String>,
    pub og_site_name: Option<String>,
    pub article_published_time: Option<String>,
    pub article_modified_time: Option<String>,
    pub author: Option<String>,
    pub twitter_card: Option<String>,
    pub twitter_creator: Option<String>,
    pub twitter_site: Option<String>,
    pub twitter_misc: Option<TwitterMisc>,
    pub schema: Option<Schema>,
    pub og_image: Vec<OgImage>,
    pub description: Option<String>,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct Robots {
    pub index: String,
    pub follow: String,
    #[serde(rename = "max-snippet")]
    pub max_snippet: String,
    #[serde(rename = "max-image-preview")]
    pub max_image_preview: String,
    #[serde(rename = "max-video-preview")]
    pub max_video_preview: String,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct OgImage {
    pub width: i64,
    pub height: i64,
    pub url: String,
    #[serde(rename = "type")]
    pub type_field: String,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct TwitterMisc {
    #[serde(rename = "Written by")]
    pub written_by: String,
    #[serde(rename = "Est. reading time")]
    pub est_reading_time: String,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct Schema {
    #[serde(rename = "@context")]
    pub context: String,
    #[serde(rename = "@graph")]
    pub graph: Vec<Graph>,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct Graph {
    #[serde(rename = "@type")]
    pub type_field: Value,
    #[serde(rename = "@id")]
    pub id: String,
    pub url: Option<String>,
    pub name: Option<String>,
    pub description: Option<String>,
    pub publisher: Option<Publisher>,
    #[serde(rename = "potentialAction")]
    #[serde(default)]
    pub potential_action: Vec<PotentialAction>,
    #[serde(rename = "inLanguage")]
    pub in_language: Option<String>,
    #[serde(rename = "isPartOf")]
    pub is_part_of: Option<IsPartOf>,
    #[serde(rename = "datePublished")]
    pub date_published: Option<String>,
    #[serde(rename = "dateModified")]
    pub date_modified: Option<String>,
    pub breadcrumb: Option<Breadcrumb>,
    #[serde(rename = "itemListElement")]
    pub item_list_element: Option<Vec<ItemListElement>>,
    pub author: Option<Author>,
    pub headline: Option<String>,
    #[serde(rename = "mainEntityOfPage")]
    pub main_entity_of_page: Option<MainEntityOfPage>,
    #[serde(rename = "wordCount")]
    pub word_count: Option<i64>,
    #[serde(rename = "commentCount")]
    pub comment_count: Option<i64>,
    #[serde(rename = "articleSection")]
    #[serde(default)]
    pub article_section: Vec<String>,
    pub image: Option<Image>,
    pub logo: Option<Logo>,
    #[serde(rename = "sameAs")]
    pub same_as: Option<Vec<String>>,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct Publisher {
    #[serde(rename = "@id")]
    pub id: String,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct PotentialAction {
    #[serde(rename = "@type")]
    pub type_field: String,
    pub name: Option<String>,
    pub target: Value,
    #[serde(rename = "query-input")]
    pub query_input: Option<String>,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct IsPartOf {
    #[serde(rename = "@id")]
    pub id: String,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct Breadcrumb {
    #[serde(rename = "@id")]
    pub id: String,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct ItemListElement {
    #[serde(rename = "@type")]
    pub type_field: String,
    pub position: i64,
    pub name: String,
    pub item: Option<String>,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct Author {
    pub name: String,
    #[serde(rename = "@id")]
    pub id: String,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct MainEntityOfPage {
    #[serde(rename = "@id")]
    pub id: String,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct Image {
    #[serde(rename = "@type")]
    pub type_field: String,
    #[serde(rename = "inLanguage")]
    pub in_language: String,
    #[serde(rename = "@id")]
    pub id: String,
    pub url: String,
    #[serde(rename = "contentUrl")]
    pub content_url: String,
    pub width: i64,
    pub height: i64,
    pub caption: String,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct Logo {
    #[serde(rename = "@id")]
    pub id: String,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct Links {
    #[serde(rename = "self")]
    pub self_field: Vec<SelfField>,
    pub collection: Vec<Collection>,
    pub about: Vec<About>,
    pub author: Vec<Author2>,
    pub replies: Vec<Reply>,
    #[serde(rename = "version-history")]
    pub version_history: Vec<VersionHistory>,
    #[serde(rename = "predecessor-version")]
    pub predecessor_version: Vec<PredecessorVersion>,
    #[serde(rename = "wp:featuredmedia")]
    pub wp_featuredmedia: Vec<Featuredmedum>,
    #[serde(rename = "wp:attachment")]
    pub wp_attachment: Vec<WpAttachment>,
    #[serde(rename = "wp:term")]
    pub wp_term: Vec<WpTerm>,
    pub curies: Vec<Cury>,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct SelfField {
    pub href: String,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct Collection {
    pub href: String,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct About {
    pub href: String,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct Author2 {
    pub embeddable: bool,
    pub href: String,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct Reply {
    pub embeddable: bool,
    pub href: String,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct VersionHistory {
    pub count: i64,
    pub href: String,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct PredecessorVersion {
    pub id: i64,
    pub href: String,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct Featuredmedum {
    pub embeddable: bool,
    pub href: String,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct WpAttachment {
    pub href: String,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct WpTerm {
    pub taxonomy: String,
    pub embeddable: bool,
    pub href: String,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct Cury {
    pub name: String,
    pub href: String,
    pub templated: bool,
}
