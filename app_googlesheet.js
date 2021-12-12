
const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');

const yaml = require('js-yaml');
const moment = require('moment');

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const TOKEN_PATH = 'token.json';

var [obj, data] = [null, null];
let config = yaml.load(fs.readFileSync("./config.yml", 'utf8'));
let users = JSON.parse(fs.readFileSync("./data/users.json", 'utf8'));

const waitUntil = (condition) => {
    return new Promise((resolve) => {
        let interval = setInterval(() => {
            if (!condition()) return;
            clearInterval(interval)
            resolve()
        }, 100)
    })
}

async function googlesheet(...arg)
{
    fs.readFile(config.googlesheet.secret, (err, content) => { // e.g. ./client_secret_...apps.googleusercontent.com.json
        if (err) return console.log('Error loading client secret file:', err);
        // Authorize a client with credentials, then call the Google Sheets API.
        authorize(JSON.parse(content), main);
    });

    function authorize(credentials, callback) {
        const { client_secret, client_id, redirect_uris } = credentials.installed;
        const oAuth2Client = new google.auth.OAuth2(
            client_id, client_secret, redirect_uris[0]);

        // Check if we have previously stored a token.
        fs.readFile(TOKEN_PATH, (err, token) => {
            if (err) return getNewToken(oAuth2Client, callback);
            oAuth2Client.setCredentials(JSON.parse(token));
            callback(oAuth2Client);
        });
    }

    function getNewToken(oAuth2Client, callback) {
        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: SCOPES,
        });
        console.log('Authorize this app by visiting this url:', authUrl);
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        rl.question('Enter the code from that page here: ', (code) => {
            rl.close();
            oAuth2Client.getToken(code, (err, token) => {
                if (err) return console.error('Error while trying to retrieve access token', err);
                oAuth2Client.setCredentials(token);
                // Store the token to disk for later program executions
                fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                    if (err) return console.error(err);
                    console.log('Token stored to', TOKEN_PATH);
                });
                callback(oAuth2Client);
            });
        });
    }

    function main(auth) {
        const sheets = google.sheets({ version: 'v4', auth });

        if (arg[0].type == "get")
        {
            sheets.spreadsheets.values.get({
                spreadsheetId: config.googlesheet.spreadsheetId,
                // range: '卓決め（8卓） !A2:F10',
                range: config.googlesheet.range,
            }, (err, res) => {
                if (err) return console.log('The API returned an error: ' + err);
                const rows = res.data.values;
                data = res;
            });
        }

        if (arg[0].type == "update")
        {
            sheets.spreadsheets.values.update({
                spreadsheetId: config.googlesheet.spreadsheetId,
                // range: '卓決め（8卓） !A2:F10',
                range: config.googlesheet.range,
                valueInputOption: "USER_ENTERED",
                resource: {
                    // values: [
                    //     ["hoge", "hogehoge"],
                    //     ["fuga", "fugafuga"]
                    // ]
                    // values: data.data.values
                    values: arg[0].values
                }
            }, (err, res) => {
                if (err) {
                    // Handle error
                    console.log(err);
                } else {
                    console.log('%d cells updated.', res.updatedCells);
                    result = res;
                }
            });
        }

        console.log();
    }
    
}

(async function(){

    await googlesheet({type: `get`})

    await waitUntil(() => data !== null);
    await waitUntil(() => typeof users !== 'undefined');
    await waitUntil(() => typeof obj !== 'undefined');
    await waitUntil(() => typeof config !== 'undefined');
    await waitUntil(() => typeof yaml !== 'undefined');
    await waitUntil(() => typeof moment !== 'undefined');
    
    console.log();
    
    // join_col = data.data.values[0].indexOf("join?")
    // usernameId_col = data.data.values[0].indexOf("username_id")
    join_col = data.data.values[0].indexOf(config.googlesheet.join_col_name)
    usernameId_col = data.data.values[0].indexOf(config.googlesheet.usernameId_col_name)
    
    for (let i = 0; i < users.length; i++)
    {
        user = users[i]
        user_row = data.data.values.map(a => a[usernameId_col]).indexOf(user)
        if (user_row == -1) continue
        
        data.data.values[user_row][join_col] = config.googlesheet.join_symbol
    }
    
    // user = users[0]
    // data.data.values.map(a => a[5]).indexOf("fuga#2345")
    // data.data.values[2][1] = "✅"
    
    values = data.data.values

    result = null;
    
    await googlesheet({type: `update`, values: values})

    await waitUntil(() => result !== null);

    // console.log(result);
    console.log("finished.");

})();


