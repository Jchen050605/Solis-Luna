let h6Element = document.querySelector('.text')
let info = document.querySelector('.information')
let text = h6Element.textContent;
let lines = text.split('\n\n');

h6Element.remove()

lines.forEach((line) => {
    let h6 = document.createElement('h6')
    h6.textContent = line;
    info.appendChild(h6)
})
