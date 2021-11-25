require('dotenv').config();
const express = require('express');
const spotifyWebAPI=require('spotify-web-api-node');
const lyricsFinder = require('lyrics-finder');
const cors = require('cors');


const app = express();
app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.post('/refresh', (req, res) => {
    const refreshToken = req.body.refreshToken;
    const spotifyAPI = new spotifyWebAPI({

        redirectUri: process.env.REDIRECT_URI,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken
    })

    spotifyAPI.refreshAccessToken().then(data => {
        res.json({
            accessToken: data.body.accessToken,
            expiresIn: data.body.expiresIn
        })
        
        // console.log(data.body);
        // Save the access token so it can be used in future calls
        // spotifyAPI.setAccessToken(data.body['access_token']);
    }).catch((err) => {
        console.log(err)
        res.sendStatus(400)
    })
})


app.post('/login', function(req, res) {

    const code = req.body.code;

    const spotifyAPI = new spotifyWebAPI({
        
        // Add your Redirect URI, client ID, and secret. For some reason when using ENV the API couldn't read the values here.
        redirectUri: '',
        clientId:'',
        clientSecret:'',
    })

    spotifyAPI.authorizationCodeGrant(code).then(data => {
        res.json({
            accessToken: data.body.access_token,
            refreshToken: data.body.refresh_token,
            expiresIn: data.body.expires_in
        })
    }).catch((err) => {
        console.log(err);
        res.sendStatus(400)
    })
})

app.get('/lyrics', async (req, res) => {
    const lyrics = await lyricsFinder(req.query.artist, req.query.track) || 
    "No Lyrics Found"
    res.json({ lyrics })
})

//choose your port
app.listen();
