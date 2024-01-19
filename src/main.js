const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("node:path");
const { event } = require("jquery");
const nodemailer = require("nodemailer");
const { getBooks, removeBook, addBook, checkBookCount, decrementBook, incrementBook, getBook, changeBook, getGanres, getBookTitleById } = require("./database/book_db");
const { addAuthor, associateAuthorWithBook, getAuthorId, changeAuthorNameAndSurname } = require("./database/author_db");
const { getStudents, removeStudent, addStudent, dbreturnBookTitleAndStudentName, getStudentNameById, getAllStudentsWithIssuedBooks, getStudent, changeStudent } = require("./database/student_db");
const { rentedBook, deleteRentedBook, hasRented, changeReturnedDataForRentedBooks, set_loan_date, setBookToReturned } = require("./database/rentbooks_db");
const { getLoanByMemberAndBookId, addFine, getTotalFine, payForFine } = require("./database/loan_fine_db");
const { getTopBooksByGrade } = require("./database/analytics_db");


function createWindow() {
  const win = new BrowserWindow({
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js")
    },
  });
  win.webContents.openDevTools();
  win.loadFile('./views/dashboard.html');
}

function closeCurrentWindow() {
  let currentWindow = BrowserWindow.getFocusedWindow();
  if (currentWindow) {
    currentWindow.close();
  }
}

ipcMain.on("closeCurrentWindow", () => closeCurrentWindow());


app.whenReady().then(createWindow);

ipcMain.handle('getBooks', async () => {
  const res = await getBooks()
  return res;
});

ipcMain.handle('removeBook', async (event, id) => {
  const res = await removeBook(id);
  return res;
})

ipcMain.handle('goToAddBook', () => {
  const addBookWin = new BrowserWindow({
    maxWidth: 400,
    maxHeight: 500,
    webPreferences: {
      preload: path.join(__dirname, "preload.js")
    },
  });
  addBookWin.webContents.openDevTools();
  addBookWin.loadFile("views/addBook.html");
})

ipcMain.handle('goToAddStudent', () => {
  const addStudentWin = new BrowserWindow({
    maxWidth: 400,
    maxHeight: 500,
    webPreferences: {
      preload: path.join(__dirname, "preload.js")
    },
  });
  addStudentWin.webContents.openDevTools();
  addStudentWin.loadFile("views/addStudent.html");
})

ipcMain.handle("goToStudentInfo", () => {
  const studentInfo = new BrowserWindow({
    maxWidth: 500,
    maxHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js")
    },
  });
  studentInfo.webContents.openDevTools();
  studentInfo.loadFile("views/studentInfo.html");
})

ipcMain.handle("goToChangeBook", () => {
  const changeBook = new BrowserWindow({
    maxWidth: 400,
    maxHeight: 500,
    webPreferences: {
      preload: path.join(__dirname, "preload.js")
    },
  });
  changeBook.webContents.openDevTools();
  changeBook.loadFile("views/changeBook.html");
})

ipcMain.handle("goToChangeStudent", () => {
  const changeStudent = new BrowserWindow({
    maxWidth: 400,
    maxHeight: 500,
    webPreferences: {
      preload: path.join(__dirname, "preload.js")
    }
  })

  changeStudent.webContents.openDevTools();
  changeStudent.loadFile("views/changeStudent.html");
})

ipcMain.handle("alert", (event, errMessage) => {
  dialog.showErrorBox("Error!", errMessage);
})

ipcMain.handle("showInfo", (event, message) => {
  dialog.showMessageBox({message});
})


ipcMain.handle("addBook", async (event, book) => {
  const res = await addBook(book);
  return res;
})

ipcMain.handle("addAuthor", async (event, author) => {
  const res = await addAuthor(author);
  return res;
})

ipcMain.handle("associateBookWithAuthor", async (event, book_id, author_id) => {
  const res = await associateAuthorWithBook(book_id, author_id);
  return res;
})

ipcMain.handle("getStudents", async () => {
  const res = await getStudents();
  return res;
})

ipcMain.handle("removeStudent", async (event, id) => {
  const res = await removeStudent(id);
  return res;
})

ipcMain.handle("addStudent", async (event, student) => {
  const res = await addStudent(student);
  return res;
})

ipcMain.handle("rentedBook", async (event, rented_book) => {
  const res = await rentedBook(rented_book);
  return res;
})

ipcMain.handle("returnBookTitleAndStudentName", async (event, student_id, check) => {
  const res = await dbreturnBookTitleAndStudentName(student_id, check);
  return res;
})

ipcMain.handle("deleteRentedBook", async (event, id) => {
  const res = await deleteRentedBook(id);
  return res;
})

ipcMain.handle("checkBookCount", async (event, id) => {
  const res = await checkBookCount(id);
  return res;
})

ipcMain.handle("decrementBook", async (event, id) => {
  const res = await decrementBook(id);
  return res;
})

ipcMain.handle("incrementBook", async (event, id) => {
  const res = await incrementBook(id);
  return res;
})

ipcMain.handle("hasRented", async (event, id) => {
  const res = await hasRented(id);
  return res;
})

ipcMain.handle("getBook", async (event, id) => {
  const res = await getBook(id);
  return res;
})

ipcMain.handle("changeBook", async (event, book) => {
  const res = await changeBook(book);
  return res;
})

ipcMain.handle("changeReturnedDataForRentedBooks", async (event, id, date) => {
  // const res = await changeReturnedDataForRentedBooks(id, date);
  return res;
})

ipcMain.handle("getGanres", async () => {
  const res = await getGanres();
  return res;
})

ipcMain.handle("loanBook", async (event, rentBook) => {
  const res = await set_loan_date(rentBook);
  return res;
})

ipcMain.handle("setBookToReturned", async (event, id, date) => {
  const res = await setBookToReturned(id, date);
  return res;
})

ipcMain.handle("getBookTitleById", async(event, id) => {
  const res = await getBookTitleById(id);
  return res;
})

ipcMain.handle("getStudentNameById", async (event, id) => {
  const res = await getStudentNameById(id);
  return res;
})

ipcMain.handle("getLoanByMemberAndBookId", async (event, member_id, book_id) => {
  const res = await getLoanByMemberAndBookId(member_id, book_id);
  return res;
})

ipcMain.handle("addFine", async(event, data) => {
  const res = await addFine(data);
  return res;
})

ipcMain.handle("getTotalFine", async(event, student_id) => {
  const res = await getTotalFine(student_id);
  return res;
})

ipcMain.handle("payForFine", async (event, student_id, date) => {
  const res = await payForFine(student_id, date);
  return res;
})

ipcMain.handle("getAllStudentsWithIssuedBooks", async (event, date) => {
  const res = await getAllStudentsWithIssuedBooks(date);
  return res;
})

ipcMain.handle("deleteAllFinesByStudentId", async (event, student_id) => {
  const res = await deleteAllFinesByStudentId(student_id);
  return res;
})

ipcMain.handle("getAuthorId", async (event, id) => {
  const res = await getAuthorId(id);
  return res;
})

ipcMain.handle("changeAuthorNameAndSurname", async (event, first_name, last_name, author_id) => {
  const res = await changeAuthorNameAndSurname(first_name, last_name, author_id);
  return res;
})

ipcMain.handle("getStudent", async (event, id) => {
  const res = await getStudent(id);
  return res;
})

ipcMain.handle("changeStudent", async (event, student) => {
  const res = await changeStudent(student);
  return res;
})

ipcMain.handle("getTopBooksByGrade", async (event, grade) => {
  const res = await getTopBooksByGrade(grade);
  return res;
})