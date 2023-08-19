let fn = document.querySelector('.firstName')
let ln = document.querySelector('.lastName')
let e = document.querySelector('.email')
let rb = document.querySelector('.region-button')
let pb = document.querySelector('.position-button')
let b = document.querySelector('.bio')
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
    let firstName = fn.value;
    let lastName = ln.value;
    let email = e.value;
    let region = rb.textContent;
    let position = pb.textContent;
    let bio = b.value;

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

    const XHR = new XMLHttpRequest();

    const dataPairs = [];

    const data = [["firstName",firstName],["lastName",lastName],["email",email],
    ["region",region],["position",position],["bio",bio]]

    data.forEach((item) => {
        dataPairs.push(
            `${encodeURIComponent(item[0])}=${encodeURIComponent(item[1])}`,
        );
    })

    const urlEncodedData = dataPairs.join("&").replace(/%20/g, "+");
    
    XHR.addEventListener("load", (event) => {
        // window.location.href="/users/edit/a"
    });

    XHR.addEventListener("error", (event) => {
        // alert("Oops! Something went wrong.");
    });

    XHR.open("POST", window.location.href);

    XHR.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    XHR.send(urlEncodedData);

    XHR.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            window.location.href = "/users/edit/"+JSON.parse(this.responseText)["uid"];
        }
    };

})