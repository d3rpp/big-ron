import { Colors, EmbedBuilder } from 'discord.js';
import { Article } from '../types/wordpress/Article';

const MAX_DESC = 2047;

function getEmbed(): EmbedBuilder {
  return new EmbedBuilder();
}

export function getPostEmbed(article: Article): EmbedBuilder {
  const getDesc = () => {
    let result = article.yoast_head_json.og_description;
    if (result.length > MAX_DESC) {
      const suffix = `... [View more here!](${article.yoast_head_json.canonical})`;
      const end = (MAX_DESC - 1) - suffix.length;
      const newDesc = result.substring(0, end);
      result = newDesc + suffix;
    }
    return result;
  };
  return getEmbed()
    .setTitle(article.yoast_head_json.og_title)
    .setDescription(getDesc())
    .setColor(Colors.Blue)
    .setURL(article.yoast_head_json.canonical)
    .setThumbnail(article.yoast_head_json.og_image[0]?.url || null)
    .setAuthor({
      name: article.yoast_head_json.author,
    })
    .setTimestamp(new Date(article.date_gmt));
}

export function getErrorEmbed(e: unknown): EmbedBuilder {
  const err = e instanceof Error ? e.message : `${e}`;
  const desc = `\`\`\`\n${err}\n\`\`\``;
  return getEmbed()
    .setColor(Colors.Red)
    .setTitle('An Error has Occurred')
    .setDescription(desc);
}
