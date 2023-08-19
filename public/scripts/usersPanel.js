document.querySelectorAll(".edit").forEach((edit) => {
    edit.addEventListener('click', () => [
        window.location.href = "/users/edit/"+edit.dataset.uid
    ])
})

document.querySelectorAll(".delete").forEach((edit) => {
    edit.addEventListener('click', () => [
        window.location.href = "/users/delete/"+edit.dataset.uid
    ])
})