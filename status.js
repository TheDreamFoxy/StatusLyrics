const axios = require('axios');
const config = require('./cfg.json');

const headers = {
    "authorization": config.token,
    "accept": "*/*",
    "content-type": "application/json"
}

module.exports.set_status = async function changeStatus(statusText = null, emoji = null, time = null){
    let body = {};

    if(statusText) body["text"] = statusText;
    if(emoji) body["emoji_name"] = emoji;
    if(time) body["expires_at"] = time;

    if(!statusText && !emoji) body = null; // Remove status
 
    let res = await axios.patch("https://ptb.discord.com/api/v9/users/@me/settings", {"custom_status": body}, {headers: headers});
    console.log(`[STATUS] Set status: Status: ${statusText?.toString() || "None"} | Emoji: ${emoji?.toString() || "None"}`); // timestamp is never defined so it doesn't need to be logged
    return res;
};