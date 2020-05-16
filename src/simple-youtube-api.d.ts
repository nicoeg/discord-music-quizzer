declare module "simple-youtube-api" {
    export interface SearchOptions {
        type: string
        videoCategoryId: number
    }

    export class Video {
        type: string
        title: string
        url: string
    }

    export default class YouTube {
        constructor(key: string)

        search(query: string, limit?: number, options?: SearchOptions): Promise<Video[]>
    }
}
