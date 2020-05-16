import { MusicQuiz } from './music-quiz';
import { QuizArgs } from './types/quiz-args';
import { Command, CommandoClient, CommandoMessage } from "discord.js-commando"
import { Message } from "discord.js"

export class MusicQuizzerCommand extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: 'music',
            memberName: 'music-quizzer',
            group: 'music',
            description: 'Music Quiz from Youtube songs',
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
                    prompt: 'How many songs the quiz should use',
                    type: 'string',
                    default: 10
                }
            ]
        })
    }

    async run(message: CommandoMessage, args: QuizArgs, fromPattern: boolean): Promise<Message | Message[]> {
        // TODO: Put on the guild
        const quiz = new MusicQuiz(message, args)

        quiz.start()

        return message.say(`Starting quiz`)
    }
}
