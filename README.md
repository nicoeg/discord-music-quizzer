# Discord music quiz bot

Start music quizzes from your Spotify playlists.  
The bot will select random songs from the playlist and find them on Youtube to play.
Participants can the guess the songs and their authors by typing in chat.

Use this [link](https://discordapp.com/api/oauth2/authorize?client_id=708602255632367616&scope=bot&permissions=0) to add the bot to your discord channel.

Bot is inspired by https://github.com/galnir/Master-Bot.

### Commands

The bot can be started using the following command: `!music-quiz {playlist-link/id} {songs}`  

Example: `!music-quiz 37i9dQZEVXbMDoHDwVN2tF 10`

Songs can be skipped using `!skip`

To stop the quiz run `!stop-music-quiz`


### Running the bot yourself

Make sure you have created applications for the following:
* **Discord** https://discord.com/developers/applications
* **Spotify** https://developer.spotify.com/dashboard/applications
* **Youtube** https://developers.google.com/youtube/v3/getting-started

Once you have created the applications copy the `.env.example` to `.env` and fill out the values.

```shell
$ npm i
$ npm start
```
