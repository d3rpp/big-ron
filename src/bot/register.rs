/*
const commands: CommandDraft[] = [
  {
    handler: cmdConfig,
    builder: new SlashCommandBuilder()
      .setName('config')
      .setDescription('configure the bot.')
      .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
      .addRoleOption((opt) => opt
        .setName('role')
        .setDescription('The role to ping for new posts.')
        .setRequired(true))
      .addChannelOption((opt) => opt
        .setName('channel')
        .setDescription('The channel to send new posts to.')
        .addChannelTypes(ChannelType.GuildText, ChannelType.GuildNews)
        .setRequired(true))
      .addStringOption((opt) => opt
        .setName('website')
        .setDescription('The WordPress site to utilize.')
        .setRequired(true))
      .toJSON(),
  },
];
*/
