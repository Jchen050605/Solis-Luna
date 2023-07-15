const events = []
const eventsDiv = document.querySelector(".eventsHolder")
const loadMore = document.querySelector(".load-more")

loadMore.addEventListener("click", () => {addEvent(4)})

function createEvent(name, date, bio, pathToImage) {
    let div = document.createElement("div")
    div.classList.add("reveal")
    div.classList.add("event")

    let image = document.createElement("img")
    image.src = "./images/events/"+pathToImage.toLowerCase()
    image.classList.add("image")
    div.appendChild(image)

    let info = document.createElement("div")
    info.classList.add("info")

    let h2 = document.createElement("h2")
    h2.textContent = name;
    info.appendChild(h2)

    let h5 = document.createElement("h5")
    h5.textContent = date;
    info.appendChild(h5)

    let h6 = document.createElement("h6")
    h6.textContent = bio
    info.appendChild(h6)

    div.appendChild(info)
    events.push(div)
}

function loadStartingThreeEvents() {
    addEvent(3);
}

function addEvent(amount) {
    if (amount>=events.length) {
        amount=events.length
        loadMore.style.display = 'none'
    }

    for (let i = 0; i < amount; i++) {
        let event = events.pop()
        eventsDiv.appendChild(event);
        if (window.innerHeight  > event.getBoundingClientRect().top)
            event.classList.add("active");
    }
}