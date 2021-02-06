export class Youtube {
    proxies = [
        'https://5sul8j4bba.execute-api.eu-west-1.amazonaws.com/default/youtube-seach-eu-west-1',
        'https://kmoyvpwbc9.execute-api.eu-central-1.amazonaws.com/default/youtube-seach-eu-central-1',
        'https://bbldn5w9q1.execute-api.eu-west-2.amazonaws.com/default/youtube-search-eu-west-2'
    ]
    currentProxy = 0
    fails = 0

    async findSong(query: string): Promise<string> {
        const proxy = this.proxies[this.currentProxy]
        try {
            const result = await fetch(`${proxy}?search=${query}`)
            const data = await result.json()
            this.fails = 0

            return data.item.url
        } catch (error) {
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
