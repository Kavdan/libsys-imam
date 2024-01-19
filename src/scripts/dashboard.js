localStorage.setItem("active-menu-item", 1);
let a = document.querySelectorAll(".menu-item");
$(".content").load("../views/books.html");

a.forEach((item, i) => {
    if(localStorage.getItem("active-menu-item") === "1" && i+1 === 1) {
        item.classList.add("active");
    }
    
    item.addEventListener('click', (e) => {
        a.forEach(i => {
            i.classList.remove("active");
        });
        e.target.classList.add("active");
        localStorage.setItem("active-menu-item", i+1);
    })
});

document.querySelector(".students-menu-item").addEventListener('click', () => {
    $('.content').load("../views/students.html");
});

document.querySelector(".books-menu-item").addEventListener('click', () => {
    $('.content').load("../views/books.html");
    getBooks();
});

document.querySelector(".statistic-menu-item").addEventListener('click', () => {
    $('.content').load("../views/analytics.html");
});