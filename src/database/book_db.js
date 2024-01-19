const { getConnection, uid } = require("./db");

const GET_BOOKS_QUERY = `
  SELECT * FROM book 
  LEFT JOIN book_author on book.id = book_author.book_id
  LEFT JOIN author on book_author.author_id = author.id
  LEFT JOIN category on book.category_id = category.id
  where book.status = 1
`;

const DELETE_BOOK_QUERY = async (id) => [
    `DELETE FROM book_author WHERE book_id = '${id}'`,
    `UPDATE book SET status = 0 WHERE id = '${id}'`
];


const GET_ALL_GANRES_QUERY = `SELECT * FROM category`;
const INSERT_BOOK_QUERY = `
  INSERT INTO book (id, title, category_id, publication_date, copies_owned) 
  VALUES (?, ?, ?, ?, ?);
`;
const DECREMENT_BOOK_COPIES_QUERY = `
  UPDATE book SET copies_owned = copies_owned - 1 WHERE id = ? AND copies_owned > 0
`;
const INCREMENT_BOOK_COPIES_QUERY = `
  UPDATE book SET copies_owned = copies_owned + 1 WHERE id = ? AND copies_owned > 0
`;
const CHECK_BOOK_COUNT = `select * from book where id = ?`;
const GET_BOOK_TITLE_BY_ID = `
    SELECT * FROM book 
    WHERE book.id = ?
`;

const CHANGE_BOOK = `UPDATE book SET 
title = ?,
category_id = ?,
publication_date = ?,
copies_owned = ?
WHERE book.id = ?;`;

const GET_BOOK_BY_ID = `SELECT * FROM book 
LEFT JOIN book_author on book.id = book_author.book_id
LEFT JOIN author on book_author.author_id = author.id
LEFT JOIN category on book.category_id = category.id
where book.status = 1 and book.id = ?`;

const getBooks = async () => {
    const con = await getConnection();
    return new Promise((resolve, reject) => {
        con.all(GET_BOOKS_QUERY, [], (err, rows) => {
            if (err) reject(err);
            resolve(rows);
        });
    });
}

const addBook = async (book) => {
    const con = await getConnection();
    return new Promise((resolve, reject) => {
        const book_id = uid();
        con.run(INSERT_BOOK_QUERY,
            [
                book_id,
                book.title,
                book.ganre,
                book.date,
                book.copies,
            ],
            (err) => {
                if (err) {
                    con.run("ROLLBACK");
                    reject(err);
                } else resolve(book_id);
            }
        );
    })
}

const removeBook = async (id) => {
    const con = await getConnection();
    const queries = await DELETE_BOOK_QUERY(id);
    queries.forEach(async query => {
        await new Promise((resolve, reject) => {
            con.run(query, [], (err) => {
                if (err) {
                    reject(err);
                }
                resolve("book had been deleted!");
            })
        })
    })
}

const getGanres = async () => {
    const con = await getConnection();
    return new Promise((resolve, reject) => {
        con.all(GET_ALL_GANRES_QUERY,
            [],
            (err, rows) => {
                if (err) reject(err);
                resolve(rows);
            });
    })
}

const checkBookCount = async (id) => {
    const con = await getConnection();
    console.log(id);
    return new Promise((resolve, reject) => {
        con.all(CHECK_BOOK_COUNT,
            [id],
            (err, rows) => {
                if (err) {
                    reject(err)
                }
                resolve(rows[0].copies_owned);
            })
    })
}

const decrementBook = async (id) => {
    const con = await getConnection();
    return new Promise((resolve, reject) => {
        con.run(DECREMENT_BOOK_COPIES_QUERY,
            [id],
            (err) => {
                if (err) reject(err);
                resolve();
            })
    })
}

const incrementBook = async (id) => {
    const con = await getConnection();
    return new Promise((resolve, reject) => {
        con.run(INCREMENT_BOOK_COPIES_QUERY,
            [id],
            (err) => {
                if (err) reject(err);
                resolve("Book was successfully incremented!");
            })
    })
}

const getBook = async (id) => {
    const con = await getConnection();
    return new Promise((resolve, reject) => {
      con.all(GET_BOOK_BY_ID, [id], (err, rows) => {
        if (err) reject(err);
        resolve(rows);
      });
    });
  }
  
  const changeBook = async (book) => {
    const con = await getConnection();
    return new Promise((resolve, reject) => {
      con.run(CHANGE_BOOK,
        [book.title,
        book.category_id,
        book.publication_date,
        book.copies_owned,
        book.id],
        (err) => {
          if (err) reject(err)
          resolve("Book had been changed successfully!");
        });
    })
  }
  
  const getBookTitleById = async (id) => {
    const con = await getConnection();
    return new Promise((resolve, reject) => {
      con.all(GET_BOOK_TITLE_BY_ID, 
        [id],
        (err, rows) => {
          if(err) reject(err);
          resolve(rows)
        })
    })
  }

module.exports = {
    getBooks,
    getBook,
    addBook,
    removeBook,
    getGanres,
    checkBookCount,
    decrementBook,
    incrementBook,
    changeBook,
    getBookTitleById,
}