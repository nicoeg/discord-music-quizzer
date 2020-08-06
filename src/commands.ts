import { MusicQuiz } from './music-quiz';
import { QuizArgs } from './types/quiz-args';
import { Command, CommandoClient, CommandoMessage } from "discord.js-commando"
import { Message } from "discord.js"

export class MusicQuizCommand extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: 'music-quiz',
            memberName: 'music-quizzer',
            group: 'music',
            description: 'Music Quiz from Spotify playlists',
            guildOnly: true,
            throttling: {usages: 1, duration: 10},
            args: [
                {
                    key: 'playlist',
                    prompt: 'Which playlist to play songs from',
                    type: 'string',
                },
                {
                    key: 'songs',
                    prompt: 'How many songs the quiz will contain',
                    type: 'string',
                    default: 10
                },
                {
                    key: 'onlyThis',
                    prompt: 'Only this answer is required; artist, title or both',
                    type: 'string',
                    default: 'both'
                }
            ]
        })
    }

    async run(message: CommandoMessage, args: QuizArgs, fromPattern: boolean): Promise<Message | Message[]> {
        if (message.guild.quiz) {
            return message.say('Quiz is already running')
        }

        if (message.member.voice.channel === null) {
            return message.say('Please join a voice channel and try again')
        }

        message.guild.quiz = new MusicQuiz(message, args)
        message.guild.quiz.start()
    }
}
