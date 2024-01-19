const { getConnection, uid } = require("./db");

const GET_LOAN_BY_MEMBER_AND_BOOK_ID = `
  SELECT * FROM loan 
  WHERE loan.member_id = ? and loan.book_id = ?;
`;
const ADD_FINE_QUERY =
    `
  INSERT INTO fine (
    id, 
    book_id, 
    loan_id,
    member_id,
    fine_date, 
    fine_amount
  ) VALUES (?, ?, ?, ?, ?, ?)
`;
const GET_TOTAL_FINE = `
SELECT SUM(fine_amount) as amount
FROM fine WHERE fine.member_id = ?`;
const PAY_FINE = `
  INSERT INTO fine_payment (
    id, 
    member_id, 
    payment_date, 
    payment_amount
  ) VALUES (?, ?, ?, ?)
`;
const DELETE_ACTIVE_FINES = `DELETE FROM fine WHERE fine.member_id = ?`;

const getLoanByMemberAndBookId = async (member_id, book_id) => {
    const con = await getConnection();
    return new Promise((resolve, reject) => {
        con.all(GET_LOAN_BY_MEMBER_AND_BOOK_ID,
            [member_id, book_id],
            (err, rows) => {
                if (err) reject(err);
                resolve(rows)
            })
    })
}



const addFine = async (data) => {
    const id = uid();
    const con = await getConnection();
    return new Promise((resolve, reject) => {
        con.run(ADD_FINE_QUERY,
            [
                id,
                data.book_id,
                data.loan_id,
                data.member_id,
                data.fine_date,
                data.fine_amount
            ],
            (err) => {
                if (err) reject(err);
                resolve();
            })
    })
}


const getTotalFine = async (student_id) => {
    const con = await getConnection();
    return new Promise((resolve, reject) => {
        con.all(GET_TOTAL_FINE,
            [student_id],
            (err, rows) => {
                if (err) reject(err);
                resolve(rows);
            })
    })
}

const payForFine = async (student_id, date) => {
    const con = await getConnection();
    const fine_payment_id = uid();

    const totalFine = await new Promise((resolve, reject) => {
        con.all(GET_TOTAL_FINE, (err, total) => {
            if (err) {
                con.run("ROLLBACK")
                reject(err);
            }
            resolve(total[0].amount);
        })
    })

    await new Promise((resolve, reject) => {
        con.run(PAY_FINE,
            [
                fine_payment_id,
                student_id,
                date,
                totalFine
            ], (err) => {
                if (err) {
                    con.run("ROLLBACK")
                    reject(err);
                }
                resolve();
            })
    })

    return new Promise((resolve, reject) => {
        con.run(DELETE_ACTIVE_FINES,
            [student_id],
            (err) => {
                if (err) {
                    con.run("ROLLBACK")
                    reject(err);
                }
                resolve();
            })
    });
}

const deleteAllFinesByStudentId = async (student_id) => {
    const con = await getConnection();
    return new Promise((resolve, reject) => {
      con.run(DELETE_ACTIVE_FINES,
        [student_id],
        (err) => {
          if(err) {
            con.run("ROLLBACK")
            reject(err);
          }
          resolve();
         })
    });
  }

module.exports = {
    getLoanByMemberAndBookId,
    addFine,
    getTotalFine,
    payForFine
}