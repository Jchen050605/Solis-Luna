let input = document.querySelector(".inputThings input")
let options = document.querySelectorAll(".regionOptions li")
let optionsText = Array.from(options).map(option => option.textContent)
let optionElement = document.querySelector('.regionOptions')
let currentlyDisplaying = false

let regionBlob = document.querySelector('.regionBlob')
let directorTitle = document.querySelector(".director")
let emailTitle = document.querySelector(".email")
let regionTitle = document.querySelector(".regionBlob h1")

function populateOptions() {
    let amount = 0;
 
    for (let i = 0; i < options.length; i++) {
        let text = optionsText[i]
        let inputValue = input.value.toLowerCase()

        if (text.toLowerCase().includes(inputValue)) {
            let startIndex = text.toLowerCase().indexOf(inputValue)
            options[i].innerHTML = `${text.substring(0, startIndex)}<span>${text.substring(startIndex, startIndex+inputValue.length)}</span>${text.substring(startIndex+inputValue.length)}`
            options[i].style.display = "block"

            if (++amount == 5) {
                return;
            }
        }
        else options[i].style.display = "none"
    }
    
    if (amount == 0) {
        optionElement.style.display = 'none'
        currentlyDisplaying = false;
    }
}

input.addEventListener('input', (e) => {
    let value = input.value;

    if (value == "" && currentlyDisplaying) {
        optionElement.style.display = 'none'
        currentlyDisplaying = false;
        return
    }

    if (!currentlyDisplaying) {
        optionElement.style.display = 'block'
        currentlyDisplaying = true;
    }

    populateOptions()
})

options.forEach((option) => {
    option.addEventListener('click', () => {
        regionBlob.style.display = "block"
        directorTitle.textContent = option.dataset.director;
        emailTitle.textContent = option.dataset.email;
        optionElement.style.display = 'none';
        input.value = option.textContent;
        regionTitle.textContent = option.textContent;
    })
})
