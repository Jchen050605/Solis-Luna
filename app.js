const express = require( "express" );
const logger = require("morgan");
const db = require('./firebase');
const app = express();
const port = 3000;

app.set( "views",  __dirname + "/views");
app.set( "view engine", "ejs" );
 
// app.use(logger("dev"));

app.use(express.static(__dirname + '/public'));

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
            formattedNavBar.push({"name":getFormattedId(region),"expanded":false})
        }
        else {
            formattedNavBar.push({"name":getFormattedId(region),"expanded":true,regions:documentNames})
        }
    }

    return formattedNavBar
}

app.get( "/", async ( req, res ) => {
    res.render('index', {regions: await formatRegions()})
} );

app.get("/region/:region", async (req, res) => {
    
})

app.listen( port, () => {
    console.log(`App server listening on ${ port }. (Go to http://localhost:${ port })` );
} );