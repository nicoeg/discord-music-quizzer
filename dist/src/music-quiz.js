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
exports.MusicQuiz = void 0;
const ytdl_core_discord_1 = __importDefault(require("ytdl-core-discord"));
const spotify_1 = __importDefault(require("./spotify"));
const simple_youtube_api_1 = __importDefault(require("simple-youtube-api"));
const config_json_1 = require("../config.json");
class MusicQuiz {
    constructor(message, args) {
        this.youtube = new simple_youtube_api_1.default(config_json_1.youtubeApiKey);
        this.currentSong = 0;
        this.message = message;
        this.arguments = args;
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            const channel = this.message.member.voice.channel;
            this.connection = yield channel.join();
            this.songs = yield this.getSongs(this.arguments.playlist, parseInt(this.arguments.songs, 10));
            console.log(this.songs);
            this.currentSong = 0;
            this.scores = {};
            this.startPlaying();
            //TODO: make sure to kill this when quiz is over
            const collector = this.message.channel
                .createMessageCollector(() => true)
                .on('collect', message => this.handleMessage(message));
        });
    }
    startPlaying() {
        return __awaiter(this, void 0, void 0, function* () {
            this.titleGuessed = false;
            this.artistGuessed = false;
            const song = this.songs[this.currentSong];
            const link = yield this.findSong(song);
            this.musicStream = yield ytdl_core_discord_1.default(link);
            const dispatcher = this.connection.play(this.musicStream, { type: 'opus' })
                .on('start', () => {
                dispatcher.setVolume(.5);
            })
                .on('exit', () => {
                this.musicStream.destroy();
            });
        });
    }
    handleMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            const song = this.songs[this.currentSong];
            console.log(song);
            let score = this.scores[message.author.id] || 0;
            let correct = false;
            if (message.content.toLowerCase() === song.title.toLowerCase()) {
                score = score + 2;
                this.titleGuessed = true;
                correct = true;
                message.react('☑');
            }
            if (message.content.toLowerCase() == song.artist.toLowerCase()) {
                score = score + 3;
                this.artistGuessed = true;
                correct = true;
                message.react('☑');
            }
            if (this.titleGuessed && this.artistGuessed) {
                message.say('Song an author guessed!');
                if (this.currentSong + 1 === this.songs.length) {
                    return this.finish;
                }
                this.currentSong++;
                this.musicStream.destroy();
                this.startPlaying();
            }
            if (!correct) {
                message.react('❌');
            }
        });
    }
    finish() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    getSongs(playlist, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            const spotify = new spotify_1.default();
            yield spotify.authorize();
            try {
                return (yield spotify.getPlaylist(playlist))
                    .sort(() => Math.random() > 0.5 ? 1 : -1)
                    .filter((song, index) => index <= amount)
                    .map(song => ({
                    title: this.stripSongName(song.name),
                    artist: (song.artists[0] || {}).name
                }));
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    findSong(song) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.youtube.search(`${song.title} - ${song.artist}`, 1, { type: 'video', videoCategoryId: 10 });
            return (_a = result[0]) === null || _a === void 0 ? void 0 : _a.url;
        });
    }
    /**
     * Will remove all excess from the song names
     * Examples:
     * death bed (coffee for your head) (feat. beabadoobee) -> death bed
     * @param name string
     */
    stripSongName(name) {
        return name.replace(/ \(.*\)/g, '');
    }
}
exports.MusicQuiz = MusicQuiz;
//# sourceMappingURL=music-quiz.js.map