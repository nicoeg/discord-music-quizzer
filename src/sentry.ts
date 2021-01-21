import * as Sentry from '@sentry/node'
import { RewriteFrames } from '@sentry/integrations'

export function setupSentry() {
    global.__rootdir__ = __dirname || process.cwd()

    if (process.env.SENTRY_DSN) {
        Sentry.init({
            dsn: process.env.SENTRY_DSN,
            integrations: [
                new RewriteFrames({
                    root: global.__rootdir__
                })
            ]
        })
    }
}
