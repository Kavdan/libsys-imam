const getFormatDate = () => {
    const date = new Date();
    const day = date.getUTCDate();
    const month = date.getUTCMonth() + 1;
    const year = date.getUTCFullYear();

    return `${year}-${month < 10 ? '0'+month : month}-${day < 10 ? '0'+day : day}`
}

function getStudent() {
    const fullname = document.querySelector('.fullname').value;
    const splitedName = fullname.split(" ");
    if(splitedName.length != 2) {
        window.sql.alert("Некорректное имя школьника! *Вы должны указать Фамилию и Имя");
        return;
    }
    const address = document.querySelector('.address').value;
    const passport_number = document.querySelector('.passport_number').value;
    const email = document.querySelector('.email').value;
    const phone_number = document.querySelector('.phone_number').value;
    const grade = document.querySelector('.grade').value;
    const birth_date = document.querySelector('.born_day').value;

    const student = {
        first_name: splitedName[0],
        last_name: splitedName[1],
        email,
        phone_number,
        passport_number,
        address,
        grade,
        birth_date,
        joined_date: getFormatDate()
    }

    return student;
}

function emptyFields() {
    document.querySelector('.fullname').value = "";
    document.querySelector('.address').value = "";
    document.querySelector('.passport_number').value = "";
    document.querySelector('.email').value = "";
    document.querySelector('.phone_number').value = "";
    document.querySelector('.grade').value = "";
    document.querySelector('.born_day').value = ""; 
}

document.querySelector(".add-student-submit-btn").addEventListener('click', (e) => {
    e.preventDefault();
    window.sql.addStudent(getStudent());
    emptyFields();
})