function toggleAnalyticList(grade) {
    const analyticList = document.getElementById('analyticList'+grade);
    analyticList.style.display = (analyticList.style.display === 'none' || analyticList.style.display === '') ? 'block' : 'none';
}

function template (grade, list) { 
return `<div class="toggle-button" onclick="toggleAnalyticList(${grade})">
    Показать рекомендации для ${grade} класса
</div>
<ul class="analytic-list" id="analyticList${grade}">
   ${list}
</ul>`;
}

function doAnalytics() {
    for(let i = 1; i <= 11; i++) {
    window.sql.getTopBooksByGrade(i)
    .then(res => {
        let list = "";
        res.forEach((book) => {
            list += `<li>${book.first_name} ${book.last_name} "${book.title}"</li>`;
        })
        if(res.length === 0) list = "<li>Недостаточно статистических данных!";
        const tmp = template(i, list);
        document.querySelector(".grade" + i).innerHTML = tmp;
    });
    }
}

document.querySelector(".toggle-recommenations").addEventListener("click", () => {
    const recommendations = document.querySelector(".analytic-recommendations");
    const thisButton = document.querySelector(".toggle-recommenations");

    if(recommendations.classList.contains("hide")) {
        doAnalytics()
        recommendations.classList.replace("hide", "show");
        thisButton.innerHTML = "Скрыть рекомендации";
    }
    else{
        recommendations.classList.replace("show", "hide");
        thisButton.innerHTML = "Показать рекомендации";
    }
})

