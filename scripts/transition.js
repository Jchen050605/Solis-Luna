window.transitionToPage = function (href) {
    document.querySelector('body').style.opacity = 0
    setTimeout(function () {
        window.location.href = href
    }, 500)
}

document.addEventListener('DOMContentLoaded', function (event) {
    if (window.location.href.includes("index")) {
        setTimeout(function () {
            document.querySelector('body').style.opacity = 1
        }, 500)
    }
    else {
        document.querySelector('body').style.opacity = 1
    }
    
})

document.querySelectorAll("a").forEach((elm) => {
    elm.addEventListener("click", (e) => {
        e.preventDefault();
        if (elm.href.charAt(elm.href.length - 1) == "#") return;
        transitionToPage(elm.href)
    })
})