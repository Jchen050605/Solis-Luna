document.querySelectorAll(".edit").forEach((edit) => {
    edit.addEventListener('click', () => [
        window.location.href = "/blogs/edit/"+edit.dataset.blogid
    ])
})

document.querySelectorAll(".delete").forEach((edit) => {
    edit.addEventListener('click', () => [
        window.location.href = "/blogs/delete/"+edit.dataset.blogid
    ])
})