const express = require("express");
const session = require('express-session');
const bodyParser = require('body-parser')

require('dotenv').config()

const db = require('./firebase');

const admin = require('firebase-admin');
const app = express();
const port = 3000;
const bucket = admin.storage().bucket();

app.use(bodyParser.urlencoded({ extended: false, limit: '10mb' }));
app.use(bodyParser.json());

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

app.use(express.static(__dirname + '/public'));

app.use(session({
    secret: process.env.secret,
    resave: false,
    saveUninitialized: true
}));

// await admin.auth().setPersistence(admin.auth.Auth.Persistence.SESSION)

async function getRegionsId() {
    let regionsDoc = db.collection("regions").doc("regions")

    let collections = await regionsDoc.listCollections()

    return collections.map(collection => collection.id);
}

function getFormattedId(id) {
    return id.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase()).replace(":",": ");
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

function getFormattedDate(date) {
    let eventDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    let suffix = getDaySuffix(date.getDate());

    eventDate.replace(/\d{1,2}$/, date.getDate() + suffix);

    return eventDate
}


async function formatEvents(region) {
    let eventIds = await region.collection('events').get()

    let events = []

    eventIds.docs.forEach((event) => {
        let data = event.data()
        let date = new Date(data.date._seconds * 1000)
        
        events.push({ name: data.name, date: getFormattedDate(date), description: data.description })
    })

    return events
}

