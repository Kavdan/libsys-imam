function getBooksForRent() {
    let booksList = "";
    window.sql.getBooks().then(books => {
        console.log(books);
        books.forEach((book, i) => {
            const date = new Date(book.publication_year);
            const query = document.querySelector('.student-info-book-search').value;
            if (query !== '' && (!book.title.toLowerCase().includes(query.toLowerCase()))) {
                return;
            }
            booksList += `<option value="${book.book_id}">${book.title}</option>`;
        })
        document.querySelector(".student-info-book-selection").innerHTML = booksList;
    });
}

const uid = function () {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

const getFormatDate = () => {
    const date = new Date();
    const day = date.getUTCDate();
    const month = date.getUTCMonth() + 1;
    const year = date.getUTCFullYear();

    return `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`
}


const getOutDate = (dateBefore, dateAfter) => {
    const dbefore = new Date(dateBefore);
    const dafter = new Date(dateAfter);
    const total = dafter - dbefore;

    if (total < 0) return 0;
    return total / 1000 / 60 / 60 / 24;
}

function getRentedBooks() {
    let rentedBooksList = "";

    window.sql.returnBookTitleAndStudentName(localStorage.getItem("studentId"), false)
        .then(data => {
            data.forEach(d => {
                rentedBooksList += ` <tr>
                                <td>${d.title}</td>
                                <td>до ${d.loan_date}</td>
                                <td> 
                                    <span class="student-info-return-btn"
                                    onclick="deleteRentedBook('${d.id}', 
                                            '${d.book_id}', 
                                            '${d.loan_date}'
                                            )">возврат</span>
                                </td>
                            </tr>`;
            });
            if(data.length == 0) {
                rentedBooksList = "Нет арендованных книг!"
            }
            document.querySelector(".student-info-rented-book-info").innerHTML = rentedBooksList;
        });

    let returnedBooks = '';
    window.sql.returnBookTitleAndStudentName(localStorage.getItem("studentId"), true)
        .then(data => {
            data.forEach(d => {
                returnedBooks += ` 
                <tr>
                    <td>${d.title}</td>
                    <td>${d.loan_date}</td>
                    <td>${d.returned_date}</td>
                    <td>${getOutDate(d.loan_date, d.returned_date)}</td>
                    <td>${getOutDate(d.loan_date, d.returned_date) * 10}</td>
                </tr>`;
            });
            document.querySelector(".student-info-returned-book-info").innerHTML = returnedBooks;
    })

    window.sql.getTotalFine(localStorage.getItem("studentId"))
    .then(data => {
        document.querySelector(".fine").innerHTML = data[0].amount || 0 + " руб";
    })

}

function deleteRentedBook(id, book_id, loan_date) {
    window.sql.setBookToReturned(id, getFormatDate())
        .then(() => {
            window.sql.incrementBook(book_id);
            const fine = getOutDate(loan_date, getFormatDate());
            if(fine > 0){
                window.sql.addFine({
                    book_id,
                    loan_id: id,
                    member_id: localStorage.getItem("studentId"),
                    fine_date: getFormatDate(),
                    fine_amount: fine*10
                })
            }
            getRentedBooks();
        });
}

getBooksForRent();
getRentedBooks();


document.querySelector(".student-info-book-btn").addEventListener('click', () => {
    const book_id = document.querySelector(".student-info-book-selection").value;
    const student_id = localStorage.getItem("studentId");
    const loan_date = document.querySelector(".student-info-book-rented-period").value;
    const reservation_date = getFormatDate();

    if (loan_date === "") {
        window.sql.alert("Укажите дату!");
        return;
    }

    window.sql.checkBookCount(book_id).then(count => {
        const iid = uid();
        if (count > 0) {
            window.sql.rentedBook({
                reservation_id: iid,
                book_id,
                student_id,
                reservation_date,
            }).then(res => {
                window.sql.loanBook({
                    loan_id: iid,
                    book_id,
                    student_id,
                    loan_date,
                }).then(() => {
                    getRentedBooks();
                })
                window.sql.decrementBook(book_id);
            }).catch(err => {
                console.log(err);
                window.sql.alert("Такая книга уже арендованна укз-ым школьником!");
            });
        }
        else window.sql.alert("Книги нет в наличии!");
    });
})

document.querySelector(".student-info-book-search-btn").addEventListener('click', () => {
    getBooksForRent();
})

document.querySelector(".payFine").addEventListener('click', () => {
    window.sql.payForFine(localStorage.getItem("studentId"), getFormatDate())
    .then(() => {
        window.sql.showInfo("Штраф оплачен!");
        getRentedBooks();
    })
});

