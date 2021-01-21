import { MusicQuizCommand } from './commands'
import { Structures } from 'discord.js'
import { CommandoClient } from 'discord.js-commando'
import { config } from 'dotenv'
import { MusicQuiz } from './music-quiz'
import path from 'path'

config({ path: path.resolve(__dirname, '../.env') })

Structures.extend('Guild', Guild => {
    class MusicGuild extends Guild {
        quiz: MusicQuiz
    }

    return MusicGuild
})

const client = new CommandoClient({
    commandPrefix: process.env.PREFIX,
    owner: process.env.DISCORD_OWNER_ID
})

client.registry
.registerDefaultTypes()
.registerGroup('music')
.registerCommand(MusicQuizCommand)

client.once('ready', () => {
    console.log('Ready!')
    client.user.setActivity('Ready to quiz')
})
client.on("error", (e) => console.error('Discord error', e))
client.on("warn", (e) => console.warn('Discord warn', e))
client.on("disconnect", (e) => console.info('Discord disconnect event', e))

client.login(process.env.DISCORD_TOKEN)
