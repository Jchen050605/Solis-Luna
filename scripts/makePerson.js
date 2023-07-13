function createPerson(parentElm, name, pathToImage, bio, role=false) {
    let personDiv = document.createElement("div")
    personDiv.classList.add("person")

    let center = document.createElement("center")
    
    let profileImage = document.createElement("img")
    profileImage.src = pathToImage

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
}