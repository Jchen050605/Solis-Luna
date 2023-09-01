let regularPage = document.querySelector(".regular")
let profilePage = document.querySelector(".profile")
let goback = document.querySelector(".goback");
let navbars = document.querySelectorAll(".nav-link")
let navbarHeader = document.querySelector("#header")
let profileBioHead = document.querySelector(".information h1")
let profileBio = document.querySelector(".information h5")
let profileImage = document.querySelector(".bigProfileImage")

let bios = new Map();

function setProfilePage(name, pathToImage) {
    profilePage.style.display = "block"
    regularPage.style.display = "none"

    let formattedBio = bios.get(name).replace(/\n/g, "<br><br>");
    profileBio.innerHTML = formattedBio
    profileBioHead.textContent = name;

    profileImage.src = pathToImage

    navbars.forEach((navbar) => {
        navbar.classList.add("darkenedNavbar")
    })


    navbarHeader.setAttribute("style", "color: #4a4a4a !important;");
    window.location.hash = "#top"
}

function setRegularPage() {
    profilePage.style.display = "none"
    regularPage.style.display = "block"

    navbars.forEach((navbar) => {
        if (navbar.classList.contains("darkenedNavbar")) {
            navbar.classList.remove("darkenedNavbar")
        }
    })

    window.location.hash = "#team"

    navbarHeader.setAttribute("style", "color: white !important;");
}

goback.addEventListener("click", () => {
    setRegularPage()
})