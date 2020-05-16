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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MusicQuizzerCommand = void 0;
const music_quiz_1 = require("./music-quiz");
const discord_js_commando_1 = require("discord.js-commando");
class MusicQuizzerCommand extends discord_js_commando_1.Command {
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
                },
                {
                    key: 'songs',
                    prompt: 'How many songs the quiz should use',
                    type: 'string',
                    default: 10
                }
            ]
        });
    }
    run(message, args, fromPattern) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: Put on the guild
            const quiz = new music_quiz_1.MusicQuiz(message, args);
            quiz.start();
            return message.say(`Starting quiz`);
        });
    }
}
exports.MusicQuizzerCommand = MusicQuizzerCommand;
//# sourceMappingURL=music-quizzer-command.js.map