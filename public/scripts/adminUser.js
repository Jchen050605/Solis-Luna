let fn = document.querySelector('.firstName')
let ln = document.querySelector('.lastName')
let e = document.querySelector('.email')
let rb = document.querySelector('.region-button')
let pb = document.querySelector('.position-button')
let f = document.querySelector('.inputfile')
let l = document.querySelector('.fileImage')

let error = document.querySelector(".error")

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

let regionTitle = document.querySelector('.region-button')

document.querySelectorAll(".r-subsection > li").forEach((option) => {

    option.addEventListener('click', () => {
        regionTitle.textContent = option.textContent;
    })
})

document.querySelectorAll(".region-options > li").forEach((option) => {
    if (option.children.length == 1) return;

    option.addEventListener('click', () => {
        regionTitle.textContent = option.textContent.split(" »")[0];
    })
})

let positionTitle = document.querySelector('.position-button')

document.querySelectorAll(".p-subsection > li").forEach((option) => {

    option.addEventListener('click', () => {
        positionTitle.textContent = option.textContent;
    })
})

document.querySelectorAll(".position-options > li").forEach((option) => {
    if (option.children.length == 1) return;

    option.addEventListener('click', () => {
        positionTitle.textContent = option.textContent.split(" »")[0];
    })
})

f.addEventListener('change', () => {
    let file = f.files[0];
    l.textContent = file.name+"; click to change";
})

function createError(message) {
    error.textContent = message;
    error.style.display = "block"
}

document.querySelector(".submit").addEventListener('click', () => {
    const currentUrl = window.location.href;

    let firstName = fn.value;
    let lastName = ln.value;
    let email = e.value;
    let region = rb.textContent;
    let position = pb.textContent;
    let file = f.files[0];

    if (firstName == "") {
        createError("Must select a valid first name")
        return
    }
    if (lastName == "") {
        createError("Must select a valid last name")
        return
    }
    if (email == "") {
        createError("Must select a valid email")
        return
    }
    if (region == "") {
        createError("Must select a valid region")
        return
    }
    if (position == "") {
        createError("Must select a valid position")
        return
    }

    const formData = new FormData();

    formData.append('firstName', firstName)
    formData.append('lastName', lastName)
    formData.append('email', email)
    formData.append('region', region)
    formData.append('position', position)
    formData.append('image', file)

    fetch(currentUrl, {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            console.log('Response data:', data);
            // window.location.href="users"
        })
        .catch(error => {
            console.error('Error:', error);
        });
})