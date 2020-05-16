import { Score } from './types/score'
import ytdl from 'ytdl-core-discord'
import { QuizArgs } from './types/quiz-args'
import { CommandoMessage } from 'discord.js-commando'
import Spotify from './spotify'
import YouTube from 'simple-youtube-api'
import { youtubeApiKey } from '../config.json'
import { Song } from 'song'
import { VoiceConnection } from 'discord.js'
import internal from 'stream'

export class MusicQuiz {
    youtube = new YouTube(youtubeApiKey)
    message: CommandoMessage
    arguments: QuizArgs
    songs: Song[]
    currentSong: number = 0
    connection: VoiceConnection
    scores: {[key: string]: number}
    artistGuessed: boolean
    titleGuessed: boolean
    musicStream: internal.Readable

    constructor(message: CommandoMessage, args: QuizArgs) {
        this.message = message
        this.arguments = args
    }

    async start() {
        const channel = this.message.member.voice.channel
        this.connection = await channel.join()

        this.songs = await this.getSongs(
            this.arguments.playlist,
            parseInt(this.arguments.songs, 10)
        )
        console.log(this.songs);
        this.currentSong = 0
        this.scores = {}
        this.startPlaying()

        //TODO: make sure to kill this when quiz is over
        const collector = this.message.channel
            .createMessageCollector(() => true)
            .on('collect', message => this.handleMessage(message))
    }

    async startPlaying() {
        this.titleGuessed = false
        this.artistGuessed = false
        const song = this.songs[this.currentSong]
        const link = await this.findSong(song)
        this.musicStream = await ytdl(link)
        const dispatcher = this.connection.play(this.musicStream, { type: 'opus' })
            .on('start', () => {
                dispatcher.setVolume(.5)
            })
            .on('exit', () => {
                this.musicStream.destroy()
            })
    }

    async handleMessage(message: CommandoMessage) {
        const song = this.songs[this.currentSong]
        console.log(song);
        let score = this.scores[message.author.id] || 0
        let correct = false

        if (message.content.toLowerCase() === song.title.toLowerCase()) {
            score = score + 2
            this.titleGuessed = true
            correct = true
            message.react('☑')
        }

        if (message.content.toLowerCase() == song.artist.toLowerCase()) {
            score = score + 3
            this.artistGuessed = true
            correct = true
            message.react('☑')
        }

        if (this.titleGuessed && this.artistGuessed) {
            message.say('Song an author guessed!')
            if (this.currentSong + 1 === this.songs.length) {
                return this.finish
            }

            this.currentSong++
            this.musicStream.destroy()
            this.startPlaying()
        }

        if (!correct) {
            message.react('❌')
        }
    }

    async finish() {

    }

    async getSongs(playlist: string, amount: number): Promise<Song[]> {
        const spotify = new Spotify()
        await spotify.authorize()

        try {
            return (await spotify.getPlaylist(playlist))
                .sort(() => Math.random() > 0.5 ? 1 : -1)
                .filter((song, index) => index <= amount)
                .map(song => ({
                    title: this.stripSongName(song.name),
                    artist: (song.artists[0] || {}).name
                }))
        } catch (error) {
            console.log(error);
        }
    }

    async findSong(song: Song): Promise<string> {
        const result = await this.youtube.search(
            `${song.title} - ${song.artist}`,
            1,
            { type: 'video', videoCategoryId: 10 }
        )

        return result[0]?.url
    }

    /**
     * Will remove all excess from the song names
     * Examples:
     * death bed (coffee for your head) (feat. beabadoobee) -> death bed
     * @param name string
     */
    stripSongName(name: string): string {
        return name.replace(/ \(.*\)/g, '')
    }
}
