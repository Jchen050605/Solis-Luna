const express = require("express");
const session = require('express-session');
require('dotenv').config()


const db = require('./firebase');
const admin = require('firebase-admin');
const app = express();
const port = 3000;

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

app.use(express.static(__dirname + '/public'));
app.use( express.urlencoded({ extended: false }) );
app.use( express.json() );

app.use(session({
    secret: process.env.secret,
    resave: false,
    saveUninitialized: true
}));

async function getRegionsId() {
    let regionsDoc = db.collection("regions").doc("regions")

    let collections = await regionsDoc.listCollections()

    return collections.map(collection => collection.id);
}

function getFormattedId(id) {
    return id.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
}

async function formatRegions() {
    let regions = await getRegionsId()

    let formattedNavBar = []

    for (let i = 0; i < regions.length; i++) {
        let region = regions[i];

        let documents = await db.collection("regions").doc("regions").collection(region).get()
        let documentNames = documents.docs.map(document => getFormattedId(document.id));
        if (documentNames.length == 1) {
            formattedNavBar.push({ name: getFormattedId(region), expanded: false, id: region })
        }
        else {
            formattedNavBar.push({ name: getFormattedId(region), expanded: true, regions: documentNames, id: region })
        }
    }

    return formattedNavBar
}

function getDaySuffix(day) {
    if (day >= 11 && day <= 13) return 'th';
    switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
    }
}

async function formatEvents(region) {
    let eventIds = await region.collection('events').get()

    let events = []

    eventIds.docs.forEach((event) => {
        let data = event.data()
        let date = new Date(data.date._seconds * 1000)
        let eventDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        let suffix = getDaySuffix(date.getDate());

        eventDate.replace(/\d{1,2}$/, date.getDate() + suffix);

        events.push({ name: data.name, date: eventDate, description: data.description })
    })

    return events
}

async function formatPersons(region) {
    let personIds = await region.collection('team').get()

    let persons = []

    personIds.docs.forEach((person) => {
        let data = person.data()

        persons.push({ name: data.name, bio: data.bio, role: data.role })
    })

    return persons
}

function firebaseAuthMiddleware(req, res, next) {
    // Assuming the Firebase ID token is stored in the session
    const idToken = req.session.authToken;

    if (!idToken) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    admin.auth()
        .verifyIdToken(idToken)
        .then(decodedToken => {
            // Store decodedToken.user in session or request context, if needed
            req.user = decodedToken.user;
            next();
        })
        .catch(error => {
            return res.status(401).json({ message: 'Unauthorized' });
        });
}

app.get('*', function (req, res, next) {
    if (req.headers.host.split('.')[0] == 'admin')
        req.url = '/admin' + req.url;
    next();
});

app.post('*', function (req, res, next) {
    if (req.headers.host.split('.')[0] == 'admin')
        req.url = '/admin' + req.url;
    next();
});

app.get("/", async (req, res) => {
    res.render('index', { regions: await formatRegions() })
});

app.get("/about", async (req, res) => {
    res.render('mission', { regions: await formatRegions() })
});

app.get("/blog", async (req, res) => {
    res.render('blogs', { regions: await formatRegions() })
});

app.get("/blog/:id", async (req, res) => {
    res.render('blog', { regions: await formatRegions() })
});

app.get("/volunteer", async (req, res) => {
    res.render('volunteer', { regions: await formatRegions() })
});

app.get("/contact", async (req, res) => {
    res.render('contact', { regions: await formatRegions() })
});

app.get("/region/:region", async (req, res) => {
    let region = req.params.region

    let regionList = await getRegionsId()

    if (!regionList.includes(region)) {
        res.redirect("/")
    }
    else {
        let regionDB = await db.collection("regions").doc("regions").collection(region).get()
        let documentID = regionDB.docs.map(document => document.id)[0];
        regionDB = await db.collection("regions").doc("regions").collection(region).doc(documentID)
        res.render('region', { regions: await formatRegions(), events: await formatEvents(regionDB), persons: await formatPersons(regionDB), name: getFormattedId(region) })
    }
})

app.get("/admin/", async (req, res) => {
    res.render('admin/index')
});

app.get("/admin/users", async (req, res) => {
    res.render('admin/usersPanel')
});

app.get("/admin/users/add", async (req, res) => {
    res.render('admin/addUser')
});

app.post("/admin/users/add", async (req, res) => {
    const requestData = req.body;
    console.log('Received data:', requestData);
    
    const responseData = { message: 'Data received successfully' };
    res.json(responseData);
});

app.get("/admin/users/edit", async (req, res) => {
    res.render('admin/usersPanel')
});

app.listen(port, () => {
    console.log(`App server listening on ${port}. (Go to http://localhost:${port})`);
});