let input = document.querySelector(".inputThings input")
let options = Array.from(document.querySelectorAll(".regionOptions li"))
let newElement = document.querySelector(".newOne")
let extraSpace = document.querySelector(".extraSpace")

options.splice(options.indexOf(newElement),1)
newElement.style.display = "block"
let optionsText = options.map(option => option.textContent)
let optionElement = document.querySelector('.regionOptions')
let currentlyDisplaying = false

let regionBlob = document.querySelector('.regionBlob')
let directorTitle = document.querySelector(".director")
let emailTitle = document.querySelector(".email")
let regionTitle = document.querySelector(".regionBlob h1")

let regionDirectorDiv = document.querySelector(".rd")

function populateOptions() {
    let amount = 0;
 
    for (let i = 0; i < options.length; i++) {
        if (amount >= 5) {
            options[i].style.display = "none"
        }
        else {
            let text = optionsText[i]
            let inputValue = input.value.toLowerCase()

            if (text.toLowerCase().includes(inputValue)) {
                let startIndex = text.toLowerCase().indexOf(inputValue)
                options[i].innerHTML = `${text.substring(0, startIndex)}<span>${text.substring(startIndex, startIndex+inputValue.length)}</span>${text.substring(startIndex+inputValue.length)}`            
                options[i].style.display = "block"
                amount+=1
            }
            else options[i].style.display = "none"
        }
    }
}

input.addEventListener('focus', () => {
    optionElement.style.display = 'block'
    populateOptions()
})

input.addEventListener('input', populateOptions)

options.forEach((option) => {
    option.addEventListener('click', () => {
        optionElement.style.display = 'none';
        extraSpace.style.padding = '0';
        regionDirectorDiv.style.display = 'none'
        regionBlob.style.display = "block"
        directorTitle.textContent = option.dataset.director;
        emailTitle.textContent = option.dataset.email;
        input.value = option.textContent;
        regionTitle.textContent = option.textContent;
    })
})

newElement.addEventListener('click', () => {
    extraSpace.style.padding = '0';
    regionDirectorDiv.style.display = 'block';
    regionBlob.style.display = "none";
    input.value = "Become a Region Director!";
    optionElement.style.display = 'none';
})
