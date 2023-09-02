let parentName = document.querySelector('.parentRegion')
let regionName = document.querySelector('.name')

document.querySelector(".submit").addEventListener('click', () => {
    let pName = parentName.value;
    let n = regionName.value;

    if (n == "") {
        return
    }

    if (pName != "") {
        n = pName +":" + n
    }

    const XHR = new XMLHttpRequest();

    const dataPairs = [];

    dataPairs.push(
        `${encodeURIComponent("regionName")}=${encodeURIComponent(n)}`,
    );

    const urlEncodedData = dataPairs.join("&").replace(/%20/g, "+");

    XHR.open("POST", window.location.href);

    XHR.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    XHR.send(urlEncodedData);

    XHR.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            window.location.href = "/admin/regions";
        }
    };

})