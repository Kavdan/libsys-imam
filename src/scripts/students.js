function getFormatDate () {
    const date = new Date();
    const day = date.getUTCDate();
    const month = date.getUTCMonth() + 1;
    const year = date.getUTCFullYear();

    return `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`
}

function studentInfo(event, id) {
    // document.querySelector(".student"+id).target.stopPropagation();
    event.stopPropagation();
    localStorage.setItem("studentId", id);
    window.sql.goToStudentInfo();
}

document.querySelector(".showIssuedStudents").addEventListener('click', () => {
    if(document.querySelector(".showIssuedStudents").classList.contains("false")){
        document.querySelector(".showIssuedStudents").classList.replace("false", "true");
    }else {
        document.querySelector(".showIssuedStudents").classList.replace("true", "false");
    }
    getStudents();
})

function getStudents () {
    let studentsAll = "";

    if(document.querySelector(".showIssuedStudents").classList.contains("true")){
        window.sql.getAllStudentsWithIssuedBooks(getFormatDate())
        .then(students => {
            students.forEach(((student, i) => {
                const query = document.querySelector('.students-search-input').value;
                if(query !== '' 
                   && (!(student.first_name + " " + student.last_name).toLowerCase().includes(query.toLowerCase()) 
                   && !(student.email).toLowerCase().includes(query.toLowerCase()))){
                                        return;           
                }
    
                studentsAll += `
                <tr onclick="studentInfo(event, '${student.id}')" 
                    class="student student${student.id}">
                <td>${student.first_name + " " + student.last_name}</td>
                <td>${student.grade}</td>
                <td>${student.phone_number}</td>
                <td>${student.email}</td>
                <td>${student.address}</td>
                <td>${student.birth_date}</td>
                <td>
                    <span class="delete-student-button" 
                    onclick="removeStudent(event, '${student.id}')">Удалить</span>
                </td>
              </tr>`
            }))
            document.querySelector("#students-table-body").innerHTML = studentsAll;
        })
    }else {

    window.sql.getStudents().then( students => {
        students.forEach(((student, i) => {
            const query = document.querySelector('.students-search-input').value;
            if(query !== '' 
               && (!(student.first_name + " " + student.last_name).toLowerCase().includes(query.toLowerCase()) 
               && !(student.email).toLowerCase().includes(query.toLowerCase()))){
                                    return;           
            }

            studentsAll += `
            <tr onclick="studentInfo(event, '${student.id}')" 
                class="student student${student.id}">
            <td>${student.first_name + " " + student.last_name}</td>
            <td>${student.grade}</td>
            <td>${student.phone_number}</td>
            <td>${student.email}</td>
            <td>${student.address}</td>
            <td>${student.birth_date}</td>
            <td>
                <span class="delete-student-button" 
                onclick="removeStudent(event, '${student.id}')">Удалить</span>
                <span class="change-student-button" 
                onclick="changeStudent(event, '${student.id}')">Изменить</span>
            </td>
          </tr>`
        }))
        document.querySelector("#students-table-body").innerHTML = studentsAll;
    })
}
}

getStudents();

function removeStudent(event, id) {
    event.stopPropagation();
    window.sql.removeStudent(id).then(res => getStudents());
    window.sql.deleteAllFinesByStudentId(id);
}

function changeStudent(event, id) {
    event.stopPropagation();
    localStorage.setItem("student_id", id);
    window.sql.goToChangeStudent();
}

document.querySelector(".add-student").addEventListener('click', () => {
    window.sql.goToAddStudent();
})

document.querySelector(".refresh-students").addEventListener('click', () => {
    getStudents();
})

document.querySelector(".student-search-button").addEventListener("click", () => {
    getStudents();
})


