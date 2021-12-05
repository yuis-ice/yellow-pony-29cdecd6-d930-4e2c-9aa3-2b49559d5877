
const fs = require('fs');
const yaml = require('js-yaml');
const moment = require('moment');
// const sortBy = require('lodash.sortby');

const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

let [obj, data] = [null, null]; 
let [deadline] = [null];
let users = [];
let config = yaml.load(fs.readFileSync("./config.yml", 'utf8'));

client.on('ready', () => {
    console.log(moment().format(), `bot logged in: ${client.user.tag}`);
});

client.on("message", (message) => {
    // console.log(message);
    
    obj = {
        username: message.author.username,
        discriminator: message.author.discriminator,
        username_id: `${message.author.username}#${message.author.discriminator}`,
        user_id: message.author.id,
        message_id: message.id,
        channel_id: message.channelId,
        content: message.content,
    }

    console.log(moment().format(), `message: ${obj.content}`);
    
    if (message.author.bot == false && message.author.system == false )
    if (message.content.match(/参加希望|ノシ/) )
    // if (message.channelId.match(/535633294646050827|.../) ) // e.g.
    {
        users = users.concat(obj);
        console.log(moment().format(), `a user has been added: ${obj.username_id}`);
        console.log(moment().format(), `users: ${users.map(a => a.username_id).toString()}`);
    }
    
});


setTimeout(
    async function () {
        console.log(moment().format(), `deadline: ${deadline/1000} seconds elapsed`);
        // console.log(moment().format(), `closing connection... `);
        // client.logout();
        console.log(moment().format(), `users: ${users.map(a => a.username_id).toString()}`);
        
        console.log(moment().format(), `exporting to file...`);
        if (config.app.export.format == "newline")
            data = users.map(a => a.username_id).join("\n");

        if (config.app.export.format == "json")
            data = JSON.stringify(users.map(a => a.username_id));

        fs.writeFileSync(config.app.export.path, data);
        console.log(moment().format(), `exported.`);

        // todo 
        add_to_googlesheet();
    },
    deadline = (function(){
        if (config.app.deadline.absolute && config.app.deadline.relative)
            console.log(moment().format(), `warn: the config config.app.deadline.absolute and config.app.deadline.relative both cannot be used. the app uses config.app.deadline.absolute instead.`);
            
        if (config.app.deadline.absolute)
            return moment(config.app.deadline.absolute, config.app.deadline.absolute_format).unix() - moment().unix();
        if (config.app.deadline.relative)
            return moment.duration(config.app.deadline.relative).asSeconds();
    })() * 1000
);

client.login(config.discord.token);

// todo 
async function add_to_googlesheet(){
    console.log("...");
    // ..
    process.exit();
}

// console.log("y.");