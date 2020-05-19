"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commands_1 = require("./commands");
const discord_js_1 = require("discord.js");
const discord_js_commando_1 = require("discord.js-commando");
const config_json_1 = require("../config.json");
discord_js_1.Structures.extend('Guild', Guild => {
    class MusicGuild extends Guild {
    }
    return MusicGuild;
});
const client = new discord_js_commando_1.CommandoClient({ commandPrefix: '!', owner: config_json_1.ownerID });
client.registry
    .registerDefaultTypes()
    .registerGroup('music')
    .registerCommand(commands_1.MusicQuizCommand)
    .registerCommand(commands_1.StopMusicQuizCommand);
client.once('ready', () => {
    console.log('Ready!');
    client.user.setActivity('Ready');
});
client.login(config_json_1.token);
//# sourceMappingURL=index.js.map