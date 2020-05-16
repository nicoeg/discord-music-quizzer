"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MusicQuizzer = void 0;
const discord_js_commando_1 = require("discord.js-commando");
const config_json_1 = require("../config.json");
const ytdl_core_discord_1 = __importDefault(require("ytdl-core-discord"));
const simple_youtube_api_1 = __importDefault(require("simple-youtube-api"));
const spotify_1 = __importDefault(require("./spotify"));
class MusicQuizzer extends discord_js_commando_1.Command {
    constructor(client) {
        super(client, {
            name: 'music',
            memberName: 'music-quizzer',
            group: 'music',
            description: 'Music Quiz from Youtube songs',
            guildOnly: true,
            throttling: { usages: 1, duration: 10 },
            args: [
                {
                    key: 'playlist',
                    prompt: 'Which playlist to play songs from',
                    type: 'string',
                }
            ]
        });
        this.spotify = new spotify_1.default();
        this.youtube = new simple_youtube_api_1.default(config_json_1.youtubeApiKey);
        this.spotify.authorize();
    }
    run(message, args, fromPattern) {
        return __awaiter(this, void 0, void 0, function* () {
            const channel = message.member.voice.channel;
            const connection = yield channel.join();
            const link = yield this.getSongs(args.playlist);
            const musicStream = yield ytdl_core_discord_1.default(link);
            const dispatcher = connection.play(musicStream, { type: 'opus' })
                .on('start', () => {
                dispatcher.setVolume(2);
            });
            return message.say(`Playing: ${link}`);
        });
    }
    getSongs(playlist) {
        return __awaiter(this, void 0, void 0, function* () {
            const songs = yield this.spotify.getPlaylist(playlist);
            const song = `${songs[0].name} - ${songs[0].artists[0].name}`;
            const search = yield this.youtube.search(song, 3, { type: 'video', videoCategoryId: 10 });
            console.log(song, search[0].url, search);
            return search[0].url;
        });
    }
}
exports.MusicQuizzer = MusicQuizzer;
//# sourceMappingURL=music-quizzer.js.map