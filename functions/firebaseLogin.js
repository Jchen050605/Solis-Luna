const {initializeApp, cert} = require('firebase-admin/app')
const {getFirestore} = require('firebase-admin/firestore')

initializeApp({
    credential: cert(require("./creds.json")),
    storageBucket: "gs://solis-and-luna-arts.appspot.com"
})

const db = getFirestore();

module.exports = db;