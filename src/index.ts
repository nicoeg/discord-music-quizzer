import { MusicQuizzerCommand } from './music-quizzer-command';
import { Score } from './types/score';
import { Song } from './types/song';
import { Structures } from 'discord.js';
import { CommandoClient } from 'discord.js-commando';
import { ownerID, token } from '../config.json'

Structures.extend('Guild', Guild => {
  class MusicGuild extends Guild {
    songs: Song[] = []
    currentSong: Song = null
    isPlaying = false
    scores: Score[] = []
  }

  return MusicGuild;
});

const client = new CommandoClient({
  commandPrefix: '!',
  owner: ownerID
});

client.registry
  .registerDefaultTypes()
  .registerGroup('music')
  .registerCommand(MusicQuizzerCommand)

client.once('ready', () => {
  console.log('Ready!');
  client.user.setActivity('Waiting');
});

client.on('guildMemberAdd', member => {
  const channel = member.guild.channels.cache.find(ch => ch.name === 'general')
  if (!channel) {
    console.log('Could not find the general channel');

    return
  }

//  channel.send(`Welcome ${member}!`);
});

client.login(token);
