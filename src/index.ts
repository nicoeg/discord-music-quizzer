import { MusicQuizCommand } from './commands'
import { Guild } from 'discord.js'
import { CommandoClient } from 'discord.js-commando'
import { config } from 'dotenv'
import { MusicQuiz } from './music-quiz'
import path from 'path'
import * as Sentry from '@sentry/node'
import { RewriteFrames } from '@sentry/integrations'

config({ path: path.resolve(__dirname, '../.env') })

global.__rootdir__ = __dirname || process.cwd()

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            PREFIX: string
            DISCORD_CLIENT_ID: string
            DISCORD_TOKEN: string
            DISCORD_OWNER_ID: string
            YOUTUBE_API_KEY: string
            SPOTIFY_CLIENT_ID: string
            SPOTIFY_CLIENT_SECRET: string
            SENTRY_DSN: string
        }
        interface Global {
            __rootdir__: string
        }
    }
}

declare module 'discord.js' {
    interface Guild {
        quiz: MusicQuiz
    }
}

if (process.env.SENTRY_DSN) {
    Sentry.init({
        dsn: process.env.SENTRY_DSN,
        integrations: [
            new RewriteFrames({
                root: global.__rootdir__
            })
        ]
    })
}

class MusicGuild extends Guild {
    quiz: MusicQuiz
}

/*Structures.extend('Guild', Guild => {
    class MusicGuild extends Guild {
        quiz: MusicQuiz
    }

    return MusicGuild
})*/

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
//client.on("debug", (e) => console.info('Discord debug', e))
client.on("disconnect", (e) => console.info('Discord disconnect event', e))
client.on("reconnecting", (e: any) => console.info('Discord reconnecting event', e))
client.on("resume", (e: any) => console.info('Discord resume event', e))

client.login(process.env.DISCORD_TOKEN)
