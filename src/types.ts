import { MusicQuiz } from './music-quiz'

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
