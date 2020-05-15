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
const discord_js_commando_1 = require("discord.js-commando");
const ytdl_core_1 = __importDefault(require("ytdl-core"));
class MusicQuizzer extends discord_js_commando_1.Command {
    constructor(client) {
        super(client, {
            name: 'music-quizzer',
            memberName: 'music-quizzer',
            group: 'music',
            description: 'Music Quiz from Youtube songs',
            guildOnly: true,
            throttling: { usages: 1, duration: 10 },
            args: [
                {
                    key: 'chart',
                    prompt: 'Which chart to play songs from',
                    type: 'string',
                    default: 'earth',
                }
            ]
        });
    }
    run(message, args, fromPattern) {
        return __awaiter(this, void 0, void 0, function* () {
            const channel = message.member.voice.channel;
            const connection = yield channel.join();
            const dispatcher = connection.play(ytdl_core_1.default('https://www.youtube.com/watch?v=LEoGQU_k78k', {
                quality: 'highestaudio',
                highWaterMark: 1024 * 1024 * 1024 // download part of the song to prevent stutter
            })).on('start', () => {
                dispatcher.setVolume(50);
            });
            return message.say('yo');
        });
    }
}
exports.MusicQuizzer = MusicQuizzer;
//# sourceMappingURL=music-quizzer.js.map