let file = document.querySelector(".file")
let form = document.querySelector(".form")

document.querySelector('.modal-submit').addEventListener('click', () => {
    const XHR = new XMLHttpRequest();

    const dataPairs = [];

    const data = [["x","m"]]

    data.forEach((item) => {
        dataPairs.push(
            `${encodeURIComponent(item[0])}=${encodeURIComponent(item[1])}`,
        );
    })

    
    const urlEncodedData = dataPairs.join("&").replace(/%20/g, "+");
    
    XHR.addEventListener("load", (event) => {
        // window.location.href="/users"
    });

    XHR.addEventListener("error", (event) => {
        // alert("Oops! Something went wrong.");
    });

    XHR.open("POST", "/upload");

    XHR.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    let formData = new FormData()

    formData.append("b","c")

    const reader = new FileReader();
            
    reader.onload = (event) => {
        const imageData = event.target.result;
        const base64ImageData = imageData.split(',')[1]; // Remove data:image/<type>;base64,
        formData.append("file",base64ImageData)
        formData.append("name",file.files[0].name)

        const encodedData = new URLSearchParams(formData).toString();
        XHR.send(encodedData);
    };

    if (file.files[0]) {
        reader.readAsDataURL(file.files[0]);
    }
    else {
        XHR.send({});
    }

})