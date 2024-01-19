const { getConnection, uid } = require("./db");

const INSERT_STUDENT_QUERY = `
  INSERT INTO member (
    id,
    first_name, 
    last_name, 
    phone_number, 
    email, 
    birth_date,
    address,
    passport_number,
    grade,
    joined_date, 
    active_status_id
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
`;
const GET_ALL_STUDENTS_QUERY = `
  SELECT * FROM member;
`;
const REMOVE_STUDENT_QUERY = async (student_id) =>
    [
        `DELETE FROM fine_payment WHERE member_id = '${student_id}'`,
        `DELETE FROM fine WHERE member_id = '${student_id}'`,
        `DELETE FROM loan WHERE member_id = '${student_id}'`,
        `DELETE FROM reservation WHERE member_id = '${student_id}'`,
        `DELETE FROM member WHERE id = '${student_id}'`
    ];
const GET_BOOK_TITLE_AND_STUDENT_NAME_QUERY = `
    SELECT * from reservation 
    LEFT join member on reservation.member_id = member.id
    LEFT JOIN book on reservation.book_id = book.id
    LEFT join loan on reservation.id = loan.id
    where reservation.reservation_status_id = 1 and reservation.member_id = ?;
`;
const GET_RETURNED_LIST_OF_BOOKS = `
  SELECT * from reservation 
  LEFT join member on reservation.member_id = member.id
  LEFT JOIN book on reservation.book_id = book.id
  LEFT join loan on reservation.id = loan.id
  where reservation.reservation_status_id = 2 and reservation.member_id = ?;
`;
const GET_STUDENT_NAME_BY_ID = `
    SELECT * FROM member 
    WHERE member.id = ?
`;
const GET_STUDENT_BY_ID = `
    SELECT * FROM member where member.id = ?;
`;
const SELECT_ALL_STUDENTS_WITH_ISSUED_BOOKS = `
SELECT * FROM member
LEFT JOIN reservation on reservation.member_id = member.id
LEFT JOIN loan on reservation.id = loan.id
WHERE reservation.reservation_status_id = 1 AND loan.loan_date < ?;`;

const CHANGE_STUDENT = `
UPDATE member SET
first_name = ?,
last_name = ?,
phone_number = ?,
email = ?,
birth_date = ?,
address = ?,
passport_number = ?,
grade = ? 
WHERE member.id = ?
`;


const getStudents = async () => {
    const con = await getConnection();
    return new Promise((resolve, reject) => {
        con.all(GET_ALL_STUDENTS_QUERY,
            [],
            (err, rows) => {
                if (err) reject(err);
                resolve(rows);
            })
    })
}

const removeStudent = async (id) => {
    const con = await getConnection();
    const queries = await REMOVE_STUDENT_QUERY(id);

    queries.forEach(async query => {
        await new Promise((resolve, reject) => {
            con.run(query, [], (err) => {
                if (err) {
                    reject(err);
                }
                resolve("student was deleted!");
            })
        })
    })
}

const addStudent = async (student) => {
    const con = await getConnection();
    return new Promise((resolve, reject) => {
        const student_id = uid();

        con.run(INSERT_STUDENT_QUERY,
            [
                student_id,

                student.first_name,
                student.last_name,
                student.phone_number,
                student.email,
                student.birth_date,
                student.address,
                student.passport_number,
                student.grade,
                student.joined_date,

                1 // NO_ISSUED_BOOKS
            ], (err) => {
                if (err) reject(err);
                resolve(student_id);
            })
    })
}

const dbreturnBookTitleAndStudentName = async (student_id, check) => {
    const con = await getConnection();
    return new Promise((resolve, reject) => {
        con.all(
            check ? GET_RETURNED_LIST_OF_BOOKS : GET_BOOK_TITLE_AND_STUDENT_NAME_QUERY,
            [student_id],
            (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            }
        )
    })
}

const getStudentNameById = async (id) => {
    const con = await getConnection();
    return new Promise((resolve, reject) => {
        con.all(GET_STUDENT_NAME_BY_ID,
            [id],
            (err, rows) => {
                if (err) reject(err);
                resolve(rows);
            })
    })
}

const getAllStudentsWithIssuedBooks = async (date) => {
    const con = await getConnection();
    return new Promise((resolve, reject) => {
        con.all(SELECT_ALL_STUDENTS_WITH_ISSUED_BOOKS,
            [date],
            (err, rows) => {
                if (err) reject(err);
                resolve(rows);
            })
    })
}

const getStudent = async (id) => {
    const con = await getConnection();
    return new Promise((resolve, reject) => {
        con.all(GET_STUDENT_BY_ID,
            [id],
            (err, rows) => {
                if (err) reject(err);
                resolve(rows);
            })
    })
}

const changeStudent = async (student) => {
    const con = await getConnection();
    return new Promise((resolve, reject) => {
        con.run(CHANGE_STUDENT, [
            student.first_name,
            student.last_name,
            student.phone_number,
            student.email,
            student.birth_date,
            student.address,
            student.passport_number,
            student.grade,
            student.id
        ], (err) => {
            if(err) reject(err);
            resolve();
        })
    })
}

module.exports = {
    getStudents,
    getStudent,
    removeStudent,
    addStudent,
    dbreturnBookTitleAndStudentName,
    getStudentNameById,
    getAllStudentsWithIssuedBooks,
    changeStudent
}