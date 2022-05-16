import SpotifyApi from 'spotify-web-api-node'

export default class Spotify {
    client = new SpotifyApi({
        clientId: process.env.SPOTIFY_CLIENT_ID,
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET
    })

    async authorize() {
        const response = await this.client.clientCredentialsGrant()

        this.client.setAccessToken(response.body.access_token)

    }

    async getPlaylist(id: string) {
        let finished = false
        let offset = 0
        const tracks = []

        while (finished) {
            const result = await this.client.getPlaylistTracks(id, { offset, limit: 100 })
            tracks = tracks.concat(result.body.items.map(({ track }) => track))

            offset += 100
            finished = tracks.length >= result.total
        }

        console.log('tracks ' + tracks.length);
        return tracks
    }
}
