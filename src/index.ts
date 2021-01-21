import { ShardingManager } from 'discord.js'
import { config } from 'dotenv'
import path from 'path'

config({ path: path.resolve(__dirname, '../.env') })

const manager = new ShardingManager(
    path.resolve(__dirname, 'bot.js'),
    { token: process.env.DISCORD_TOKEN }
)
manager.on('shardCreate', shard => console.log(`Launched shard ${shard.id}`))
manager.spawn()
