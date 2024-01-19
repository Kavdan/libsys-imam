const getFields = () => {
    return {
        fullname: document.querySelector(".fullname"),
        address: document.querySelector(".address"),
        passport_number: document.querySelector(".passport_number"),
        email: document.querySelector(".email"),
        phone_number: document.querySelector(".phone_number"),
        grade: document.querySelector(".grade"),
        born_day: document.querySelector(".born_day")
    }
}

window.sql.getStudent(localStorage.getItem("student_id")).then(res => {
    console.log(res);
    const {fullname, 
           address, 
           passport_number, 
           email, phone_number, 
           grade, 
           born_day} = getFields();

    fullname.value = res[0].first_name + " " + res[0].last_name;
    address.value = res[0].address;
    passport_number.value = res[0].passport_number;
    email.value = res[0].email;
    phone_number.value = res[0].phone_number;
    grade.value = res[0].grade;
    born_day.value = res[0].birth_date;
})

document.querySelector(".change-student-submit-btn").addEventListener("click", (e) => {
    e.preventDefault();

    const {fullname, 
        address, 
        passport_number, 
        email, phone_number, 
        grade, 
        born_day} = getFields();

    if(fullname.value === "" || 
       address.value === "" ||
       email.value === "" ||
       grade.value === "" ||
       born_day.value === ""||
       phone_number.value === ""){
        window.sql.alert("Поля не могут быть пустыми!");
        return;
       }

    if(fullname.value.split(" ").length !== 2) {
        window.sql.alert("У автора должно быть имя и фамилия!");
        return;
    }

    const student = {
        id: localStorage.getItem("student_id"),
        first_name: fullname.value.split(" ")[0],
        last_name: fullname.value.split(" ")[1],
        address: address.value,
        passport_number: passport_number.value,
        email: email.value,
        phone_number: phone_number.value,
        grade: grade.value,
        birth_date: born_day.value
    }
    window.sql.changeStudent(student).then(() => {
        window.sql.showInfo("Информация о школьнике успешно изменена!")
        window.sql.closeCurrentWindow();
    });
})