function formatRegionName(region) {
    return region.toLowerCase().replace(/ /g, "-");
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

async function checkIfValidEmail(email) {
    let collection = await db.collection("users").get()   

    let documents = collection.docs.map(doc => doc.id)

    for (let i = 0; i < documents.length; i++) {
        let doc = await db.collection("users").doc(documents[i]).get()
        let data = doc.data()

        if (data.email == email) return true;
    }

    return false;
}

function firebaseAuthMiddleware(req, res, next) {
    const idToken = req.session.authToken;

    if (idToken == undefined) {
        res.redirect('/login')
        return;
    }

    admin.auth()
        .verifyIdToken(idToken)
        .then(decodedToken => {
            console.log(decodedToken)
            req.user = decodedToken.user;
            next();
        })
        .catch(error => {
            console.log(error)
            res.redirect('/login')
            return;
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

app.get("/admin/", firebaseAuthMiddleware, async (req, res) => {
    res.render('admin/index')
});

app.get("/admin/login", async (req, res) => {
    res.render("login")
})

app.post("/admin/login", async (req, res) => {
    if (req.body.type == "reset") {
        let link = await admin.auth().generatePasswordResetLink(req.body.email)
        res.json({"link":link})  
    }
    else {
        req.session.authToken = req.body.authToken;
        res.json({"status":"success"})  
    }
})

app.get("/admin/users", async (req, res) => {
    let collection = await db.collection("users").get()

    let documents = collection.docs.map(doc => doc.id)

    let users = []

    for (let i = 0; i < documents.length; i++) {
        let user = {}

        let doc = await db.collection("users").doc(documents[i]).get()
        let data = doc.data()

        user["name"] = data.firstName+" "+data.lastName;
        user["region"] = data.region
        user["email"] = data.email
        user["position"] = data.position
        user["uid"] = documents[i]
        user["time"] = getFormattedDate(data.created.toDate())

        users.push(user)
    }

    res.render('admin/usersPanel', {users:users})
});

app.get("/admin/users/add", async (req, res) => {
    res.render('admin/addUser')
});

app.get("/admin/users/edit/:uid", async (req, res) => {

    let document = await db.collection("users").doc(req.params.uid).get()

    let data = document.data()

    let dataJSON = {
        firstName:data.firstName,
        lastName:data.lastName,
        position:data.position,
        region:data.region,
        email:data.email,
        bio:data.bio,
        uid:req.params.uid
    }

    if (data.pfpURL) {
        dataJSON["pfpURL"]=await bucket.file("members/"+data.pfpURL).getSignedUrl({
            action: 'read',
            expires: '03-09-2500',
        });
    }
    else {
        dataJSON["pfpURL"]=await bucket.file("members/placeholder.png").getSignedUrl({
            action: 'read',
            expires: '03-09-2500',
        });
    }
    
    res.render('admin/editUser', {data:dataJSON})
});

app.post('/admin/users/edit/:uid', async (req, res) => {
    const imageBuffer = Buffer.from(req.body.file, 'base64')
    const imageByteArray = new Uint8Array(imageBuffer);
    const ending = req.body.name.split(".")[req.body.name.split(".").length-1]
    const url = req.params.uid+"."+ending

    let document = db.collection("users").doc(req.params.uid)

    document.update({pfpURL:url})

    const file = bucket.file(`members/`+url);

    const options = { resumable: false, metadata: { contentType: "image/"+ending } }

        return file.save(imageByteArray, options).then(a => {
            res.json({"status":"good"})
        })
        .catch(err => {
            console.log(`Unable to upload image ${err}`)
        })
});

app.post("/admin/users/add", async (req, res) => {
    let userRecord = await admin.auth().createUser({"email": req.body.email, "password": "securepassword"})

    let region = req.body.region;

    if (req.body.region.includes(":")) {
        region = region.split(": ")[0]+":"+region.split(": ")[1]
    }

    await db.collection("users").doc(userRecord.uid).set({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        region: region,
        position: req.body.position,
        bio: req.body.bio,
        created: admin.firestore.Timestamp.now()
    })

    await db.collection("regions").doc(formatRegionName(region)).collection("members").doc(userRecord.uid).set({
        name: req.body.firstName +" "+req.body.lastName,
        position: req.body.position,
    })
    
    res.json({uid:userRecord.uid})
});

app.get("/admin/regions", async (req, res) => {
    let collections = await db.collection("regions").get()

    let documents = collections.docs.map(doc => doc.id)

    let regions = []

    for (let i = 0; i < documents.length; i++) {
        let doc = await db.collection("regions").doc(documents[i]).get()
        let data = doc.data()

        let members = await db.collection("regions").doc(documents[i]).collection("members").get()
        let memberCount = members.docs.length

        let region = {}

        region["memberCount"] = memberCount
        region["name"] = getFormattedId(documents[i])

        regions.push(region)
    }

    res.render('admin/regionPanel', {regions:regions})
});

app.get("/admin/regions/add", async (req, res) => {
    res.render('admin/addRegion')
});

app.post("/admin/regions/add", async (req, res) => {
    console.log("T")

    let document = db.collection("regions").doc(formatRegionName(req.body.regionName))

    await document.set({})
    
    res.json({"status":"successful"})
});

app.get("/admin/users/delete/:uid", async (req, res) => {
    await admin.auth().deleteUser(req.params.uid)

    let document = await db.collection("users").doc(req.params.uid).get()
    let data = document.data()

    let region = data.region;

    await db.collection("users").doc(req.params.uid).delete()
    await db.collection("regions").doc(formatRegionName(region)).collection("members").doc(req.params.uid).delete()

    res.redirect('/users')
});

app.get("/admin/blogs", async (req, res) => {
    let collection = await db.collection("blogs").get()

    let documents = collection.docs.map(doc => doc.id)

    let blogs = []

    for (let i = 0; i < documents.length; i++) {
        let blog = {}

        let doc = await db.collection("blogs").doc(documents[i]).get()
        let data = doc.data()

        blog["title"] = data.title;
        blog["author"] = data.author
        blog["blogID"] = documents[i];
        blog["date"] = getFormattedDate(data.date.toDate())

        blogs.push(blog)
    }

    res.render('admin/blogPanel', {blogs:blogs})
});

app.get("/admin/blogs/add", async (req, res) => {
    res.render('admin/addBlog')
});

app.post("/admin/blogs/add", async (req, res) => {
    let doc = db.collection("blogs").doc()
    
    await doc.set({
        title: req.body.title,
        description: req.body.description,
        author: req.body.author,
        content: req.body.content,
        date: admin.firestore.Timestamp.now()
    })
    
    res.json({"blogID":doc.id})
});

app.get("/admin/blogs/edit/:blogID", async (req, res) => {
    let document = await db.collection('blogs').doc(req.params.blogID).get()

    let data = document.data()

    let dataJSON = {
        title:data.title,
        author:data.author,
        description:data.description,
        content:data.content,
        blogID:req.params.blogID
    }

    if (data.picture) {
        dataJSON["picture"]=await bucket.file("blogs/"+data.picture).getSignedUrl({
            action: 'read',
            expires: '03-09-2500',
        });
    }
    else {
        dataJSON["picture"]=await bucket.file("blogs/placeholder.png").getSignedUrl({
            action: 'read',
            expires: '03-09-2500',
        });
    }
    
    res.render('admin/editBlog', {data:dataJSON})
});

app.post('/admin/blogs/edit/:blogID', async (req, res) => {
    const imageBuffer = Buffer.from(req.body.file, 'base64')
    const imageByteArray = new Uint8Array(imageBuffer);
    const ending = req.body.name.split(".")[req.body.name.split(".").length-1]
    const url = req.params.blogID+"."+ending

    let document = db.collection("blogs").doc(req.params.blogID)

    document.update({picture:url})

    const file = bucket.file(`blogs/`+url);

    const options = { resumable: false, metadata: { contentType: "image/"+ending } }

        return file.save(imageByteArray, options).then(a => {
            res.json({"status":"good"})
        })
        .catch(err => {
            console.log(`Unable to upload image ${err}`)
        })
});

app.get("/admin/blogs/delete/:blogID", async (req, res) => {
    await admin.auth().deleteUser(req.params.blogID)

    await db.collection("blogs").doc(req.params.blogID).delete()

    res.redirect('/blogs')
});

app.get("/admin/events", async (req, res) => {
    let collection = await db.collection("events").get()

    let documents = collection.docs.map(doc => doc.id)

    let events = []

    for (let i = 0; i < documents.length; i++) {
        let event = {}

        let doc = await db.collection("events").doc(documents[i]).get()
        let data = doc.data()

        event["name"] = data.name;
        event["region"] = data.region
        event["eventID"] = documents[i]
        event["date"] = getFormattedDate(data.date.toDate())

        events.push(event)
    }

    res.render('admin/eventsPanel', {events:events})
});

app.get("/admin/events/add", async (req, res) => {
    res.render("admin/addEvent.ejs")
});

app.post("/admin/events/add", async (req, res) => {
    let region = req.body.region;

    if (req.body.region.includes(":")) {
        region = region.split(": ")[0]+":"+region.split(": ")[1]
    }

    let [month, day, year] = req.body.date.split('/');

    let document = db.collection("events").doc()
    
    await document.set({
        name: req.body.name,
        description: req.body.description,
        date: admin.firestore.Timestamp.fromDate(new Date(`${year}-${month}-${day}`)),
        region: region,
    })

    await db.collection("regions").doc(formatRegionName(region)).collection("events").doc(document.id).set({
        name: req.body.name,
        description: req.body.description,
        date: admin.firestore.Timestamp.fromDate(new Date(`${year}-${month}-${day}`)),
    })
    
    res.json({eventID:document.id})
})

app.get("/admin/events/edit/:eventID", async (req, res) => {
    let document = await db.collection("events").doc(req.params.eventID).get()

    let data = document.data()

    let dataJSON = {
        name:data.name,
        description:data.description,
        region:data.region,
        date:getFormattedDate(data.date.toDate()),
        eventID:req.params.eventID
    }

    if (data.picture) {
        dataJSON["picture"]=await bucket.file("events/"+data.picture).getSignedUrl({
            action: 'read',
            expires: '03-09-2500',
        });
    }
    else {
        dataJSON["picture"]=await bucket.file("blogs/placeholder.png").getSignedUrl({
            action: 'read',
            expires: '03-09-2500',
        });
    }
    
    res.render('admin/editEvent', {data:dataJSON})
});

app.post('/admin/events/edit/:eventID', async (req, res) => {
    const imageBuffer = Buffer.from(req.body.file, 'base64')
    const imageByteArray = new Uint8Array(imageBuffer);
    const ending = req.body.name.split(".")[req.body.name.split(".").length-1]
    const url = req.params.eventID+"."+ending

    let document = db.collection("events").doc(req.params.eventID)

    document.update({picture:url})

    const file = bucket.file(`events/`+url);

    const options = { resumable: false, metadata: { contentType: "image/"+ending } }

        return file.save(imageByteArray, options).then(a => {
            res.json({"status":"good"})
        })
        .catch(err => {
            console.log(`Unable to upload image ${err}`)
        })
});

app.get("/admin/events/delete/:eventID", async (req, res) => {
    let document = await db.collection("events").doc(req.params.eventID).get()
    let data = document.data()

    let region = data.region;

    await db.collection("events").doc(req.params.eventID).delete()
    await db.collection("regions").doc(formatRegionName(region)).collection("events").doc(req.params.eventID).delete()

    res.redirect('/events')
});

app.listen(port, () => {
    console.log(`App server listening on ${port}. (Go to http://localhost:${port})`);
});