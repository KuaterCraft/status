const express = require('express');
require('dotenv').config()
const path = require('path');
const app = express();
const session = require('express-session');
const bodyParser = require('body-parser');
const moment = require("moment");
const Chart = require("chartjs");
const Utils = Chart.Utils;
const key = process.env.TOKEN;
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
        './css/style.css',
        './css/bootstrap.min.css',
        './css/commands.css',
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
    try {
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

        const monitors = process.env.LIST.replace(/\[|\]/g, '').split(',').map(id => {
            const parsedId = parseInt(id.trim());
            if (isNaN(parsedId)) {
                console.error(`Invalid monitor ID: ${id.trim()}`);
            }
            return parsedId;
        }).filter(id => !isNaN(id));

        const fetchData = async (monitorId) => {
            try {
                const response = await fetch(`https://int-api.uptimerobot.com/internal/monitors/${monitorId}`, {
                    method: "GET",
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + key
                    }
                });
                const data = await response.json();
                return { monitorId, data };
            } catch (error) {
                console.error(error);
                return null;
            }
        }

        const fetchPromises = monitors.map(monitorId => fetchData(monitorId));
        const dataMonitor = await Promise.all(fetchPromises);
        

        res.render('index', { dataMonitor, data: response, css: res.cssUrl, formatDate, isSmallScreen });
    } catch (error) {
        console.error(error);
        // Handle errors appropriately
        res.status(500).send('Internal Server Error');
    }
});


app.post("/bootstrap-bundle-min-js", async (req, res) => {
    const authHeader = req.headers.authorization;

    // if (authHeader !== `Bearer ${key}`) {
    //     return res.status(401).json({ error: "Unauthorised" })
    // }
    const currentDate = Math.floor(Date.now() / 1000).toFixed(0);
    const lastDate = currentDate - 7 * 60 * 60;
    //https://int-api.uptimerobot.com/internal/monitors/796129534
    const data = await fetch(`https://int-api.uptimerobot.com/internal/monitors/795872626/response-times?start=${lastDate}&end=${currentDate}&timeFrame=CUSTOM`, {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": "Bearer " + key
        }
    });
    const response = await data.json();
    res.json(response)
});
app.post("/bootstrap-bundle-min-js-2", async (req, res) => {
    const authHeader = req.headers.authorization;
    // if (authHeader !== `Bearer ${key}`) {
    //     return res.status(401).json({ error: "Unauthorised" })
    // }
    const currentDate = Math.floor(Date.now() / 1000).toFixed(0);
    const lastDate = currentDate - 2 * 60 * 60;
    const data = await fetch(`https://int-api.uptimerobot.com/internal/monitors/795872626/response-times?start=${lastDate}&end=${currentDate}&timeFrame=CUSTOM`, {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": "Bearer " + key
        }
    });
    const response = await data.json();
    res.json(response)
});

app.get("/jquery-bundle-min-js", async (req, res) => {
    const currentDate = Math.floor(Date.now() / 1000).toFixed(0);
    const lastDate = currentDate - 24 * 60 * 60;
    const data = await fetch(`https://int-api.uptimerobot.com/internal/monitors/795872626/response-times?start=${lastDate}&end=${currentDate}&timeFrame=CUSTOM`, {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": "Bearer " + key
        }
    });
    const response = await data.json();
    const secondValues = response.responseTimes.map(entry => entry[1]);
    const averageValue = Math.floor(secondValues.reduce((sum, value) => sum + value, 0) / secondValues.length).toFixed(0);

    res.json({ value: "Avg. " + averageValue + "ms" })
});


app.use((req, res, next) => {
    res.status(404).render('404', { user: req.user, css: res.cssUrl });
});

app.listen(3000, () => {
    console.log("Online")
});