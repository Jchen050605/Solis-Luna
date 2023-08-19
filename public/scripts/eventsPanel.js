document.querySelectorAll(".edit").forEach((edit) => {
    edit.addEventListener('click', () => [
        window.location.href = "/events/edit/"+edit.dataset.eventid
    ])
})

document.querySelectorAll(".delete").forEach((edit) => {
    edit.addEventListener('click', () => [
        window.location.href = "/events/delete/"+edit.dataset.eventid
    ])
})