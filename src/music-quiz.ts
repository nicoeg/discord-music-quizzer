import { MessageCollector, VoiceChannel } from 'discord.js';
import ytdl from 'ytdl-core-discord'
import { QuizArgs } from './types/quiz-args'
import { CommandoMessage } from 'discord.js-commando'
import Spotify from './spotify'
import YouTube from 'simple-youtube-api'
import Youtube from 'scrape-youtube'
import { Song } from 'song'
import { VoiceConnection } from 'discord.js'
import internal from 'stream'

export class MusicQuiz {
    message: CommandoMessage
    voiceChannel: VoiceChannel
    messageCollector: MessageCollector
    arguments: QuizArgs
    songs: Song[]
    currentSong: number = 0
    connection: VoiceConnection
    scores: {[key: string]: number}
    artistGuessed: boolean
    titleGuessed: boolean
    musicStream: internal.Readable
    songTimeout: NodeJS.Timeout

    constructor(message: CommandoMessage, args: QuizArgs) {
        this.message = message
        this.arguments = args
    }

    async start() {
        this.voiceChannel = this.message.member.voice.channel
        this.songs = await this.getSongs(
            this.arguments.playlist,
            parseInt(this.arguments.songs, 10)
        )

        if (!this.songs) {
            this.finish()

            return
        }

        this.connection = await this.voiceChannel.join()
        this.currentSong = 0
        this.scores = {}
        this.startPlaying()

        this.messageCollector = this.message.channel
            .createMessageCollector((message: CommandoMessage) => !message.author.bot)
            .on('collect', message => this.handleMessage(message))
    }

    async startPlaying() {
        this.titleGuessed = false
        this.artistGuessed = false
        const song = this.songs[this.currentSong]
        if (!song) {
            this.nextSong('Could not find the song on Youtube. Skipping to next.')

            return
        }

        const link = await this.findSong(song)
        this.musicStream = await ytdl(link)
        this.songTimeout = setTimeout(() => {
            this.nextSong('Song was not guessed in time')
        }, 1000 * 60);

        this.connection
            .play(this.musicStream, { type: 'opus', volume: .5 })
            .on('finish', () => this.finish())
    }

    async handleMessage(message: CommandoMessage) {
        if (message.content === "!stop-music-quiz") {
            return
        }

        if (message.content === "!skip") {
            return this.nextSong('Song skipped!')
        }

        const song = this.songs[this.currentSong]
        let score = this.scores[message.author.id] || 0
        let correct = false

        if (!this.titleGuessed && message.content.toLowerCase().includes(song.title.toLowerCase())) {
            score = score + 2
            this.titleGuessed = true
            correct = true
            message.react('☑')
        }

        if (!this.artistGuessed && message.content.toLowerCase().includes(song.artist.toLowerCase())) {
            score = score + 3
            this.artistGuessed = true
            correct = true
            message.react('☑')
        }
        this.scores[message.author.id] = score

        if (this.titleGuessed && this.artistGuessed) {
            this.nextSong('Song guessed!')
        }

        if (!correct) {
            message.react('❌')
        }
    }

    async finish() {
        if (this.songTimeout) clearTimeout(this.songTimeout)
        if (this.messageCollector) this.messageCollector.stop()
        if (this.musicStream) this.musicStream.destroy()

        // @ts-ignore
        if (this.message.guild.quiz) this.message.guild.quiz = null
        this.voiceChannel.leave()
    }

    nextSong(status: string) {
        if (this.songTimeout) clearTimeout(this.songTimeout)
        const song = this.songs[this.currentSong]
        status = `**(${this.currentSong + 1}/${this.songs.length})** ${status} \n`
        status += `${song.title} by ${song.artist} \n`
        status += `${song.link} \n`
        status += `**Scores**\n${this.getScores(this.message)}`
        this.message.channel.send(status)

        if (this.currentSong + 1 === this.songs.length) {
            return this.finish()
        }

        this.currentSong++
        if (this.musicStream) this.musicStream.destroy()
        this.startPlaying()
    }

    getScores(message: CommandoMessage): string {
        return message.member.voice.channel.members
            .filter(member => member.user.username !== "Musiq Quizzer")
            .sort((first, second) => (this.scores[first.id] || 0) < (this.scores[second.id] || 0) ? 1 : -1)
            .map(member => `**${this.scores[member.id] || 0}** ${member.nickname || member.displayName}`)
            .join('\n')
    }

    async getSongs(playlist: string, amount: number): Promise<Song[]> {
        const spotify = new Spotify()
        await spotify.authorize()
        if (playlist.includes('spotify.com/playlist')) {
            playlist = playlist.match(/playlist\/([^?]+)/)[1] || playlist
        }

        try {
            return (await spotify.getPlaylist(playlist))
                .sort(() => Math.random() > 0.5 ? 1 : -1)
                .filter((song, index) => index < amount)
                .map(song => ({
                    link: `https://open.spotify.com/track/${song.id}`,
                    previewUrl: song.preview_url,
                    title: this.stripSongName(song.name),
                    artist: (song.artists[0] || {}).name
                }))
        } catch (error) {
            this.message.channel.send('Could not retrieve the playlist. Make sure it\'s public')

            return null
        }
    }

    async findSong(song: Song): Promise<string> {
        try {
            const result = await Youtube.searchOne(`${song.title} - ${song.artist}`)

            return result?.link
        } catch (e) {
            await this.message.channel.send('Oh no... Youtube police busted the party :(')
            this.finish()

            throw e
        }
    }

    /**
     * Will remove all excess from the song names
     * Examples:
     * death bed (coffee for your head) (feat. beabadoobee) -> death bed
     * Dragostea Din Tei - DJ Ross Radio Remix -> Dragostea Din Tei
     *
     * @param name string
     */
    stripSongName(name: string): string {
        return name.replace(/ \(.*\)/g, '')
            .replace(/ - .*$/, '')
    }
}
