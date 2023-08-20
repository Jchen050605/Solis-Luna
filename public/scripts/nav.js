let toggled = false
let nav = document.querySelector('nav')

document.querySelector(".navbar-toggler").addEventListener('click', () => {
    if (!toggled) {
        nav.classList.add("navActive")
    }
    else {
        if (nav.classList.contains("navActive")) {
            nav.classList.remove("navActive")
        }
    }
    
    toggled = !toggled;
})