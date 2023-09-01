document.addEventListener("scroll", () => {
    document.querySelectorAll(".reveal").forEach((e) => {
        if (window.innerHeight  > e.getBoundingClientRect().top)
            e.classList.add("active");
    });
})