import { MusicQuizCommand, StopMusicQuizCommand } from './commands'
import { Structures } from 'discord.js'
import { CommandoClient } from 'discord.js-commando'
import { config } from 'dotenv'
import { MusicQuiz } from './music-quiz'
import path from 'path'

config({ path: path.resolve(__dirname, '../.env') })

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PREFIX: string
      DISCORD_TOKEN: string
      YOUTUBE_API_KEY: string
      OWNER_ID: string
      SPOTIFY_CLIENT_ID: string
      SPOTIFY_CLIENT_SECRET: string
    }
  }
}

Structures.extend('Guild', Guild => {
  class MusicGuild extends Guild {
    quiz: MusicQuiz
  }

  return MusicGuild
})

const client = new CommandoClient({ commandPrefix: process.env.PREFIX, owner: process.env.OWNER_ID })

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
