import SpotifyApi from 'spotify-web-api-node'
import config from '../config.json'


export default class Spotify {
    client = new SpotifyApi({
        clientId: config.spotify.clientID,
        clientSecret: config.spotify.clientSecret
    })

    async authorize() {
        const response = await this.client.clientCredentialsGrant()

        this.client.setAccessToken(response.body.access_token)

    }

    async getPlaylist(id: string) {
        const result = await this.client.getPlaylistTracks(id)

        return result.body.items.map(({ track }) => track)
    }
}
