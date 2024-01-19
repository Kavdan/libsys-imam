document.querySelector(".add-book-form").addEventListener("submit", e => {
    e.preventDefault();
    const splitedName = document.querySelector(".author-input").value.split(" ");
    if(splitedName.length !== 2) {
        window.sql.alert("Некорректное имя автора! *Вы должны указать Фамилию и Имя");
        return;
    }
    window.sql.addBook({
        title: document.querySelector(".title-input").value,
        copies: document.querySelector(".book-count").value,
        date: document.querySelector(".publication-year-input").value,
        ganre: document.querySelector(".add-book-select-ganre").value
    }).then((book_id) => {
        window.sql.addAuthor({
            firstName: splitedName[0],
            lastName: splitedName[1],
        }).then((author_id) => {
            window.sql.associateBookWithAuthor(book_id, author_id)
            .then((message) => {
                window.sql.showInfo(message);
            })
        })
    })
})

window.sql.getGanres().then(data => {
    let ganres = "";
    const select = document.querySelector(".add-book-select-ganre");
    data.forEach(ganre => {
        ganres += `<option value="${ganre.id}">${ganre.category_name}</option>`;
    })
    select.innerHTML = ganres;
});