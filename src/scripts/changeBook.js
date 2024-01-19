const getFormatDate = (stamp) => {
    const date = new Date(stamp);
    const day = date.getDay();
    const month = date.getMonth();
    const year = date.getFullYear();

    return `${year}-${month < 10 ? '0'+month : month}-${day < 10 ? '0'+day : day}`
}

const getFields = () => {
    return {
        author: document.querySelector(".author-input"),
        title: document.querySelector(".title-input"),
        count: document.querySelector(".book-count"),
        year: document.querySelector(".publication-year-input"),
        ganre: document.querySelector(".change-book-select-ganre")
    }   
}

window.sql.getBook(localStorage.getItem("bookId")).then(res => {
    console.log(res);
    const {author, title, count, year} = getFields();
    author.value = res[0].first_name + " " + res[0].last_name;
    title.value = res[0].title;
    count.value = res[0].copies_owned;
    year.value = getFormatDate(res[0].publication_date);

    window.sql.getGanres().then(data => {
        let ganres = "";
        const select = document.querySelector(".change-book-select-ganre");
        data.forEach((ganre, i) => {
            ganres += `<option value="${ganre.id}"
                ${res[0].id === ganre.id ? "selected" : ""}>${ganre.category_name}</option>`;
        })
        select.innerHTML = ganres;
    });
})

document.querySelector(".change-book-submit").addEventListener('click', e => {
    e.preventDefault();

    const {author, ganre, title, count, year} = getFields();

    if(author.value === '' 
       || title.value === '' 
       || count.value === '' 
       || year.value === '') {
        window.sql.alert("Поля не могу быть пустыми!");
        return;
    }

    if(author.value.split(" ").length !== 2) {
        window.sql.alert("У автора должно быть имя и фамилия!");
        return;
    }

    const first_name = author.value.split(" ")[0];
    const last_name = author.value.split(" ")[1];

    window.sql.changeBook({
        id: localStorage.getItem("bookId"),
        category_id: ganre.value,
        title: title.value,
        copies_owned: count.value,
        publication_date: year.value
    }).then(d => {
        window.sql.getAuthorId(localStorage.getItem("bookId"))
        .then((res) => {
            window.sql.changeAuthorNameAndSurname(first_name, last_name, res[0].author_id)
            .then(() => {
                window.sql.showInfo("Книга была успешно изменена!")
                window.sql.closeCurrentWindow();
            })
        })
    }).catch((err) => {
        window.sql.alert("Технические проблемы!");
    })

})

