const express = require('express');
const path = require('path');
const app = express();
const session = require('express-session');
const bodyParser = require('body-parser');
const moment = require("moment");
const Chart = require("chartjs");
const Utils = Chart.Utils;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
    secret: '829291oZiMu50pKjN',
    resave: true,
    cookie: {
        maxAge: 60000 * 60 * 24
    },
    saveUninitialized: false,
    name: "discordAuth"
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
    res.cssUrl = [
        'https://css-h964-z1pz.onrender.com/css/style',
        'https://css-h964-z1pz.onrender.com/css/bootstrap',
        'https://css-h964-z1pz.onrender.com/css/cmd',
    ];
    next();
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use(express.static(path.join(__dirname)));
app.use('/img', express.static(path.join(__dirname, 'img')));

app.get('/', async (req, res) => {
    const data = await fetch("https://stats.uptimerobot.com/api/getMonitorList/4pl0qIcnIi?page=1&_=1705223288793", {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        }
    });
    const response = await data.json();
    function formatDate(label) {
        const currentDate = new Date();
        const targetDate = new Date(currentDate.getTime() - label * 24 * 60 * 60 * 1000);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return targetDate.toLocaleDateString('en-US', options);
    }
    const isSmallScreen = true;

    res.render('index', { data: response, user: req.user, css: res.cssUrl, formatDate: formatDate, isSmallScreen: isSmallScreen });
});

app.post("/bootstrap-bundle-min-js", async (req, res) => {
    const authHeader = req.headers.authorization;
    const key = "a9-u1816316-2eac1ced9069c16f7ef10fde";
    if (authHeader !== `Bearer ${key}`) {
        return res.status(401).json({ error: "Unauthorised" })
    }
    const currentDate = Math.floor(Date.now() / 1000).toFixed(0);
    const lastDate = currentDate - 7 * 60 * 60;
    const data = await fetch(`https://int-api.uptimerobot.com/internal/monitors/795872626/response-times?start=${lastDate}&end=${currentDate}&timeFrame=CUSTOM`, {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": "Bearer " + "a9-u1816316-2eac1ced9069c16f7ef10fde"
        }
    });
    const response = await data.json();
    res.json(response)
});

app.post("/bootstrap-bundle-min-js-2", async (req, res) => {
    const authHeader = req.headers.authorization;
    const key = "a9-u1816316-2eac1ced9069c16f7ef10fde";
    if (authHeader !== `Bearer ${key}`) {
        return res.status(401).json({ error: "Unauthorised" })
    }
    const currentDate = Math.floor(Date.now() / 1000).toFixed(0);
    const lastDate = currentDate - 2 * 60 * 60;
    const data = await fetch(`https://int-api.uptimerobot.com/internal/monitors/795872626/response-times?start=${lastDate}&end=${currentDate}&timeFrame=CUSTOM`, {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": "Bearer " + "a9-u1816316-2eac1ced9069c16f7ef10fde"
        }
    });
    const response = await data.json();
    res.json(response)
});


app.use((req, res, next) => {
    res.status(404).render('404', { user: req.user, css: res.cssUrl });
});

app.listen(3000, () => {
    console.log("Online")
});