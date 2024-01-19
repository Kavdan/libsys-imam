const { getConnection } = require("./db");

const TOP_BOOKS_BY_GRADE = `
SELECT
    book.id,
	book.title,
	author.first_name, author.last_name,
    COUNT(reservation.book_id) AS borrow_count
FROM reservation
JOIN member ON reservation.member_id = member.id
JOIN book ON reservation.book_id = book.id
JOIN book_author ON book.id = book_author.book_id
JOIN author ON book_author.author_id = author.id
WHERE member.grade = ?
GROUP BY book.id, book.title
ORDER BY borrow_count DESC
LIMIT 7;
`;

const AVAILABLE_BOOKS_COUNT = `
SELECT count(*) FROM book WHERE status = 1 AND copies_owned > 0
`;
const BOOKS_IN_RESERVATION = `SELECT count(*) from reservation WHERE reservation_status_id = 1`;
const MOST_POPULAR_GANRE = `
SELECT category.category_name,
       count(*) as r from reservation 
JOIN book ON reservation.book_id = book.id
JOIN category ON book.category_id = category.id
GROUP BY category.category_name
ORDER BY r DESC
LIMIT 1
`;
const MEMBERS_COUNT = `SELECT count(*) from member`;
const ALL_BOOKS_HAVE_BEEN_RESERVED = `SELECT count(*) from reservation`;
const ISSUED_BOOKS = `SELECT count(*) FROM loan WHERE loan.loan_date < CURRENT_DATE AND loan.returned_date is null;`;
const ACTIVE_FINES_COUNT = `SELECT count(*) from fine;`;
const PAID_FINES_COUNT = `SELECT count(*) from fine_payment;`;

const getTopBooksByGrade = async (grade) => {
    const con = await getConnection();
    return new Promise((resolve, reject) => {
        con.all(TOP_BOOKS_BY_GRADE, [grade], (err, rows) => {
            if (err) reject(err);
            resolve(rows);
        })
    })
}


module.exports = {
    getTopBooksByGrade
}
