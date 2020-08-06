import axios from 'axios'
import cheerio from 'cheerio'
import YoutubeScraper from 'scrape-youtube'

export class Youtube {
    proxyIndex = 0
    proxies: string[] = []

    async getProxies() {
        try {
            const response = await axios("https://sslproxies.org/")
            const $ = cheerio.load(response.data)

            this.proxies = $('#proxylisttable tr')
                .toArray()
                .filter((element, index) => index > 0)
                .map(element => {
                    const ip = element.childNodes
                        .filter((_, index) => index <= 1)
                        .map(e => $(e).text())
                        .join(':')

                    return 'https://' + ip
                })
                .filter(ip => ip !== 'https://:')
        } catch(e) {
            this.proxies = []
        }
    }

    async findSong(query: string, proxy?: string|undefined, tries: number = 0): Promise<string> {
        try {
            this.getProxies()
            proxy = this.proxies[this.proxyIndex]
            console.log(proxy);
            // @ts-ignore
            const result = await YoutubeScraper.searchOne(query, { baseUrl: '', proxy })
            console.log(result?.link);

            return result?.link ?? null
        } catch (error) {
            if (tries > 3) {
                throw error
            }

            this.proxyIndex = proxy ? this.proxyIndex + 1 : this.proxyIndex

            return await this.findSong(query, this.proxies[this.proxyIndex], tries + 1)
        }
    }
}
