const rpc = require("discord-rpc");
const axios = require('axios');
const { set_rpc } = require('./rpc.js');
const { set_status } = require('./status.js');
const config = require('./cfg.json');

const client = new rpc.Client({ transport: 'ipc' });
client.login({ clientId: config.client_id }).catch(console.error); // if rpc disabled still login to prevent quitting before status update

client.on('ready', () => {
    console.log("[RPC] Client ready")
    main();
});

let frameBefore = 0;
let i = 0;
let queuePos = 0;
let queue = config.songs
let superInterval;

function main(){
    set_status("Loading MRP", "⏳");

    mango(queuePos) //main.go reference?2???1
}

async function mango(qPos){
    let timeStamps = [];
    let lyrics = {};
    
    let lyricsMeta = await getLyrics(queue[qPos]);
    if(config.richPresence) set_rpc(client, lyricsMeta.name, lyricsMeta.artists.join(', '), lyricsMeta.cover_url, `https://open.spotify.com/track/${queue[qPos]}`, lyricsMeta.duration);

    lyricsMeta.lyrics.forEach(j => {
        timeStamps.push(parseInt(j.startTimeMs));
        lyrics[j.startTimeMs.toString()] = j.words;
    });

    superInterval = setInterval(() => {
        i++
        currentFrame = Math.round(i * 1000);
    
        let currentLyrics = getLyricsFromTs(currentFrame, frameBefore, lyrics, timeStamps);
        if(currentLyrics != null) set_status(currentLyrics.line, "🎵");
        if(currentLyrics != null && currentLyrics.arrayPos == lyricsMeta.lyrics.length - 1) qNext();
    
        frameBefore = currentFrame;
    }, 1000); // Check for lyrics every second to prevent rate limitation

    set_status(null, "🎶");
}

function qNext(){
    clearInterval(superInterval);
    frameBefore = 0;
    i = 0;
    queuePos++
    if(!queue[queuePos] && config.loop) { queuePos = 0; mango(queuePos)}
    else if(!queue[queuePos] && !config.loop) safely_exit("The end of queue was reached, quitting...", 0);
    else mango(queuePos);
}

async function getLyrics(trackID) {
    let response = await axios.get(`https://foxapi.foxnet.repl.co/lyrics/${trackID}`); // No vps be like
    return response.data;
}

function getLyricsFromTs(currentFrame, frameBefore, lyrics, timeStamps) {
    let found = timeStamps.find((el) => el <= currentFrame && el > frameBefore);
    let foundIndex = timeStamps.findIndex((el) => el <= currentFrame && el > frameBefore);

    if(typeof lyrics[found] == "string" || typeof lyrics[found] == "number"){
        found = found.toString();

        let result = {};
        result["line"] = lyrics[found];
        result["arrayPos"] = foundIndex;

        return result;
    };

    return null;
};

process.on('SIGINT', function() {
    console.log('Ok, quitting...');
    safely_exit(null, 0);
});

function safely_exit(message = null, exitCode = 0){
    if(superInterval) clearInterval(superInterval);
    set_status(null, null);

    setTimeout(() => {
        client.destroy();
        if(message) console.log(message);
        process.exit(exitCode);
    }, 1000);
}