const { getConnection, uid } = require("./db");

const ADD_RESERVATION_QUERY = `
  INSERT INTO reservation (
    id, 
    book_id, 
    member_id, 
    reservation_date, 
    reservation_status_id
  )VALUES (?, ?, ?, ?, ?)
`;
const ADD_LOAN_BOOK_QUERY = `
  INSERT INTO loan (
    id, 
    book_id, 
    member_id, 
    loan_date
  ) VALUES (?, ?, ?, ?)
`;
const SET_RESERVATION_STATUS = `
  UPDATE reservation 
  SET reservation_status_id = '2' 
  WHERE reservation.id = ?;
`;
const SET_LOAN_TO_RETURNED = `
  UPDATE loan 
  SET returned_date = ? 
  WHERE loan.id = ?
`;
const DELETE_RENTED_BOOK = `update rentedBooks set returned_books = 1 where id = ?`;
const CHANGE_RETURNED_DATE = `update rentedBooks set returned_data = ? where id = ?`;
const HAS_RENTED = `SELECT count(*) as count from reservation
where reservation_status_id = 1 and book_id = ?;`;

const rentedBook = async (rentBook) => {
    console.log(rentBook);
    const con = await getConnection();
    return new Promise((resolve, reject) => {
        con.run(ADD_RESERVATION_QUERY,
            [
                rentBook.reservation_id,
                rentBook.book_id,
                rentBook.student_id,
                rentBook.reservation_date,
                1],
            (err) => {
                if (err) reject(err);
                resolve(rentBook.reservation_id);
            })
    })
}

const deleteRentedBook = async (id) => {
    const con = await getConnection();
    return new Promise((resolve, reject) => {
      con.run(DELETE_RENTED_BOOK,
        [id],
        (err) => {
          if (err) reject(err);
          resolve("Возврат книги оформлен!")
        })
    })
  }

const set_loan_date = async (rentBook) => {
    console.log(rentBook);
    const con = await getConnection();
    return new Promise((resolve, reject) => {
        con.run(ADD_LOAN_BOOK_QUERY,
            [
                rentBook.loan_id,
                rentBook.book_id,
                rentBook.student_id,
                rentBook.loan_date
            ],
            (err) => {
                if (err) reject(err);
                resolve(rentBook.loan_id);
            })
    })
}

const setBookToReturned = async (id, date) => {
    const con = await getConnection();
    await new Promise((resolve, reject) => {
        con.run(SET_LOAN_TO_RETURNED,
            [date, id],
            (err) => {
                if (err) reject(err);
                resolve()
            })
    });

    return new Promise((resolve, reject) => {
        con.run(SET_RESERVATION_STATUS,
            [id],
            (err) => {
                if (err) reject(err);
                resolve("Book have been returned!");
            })
    })
}

// const changeReturnedDataForRentedBooks = async (id, date) => {
//     console.log(date);
//     const con = await getConnection();
//     return new Promise((resolve, reject) => {
//       con.run(CHANGE_RETURNED_DATE,
//         [date, id],
//         (err) => {
//           if (err) reject(err);
//           resolve();
//         })
//     })
//   }

  const hasRented = async (id) => {
    const con = await getConnection();
  
    return new Promise((resolve, reject) => {
      con.all(HAS_RENTED,
        [id],
        (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve(rows);
        })
    })
  }

module.exports = {
    rentedBook,
    set_loan_date,
    setBookToReturned,
    deleteRentedBook,
    hasRented
}