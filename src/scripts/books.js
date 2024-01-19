function getBooks () {
    let booksTable = "";
    window.sql.getBooks().then(books => {
        console.log(books);
        books.forEach((book, i) => {
            const date = new Date(book.publication_date);
            let query = '';
            if(document.querySelector('.book-search-input')) {
                query = document.querySelector('.book-search-input').value;
            }
            if(query !== '' && (!book.title.toLowerCase().includes(query) 
                                && !(book.first_name + book.last_name).toLowerCase().includes(query))){
                                    return;           
            }
            
            booksTable += `<tr class="book">
            <td class="book-number">${i+1}</td>
            <td>${book.title}</td>
            <td>${book.first_name + " " + book.last_name}</td>
            <td>${book.category_name}</td>
            <td class="book-published-year">${date.getFullYear()}</td>
            <td class="book-count">${book.copies_owned}</td>
            <td class="add-or-change-book"> 
                <span class="remove_book_handler" onclick="removeBook(event, '${book.book_id}')">удалить</span> 
                <span class="edit_book_handler" onclick="changeBook(event, '${book.book_id}')">изменить</span> 
            </td>
            </tr>`;
        })
        document.querySelector("#books-table-body").innerHTML = booksTable;
    });
}

getBooks();

function removeBook (event, id) {
    console.log(id);
    event.stopPropagation();
    window.sql.hasRented(id).then(d => {
        if(d[0].count !== 0) {
            window.sql.alert("Эта книга арендованна школьниками!");
        }else {
            window.sql.removeBook(id)
            .then(res => {
                console.log(res);
                getBooks();
            });
        }
    })
    .catch(a => {
        console.error(a);
    })
}


function addBook () {
    window.sql.goToAddBook();
}

function refreshPage () {
    location.reload();
}

function changeBook(event, id) {
    event.stopPropagation();
    localStorage.setItem("bookId", id);
    window.sql.goToChangeBook();
}



