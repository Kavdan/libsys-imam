const { contextBridge, ipcRenderer } = require("electron");


contextBridge.exposeInMainWorld("sql", {
  getBooks: async () => {
    const res = await ipcRenderer.invoke("getBooks");
    return res;
  },
  removeBook: async (id) => {
    const res = await ipcRenderer.invoke("removeBook", id);
    return res;
  },
  goToAddBook: () => {
    ipcRenderer.invoke("goToAddBook");
  }, 
  addBook: async (book) => {
    const res = await ipcRenderer.invoke("addBook", book);
    return res;
  },
  getStudents: async () => {
    const res = await ipcRenderer.invoke("getStudents");
    return res;
  },
  removeStudent: async(id) => {
    const res = await ipcRenderer.invoke("removeStudent", id);
    return res;
  },
  goToAddStudent: () => {
    ipcRenderer.invoke("goToAddStudent");
  },
  addStudent: async (student) => {
    const res = await ipcRenderer.invoke("addStudent", student);
    return res;
  },
  goToStudentInfo: () => {
    ipcRenderer.invoke("goToStudentInfo");
  },
  rentedBook: async (rented_book) => {
    const res = await ipcRenderer.invoke("rentedBook", rented_book);
    return res;
  },
  returnBookTitleAndStudentName: async (student_id, check) => {
    const res = await ipcRenderer.invoke("returnBookTitleAndStudentName", student_id, check);
    return res;
  }, 
  alert: (errMessage) => {
    ipcRenderer.invoke("alert", errMessage);
  },
  showInfo: (message) => {
    ipcRenderer.invoke("showInfo", message);
  },
  deleteRentedBook: async (id) => {
    const res = await ipcRenderer.invoke("deleteRentedBook", id);
    return res;
  },
  checkBookCount: async (id) => {
    const res = await ipcRenderer.invoke("checkBookCount", id);
    return res;
  },
  decrementBook: async (id) => {
    const res = await ipcRenderer.invoke("decrementBook", id);
    return res;
  },
  incrementBook: async (id) => {
    const res = await ipcRenderer.invoke("incrementBook", id);
    return res;
  },
  hasRented: async (id) => {
    const res = await ipcRenderer.invoke("hasRented", id);
    return res;
  },
  goToChangeBook: () => {
    ipcRenderer.invoke("goToChangeBook");
  },
  getBook: async (id) => {
    const res = await ipcRenderer.invoke("getBook", id);
    return res;
  },
  changeBook: async (book) => {
    const res = await ipcRenderer.invoke("changeBook", book);
    return res;
  },
  closeCurrentWindow: () => {
    ipcRenderer.send("closeCurrentWindow");
  }, 
  changeReturnedDataForRentedBooks: async (id, date) => {
    const res = await ipcRenderer.invoke("changeReturnedDataForRentedBooks", id, date);
    return res;
  },
  getGanres: async () => {
    const res = await ipcRenderer.invoke("getGanres");
    return res;
  },
  addAuthor: async (author) => {
    const res = await ipcRenderer.invoke("addAuthor", author);
    return res;
  },
  associateBookWithAuthor: async (book_id, author_id) => {
    const res = await ipcRenderer.invoke("associateBookWithAuthor", book_id, author_id);
    return res;
  },
  loanBook: async (rentBook) => {
    const res = await ipcRenderer.invoke("loanBook", rentBook);
    return res;
  },
  setBookToReturned: async (id, date) => {
    const res = await ipcRenderer.invoke("setBookToReturned", id, date);
    return res;
  },
  getBookTitleById: async (id) => {
    const res = await ipcRenderer.invoke("getBookTitleById", id);
    return res;
  },
  getStudentNameById: async (id) => {
    const res = await ipcRenderer.invoke("getStudentNameById", id);
    return res;
  },
  getLoanByMemberAndBookId: async (member_id, book_id) => {
    const res = await ipcRenderer.invoke("getLoanByMemberAndBookId", member_id, book_id);
    return res;
  },
  addFine: async (data) => {
    const res = await ipcRenderer.invoke("addFine", data);
    return res;
  },
  getTotalFine: async (student_id) => {
    const res = await ipcRenderer.invoke("getTotalFine", student_id);
    return res;
  },
  payForFine: async (student_id, date) => {
    const res = await ipcRenderer.invoke("payForFine", student_id, date);
    return res;
  },
  getAllStudentsWithIssuedBooks: async (date) => {
    const res = await ipcRenderer.invoke("getAllStudentsWithIssuedBooks", date);
    return res;
  },
  deleteAllFinesByStudentId: async (student_id) => {
    const res = await ipcRenderer.invoke("deleteAllFinesByStudentId", student_id);
    return res;
  },
  getAuthorId: async (id) => {
    const res = await ipcRenderer.invoke("getAuthorId", id);
    return res;
  },
  changeAuthorNameAndSurname: async (first_name, last_name, author_id) => {
    const res = await ipcRenderer.invoke("changeAuthorNameAndSurname", first_name, last_name, author_id);
    return res;
  },
  getStudent: async (id) => {
    const res = await ipcRenderer.invoke("getStudent", id);
    return res;
  },
  goToChangeStudent: () => {
    ipcRenderer.invoke("goToChangeStudent");
  },
  changeStudent: async (student) => {
    const res = await ipcRenderer.invoke("changeStudent", student);
    return res;
  },
  getTopBooksByGrade: async (grade) => {
    const res = await ipcRenderer.invoke("getTopBooksByGrade", grade);
    return res;
  }
});