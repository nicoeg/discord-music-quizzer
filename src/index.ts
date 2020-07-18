import { MusicQuizCommand, StopMusicQuizCommand } from './commands'
import { Structures } from 'discord.js'
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
  .registerCommand(StopMusicQuizCommand)

client.once('ready', () => {
  console.log('Ready!')
  client.user.setActivity('Ready to quiz')
})

client.login(process.env.DISCORD_TOKEN)
