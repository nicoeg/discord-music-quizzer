import axios from "axios"

export class Youtube {
    proxies = [
        'https://europe-west1-coronja.cloudfunctions.net/youtubewest1',
        'https://europe-west2-coronja.cloudfunctions.net/youtubewest2',
        'https://us-central1-coronja.cloudfunctions.net/youtubeusc1',
        'https://us-east1-coronja.cloudfunctions.net/youtubeuseast1',
        'https://us-east4-coronja.cloudfunctions.net/youtubeuseast4',
        'https://5sul8j4bba.execute-api.eu-west-1.amazonaws.com/default/youtube-seach-eu-west-1',
        'https://kmoyvpwbc9.execute-api.eu-central-1.amazonaws.com/default/youtube-seach-eu-central-1',
        'https://bbldn5w9q1.execute-api.eu-west-2.amazonaws.com/default/youtube-search-eu-west-2'
    ]
    currentProxy = 0
    fails = 0

    async findSong(query: string): Promise<string | null> {
        const proxy = this.proxies[this.currentProxy]
        try {
            const result = await axios(proxy, { params: { search: query } })
            this.fails = 0

            if (result.status === 404) {
                return null
            }

            return result.data.item.url
        } catch (error) {
            console.log(error);
            if (this.fails >= this.proxies.length) {
                throw new Error('Youtube fuck')
            }

            console.log('Using next proxy')
            this.currentProxy = this.currentProxy + 1 >= this.proxies.length ? 0 : this.currentProxy + 1
            this.fails++

            return this.findSong(query)
        }
    }
}
