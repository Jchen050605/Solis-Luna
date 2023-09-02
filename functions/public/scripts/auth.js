import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.2.0/firebase-app.js'
import { getAuth  } from 'https://www.gstatic.com/firebasejs/10.2.0/firebase-auth.js'

const firebaseConfig = {
    apiKey: "AIzaSyB4a2FAbr-4kppyum9jftjC-BO6zPqTe_g",
    authDomain: "solis-and-luna-arts.firebaseapp.com",
    projectId: "solis-and-luna-arts",
    storageBucket: "solis-and-luna-arts.appspot.com",
    messagingSenderId: "598578294836",
    appId: "1:598578294836:web:3c7542c7e35d75d3479a61",
    measurementId: "G-6ESZMF6ZHF"
};

initializeApp(firebaseConfig);

getAuth().onAuthStateChanged((user) => {
    if (user) {
        console.log('User is signed in:', user.uid);
    } else {
        window.location.href = "/admin/login"
    }
});


let x = document.querySelector(".signOut a")

console.log(x)

if (x) {
    x.addEventListener('click', async () => {
        await getAuth().signOut()
        window.location.href = "/admin/signout"
    })
}