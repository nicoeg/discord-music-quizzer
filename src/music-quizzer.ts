import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import { Message } from "discord.js";
import ytdl from 'ytdl-core';

interface Args {
    chart: string
}

export class MusicQuizzer extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: 'music-quizzer',
            memberName: 'music-quizzer',
            group: 'music',
            description: 'Music Quiz from Youtube songs',
            guildOnly: true,
            throttling: {usages: 1, duration: 10},
            args: [
                {
                    key: 'chart',
                    prompt: 'Which chart to play songs from',
                    type: 'string',
                    default: 'earth',
                }
            ]
        })
    }

    async run(message: CommandoMessage, args: object, fromPattern: boolean): Promise<Message | Message[]> {
        const channel = message.member.voice.channel
        const connection = await channel.join()
        const dispatcher = connection.play(
            ytdl('https://www.youtube.com/watch?v=LEoGQU_k78k', {
                quality: 'highestaudio',
                highWaterMark: 1024 * 1024 * 1024 // download part of the song to prevent stutter
            })
        ).on('start', () => {
            dispatcher.setVolume(50)
        })

        return message.say('yo')
    }
}
