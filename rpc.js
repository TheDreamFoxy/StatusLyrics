module.exports.set_rpc = function set_rpc(client, songName, artistName, cover_url, song_url, duration) {
    let date = Date.now();

    client.request('SET_ACTIVITY', {
        pid: process.pid,
        activity: {
            details: songName,
            state: artistName,
            timestamps: {
                start: date,
                end: date + duration
            },
            assets: {
                large_image: cover_url,
                large_text: "Now playing",
                small_image: "note",
                small_text: "Music Presence v0.5.0",
            },
            buttons: [
                {
                    label: "Get synced lyrics for yourself",
                    url: "https://github.com/TheDreamFoxy/StatusLyrics"
                },
                {
                    label: "Open current song in Spotify",
                    url: song_url
                }
            ]
        }
    });

    console.log(`[RPC] Set activity: ${songName}, ${artistName}, ${cover_url?.split('/')?.pop()}, ${song_url?.split('/')?.pop()}, ${duration}`);
};