"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const music_quizzer_command_1 = require("./music-quizzer-command");
const discord_js_1 = require("discord.js");
const discord_js_commando_1 = require("discord.js-commando");
const config_json_1 = require("../config.json");
discord_js_1.Structures.extend('Guild', Guild => {
    class MusicGuild extends Guild {
        constructor() {
            super(...arguments);
            this.songs = [];
            this.currentSong = null;
            this.isPlaying = false;
            this.scores = [];
        }
    }
    return MusicGuild;
});
const client = new discord_js_commando_1.CommandoClient({
    commandPrefix: '!',
    owner: config_json_1.ownerID
});
client.registry
    .registerDefaultTypes()
    .registerGroup('music')
    .registerCommand(music_quizzer_command_1.MusicQuizzerCommand);
client.once('ready', () => {
    console.log('Ready!');
    client.user.setActivity('Waiting');
});
client.on('guildMemberAdd', member => {
    const channel = member.guild.channels.cache.find(ch => ch.name === 'general');
    if (!channel) {
        console.log('Could not find the general channel');
        return;
    }
    //  channel.send(`Welcome ${member}!`);
});
client.login(config_json_1.token);
//# sourceMappingURL=index.js.map