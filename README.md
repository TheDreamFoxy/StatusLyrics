# StatusLyrics
Show synced lyrics in your Discord status &amp; rich presence

# Installation &amp; usage
First make sure you have Node.JS with NPM installed. If not, you need to install it first.\
Go into your folder in your terminal or command line and type `npm i` to install needed dependencies.\
Go to `cfg.json` (config file) and enter your Discord account's token.\
Enter songs in `cfg.json` (Must be Spotify track IDs)\
Enter `node .` in command line or terminal and the program should run (Also you need to have Discord opened if you have richPresence set to true)\
For exit simply do CTRL+C in your terminal or command line.

# Features ++
You can set your own rich presence app (`client_id` in `cfg.json`) - if you don't know what is it, don't touch it.\
You can enable or disable `loop` in `cfg.json` by setting it to true or false - if disabled, the app will automatically exit when the end of the song queue reached, otherwise it will loop the queue infinitely.\
You can enable or disable custom Rich Presence by setting `richPresence` to true or false in `cfg.json`

# Disclaimer
Account automation (including automating status) is against Discord TOS. I'm not responsible for anything, use this at your own risk.\
You could get banned for this.
