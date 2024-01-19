const { getConnection, uid } = require("./db");

const INSERT_AUTHOR_QUERY = `
INSERT INTO author (id, first_name, last_name) 
  VALUES (?, ?, ?);
`;
const ASSOCIATE_BOOK_WITH_AUTHOR_QUERY = `
    INSERT INTO book_author (book_id, author_id) 
    VALUES (?, ?)
`;
const GET_AUTHOR_ID_BY_BOOK_ID = `
SELECT author_id FROM book_author 
WHERE book_id = ?;
`;
const UPDATE_AUTHOR_NAME_SURNAME = `
UPDATE author SET 
first_name = ?,
last_name = ?
WHERE id = ?;
`;

const addAuthor = async (author) => {
    const con = await getConnection();
    return new Promise((resolve, reject) => {
        const author_id = uid();
        con.run(INSERT_AUTHOR_QUERY,
            [author_id, author.firstName, author.lastName],
            (err) => {
                if (err) {
                    con.run("ROLLBACK");
                    reject(err);
                } else resolve(author_id);
            })
    })
}



const associateAuthorWithBook = async (book_id, author_id) => {
    const con = await getConnection();
    return new Promise((resolve, reject) => {
        con.run(ASSOCIATE_BOOK_WITH_AUTHOR_QUERY,
            [book_id, author_id],
            (err) => {
                if (err) {
                    con.run("ROLLBACK");
                    reject(err);
                } else resolve("Book have been added!");
            })
    })
}

const getAuthorId = async (id) => {
    const con = await getConnection();
    return new Promise((resolve, reject) => {
        con.all(GET_AUTHOR_ID_BY_BOOK_ID, [id], (err, rows) => {
            if (err) reject(err);
            resolve(rows);
        })
    })
}

const changeAuthorNameAndSurname = async (first_name, last_name, author_id) => {
    const con = await getConnection();
    return new Promise((resolve, reject) => {
        con.run(UPDATE_AUTHOR_NAME_SURNAME,
            [first_name, last_name, author_id],
            (err) => {
                if (err) {
                    con.run("ROLLBACK");
                    reject(err);
                } else resolve("Author has been changed!");
            })
    })
}


module.exports = {
    addAuthor,
    associateAuthorWithBook,
    getAuthorId,
    changeAuthorNameAndSurname
}