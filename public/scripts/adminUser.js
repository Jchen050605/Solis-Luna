document.querySelectorAll('.checkbox').forEach((checkbox) => {
    checkbox.addEventListener('click', () => {
        if (checkbox.classList.contains('on')) {
            checkbox.classList.add('off')
            checkbox.classList.remove('on')
        }
        else {
            checkbox.classList.add('on')
            checkbox.classList.remove('off')
        }
    })
})