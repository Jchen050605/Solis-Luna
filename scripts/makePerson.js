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

function createPerson(parentElm, name, pathToImage, bio, role=false) {
    let personDiv = document.createElement("div")
    personDiv.classList.add("person")
    personDiv.classList.add("reveal")

    let center = document.createElement("center")
    
    let profileImage = document.createElement("img")
    profileImage.src = pathToImage
    profileImage.classList.add("pfp")

    center.appendChild(profileImage)

    personDiv.appendChild(center)

    let nameH5 = document.createElement("h5")
    nameH5.textContent = name;
    nameH5.classList.add("text-center")

    personDiv.appendChild(nameH5)

    let roleH6 = document.createElement('h6')
    if (role!=false) {
        roleH6.textContent = role
        roleH6.classList.add("text-center")
        personDiv.appendChild(roleH6)
    }

    parentElm.appendChild(personDiv)
    personDiv.addEventListener("click", () => {setProfilePage(name, pathToImage)})

    bios.set(name, bio)
}