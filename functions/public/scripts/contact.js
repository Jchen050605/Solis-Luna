document.querySelectorAll(".images img").forEach((image) => {
    image.addEventListener('click', () => {
        window.location.href = image.dataset.social
    })
})