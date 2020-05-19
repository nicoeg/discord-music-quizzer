import { MusicQuizCommand, StopMusicQuizCommand } from './commands';
import { Structures } from 'discord.js';
import { CommandoClient } from 'discord.js-commando';
import { ownerID, token } from '../config.json'
import { MusicQuiz } from './music-quiz';

Structures.extend('Guild', Guild => {
  class MusicGuild extends Guild {
    quiz: MusicQuiz
  }

  return MusicGuild;
});

const client = new CommandoClient({ commandPrefix: '!', owner: ownerID });

client.registry
  .registerDefaultTypes()
  .registerGroup('music')
  .registerCommand(MusicQuizCommand)
  .registerCommand(StopMusicQuizCommand)

client.once('ready', () => {
  console.log('Ready!');
  client.user.setActivity('Ready');
});

client.login(token);
