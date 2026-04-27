let storage = window.localStorage;
let localData = JSON.parse(storage.getItem("data")) || [];

let isEdit;
let submitBtn = $("#sb-button")

showPages()

$("#photo").on("change", function logPhoto(event) {
    const file = event.target.files[0]; 
    
    let img = $("#img");
    
    if (file) {
        const reader = new FileReader();

        reader.onload = function(e) {
            const base64String = e.target.result;
            console.log("Photo Data (Base64):", base64String);
   
            img.addClass(".img")
            img.attr("src", base64String)
        };

        reader.readAsDataURL(file);

    }
})


$(".form-control").toArray().forEach(input => {
    $(input).on("keyup", function() {
        validateSingleField($(this));
    });
});


submitBtn.on("click", function(){
    let data = validation()

    if(!data) return

    if(isEdit)
    {
        let id = localData.findIndex(element => element.id == isEdit)
        localData[id] = {id: isEdit, ...data };
        
        isEdit = null;
    }
    else
        localData.push({id: Date.now(), ...data })

    storage.setItem("data", JSON.stringify(localData))

    // $("#rs-button").click()
    hideForm()
    showPages()
    submitBtn.textContent = "Submit";

});


$("#rs-button").on("click", reset);

let regex = /^[a-zA-Z]+([._-]?[a-zA-Z0-9]+)*@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/;
let regPass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%&!])[A-Za-z\d@#$%&!]{8,}$/;
let regName = /^\S[a-zA-Z, .'-]{2,}$/;

function validateSingleField(element) {

  
    if(element.attr("id") == "full")
        validateField(element, regName, "At least 3 letters; no starting space.");
    else if(element.attr("id") == "email")
        validateField(element, regex, "Enter valid email");
    else if(element.attr("id") == "password")
        validateField(element, regPass, "Password must be strong");
    else if(element.attr("id") == "address")
        validateField(element, /^.[a-zA-Z0-9 ,.-]{10,}$/,"Please write valid Address at least min 10 character");
    
}


function validation() {

    let data = getFormData()

    let name = validateField($("#full"), regName, "At least 3 letters; no starting space.");
    let mail = validateField($("#email"), regex, "Enter valid email");
    let pass = validateField($("#password"), regPass, "Password must be strong");
    let address = validateField($("#address"), /^\S[a-zA-Z0-9 ,.-]{9,}$/,"Please write valid Address");
    
    

    if(validateOther(data) && name && mail && pass && address){
        console.log("all fine");
        console.log(getFormData());
        return data
    }
    else
        return null
}

function validateField(element, regex, errorMsg) {



    if (element.val() === "") {
        showInValid(element, "Field is mandatory");
    }
    else if (!regex.test(element.val())) {
        showInValid(element, errorMsg);
    }
    else {
        showValid(element, "Looks good!");
        return true;
    }

    return false;
}

function removeFeedback(element) {
    element.next(".valid-feedback, .invalid-feedback").remove();
    element.removeClass("is-valid is-invalid");
}

function showInValid(element, msg) {
    removeFeedback(element);
    element.addClass("is-invalid");

    let newMsg = $("<div></div>");
    newMsg.addClass("invalid-feedback");
    newMsg.text(msg);

    element.after(newMsg);
}

function showValid(element, msg) {
    removeFeedback(element);
    element.addClass("is-valid");

    let newMsg = $("<div></div>");
    newMsg.addClass("valid-feedback");
    newMsg.text(msg);

    element.after(newMsg);
}


$("#date").on("input", age)

function age(e) {
    const ageElem = $("#age");
    const dobValue = e.target.value;

    if (!dobValue) return;

    const birthDate = new Date(dobValue);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    ageElem.val(age);


    if (age < 18) 
       showInValid(ageElem,  "Must be 18 or above")
    else
        removeFeedback(ageElem)
   
}

function validateOther(data){

    let isValid = true;

    if(!data.bod)
       isValid = showInValid($("#date"), "DOB is mendatory")
    else
        removeFeedback($("#date"))

    if (data.age < 18) 
       isValid = showInValid($("#age"),  "Must be 18 or above")
    else
        removeFeedback($("#age"))

    if(!data.gender)
       isValid = showInValid($("#last-radio"), "Please select gender")
    else
        removeFeedback($("#last-radio"))

    if(!data.hobbies.length)
       isValid = showInValid($("#last-checkBox"), "Please select your hobbies");
    else
        removeFeedback($("#last-checkBox"))

    if(!data.country)
       isValid = showInValid($("#country"), "Please select country");
    else
        removeFeedback($("#country"))

    let terms = $('input[name="terms"]').prop("checked")
    if(!terms)
        isValid = showInValid($("#terms"), "Please select terms");
    else
        removeFeedback($("#terms"))

    return isValid

}

function reset()
{
    $(".invalid-feedback").remove()
    $(".valid-feedback").remove()
    $(".is-invalid").removeClass("is-invalid")
    $(".is-valid").removeClass("is-valid")

    let img = $("#img")
    img.removeClass(".img")
    img.attr("src", "")
    
}


function printTable(given = localData, start = 0, end = 2){

    
    let tblData = $("#tblData")
    tblData.html(given.slice(start, end).map(createRow).join(""));

}

function createRow(element)
{

    let tableRow = `<tr data-id="${element.id}">
                        <td>
                            <div class="wrapper" style="display: flex;">
                            <img class="card-img" src="${element.image}" alt="Profile" style="width: 50px; height: auto;">
                            </div>
                        </td>
                        <td>${element.id}</td>
                        <td>${element.name}</td>
                        <td>${element.email}</td>
                        <td>${element.bod}</td>
                        <td>${element.age}</td>
                        <td>${element.gender}</td>
                        <td>${element.hobbies.join(", ")}</td>
                        <td>${element.country}</td>
                        <td>${element.address}</td>
                        <td>
                            <div class="d-flex gap-2">
                                <button class="btn btn-primary" data-action="edit">Edit</button>
                                <button class="btn btn-danger" data-action="delete">Delete</button>
                            </div>
                        </td>
                    </tr>`
    
    return tableRow
}

let form = $("#form");
let box = $("<div></div>");

$("#shw-btn").on("click", showForm)

box.on("click", hideForm)

function hideForm(){
    // $("#rs-button").click()
    form.css("display", "none");
    box.detach()

    isEdit = null;

    submitBtn.text("Submit"); 

}
function showForm(){
   
    box.addClass("box-shadow");

    if (form.is(":hidden")) {
        form.css("display", "flex");
        form.after(box);
    } 
  
}


$("#search").on("input", searchList)

function searchList(){
    
    let type = $("#search").val().toLowerCase();

    let searched = localData.filter(obj =>
        [obj.id, obj.name, obj.email, obj.bod, obj.age, obj.gender, obj.country, obj.address]
            .some(val => String(val).toLowerCase().includes(type))
    );

    printTable(searched)
}

$("#tblData").on("click", "[data-action]", function() {

    let btn = $(this);               
    let row = btn.closest("tr");    

    const id = row.data("id");
    const action = btn.data("action");

    if (action === "edit") showData(id);
    if (action === "delete") deleteRow(id);
});


function showData(id){

    isEdit = id
    let givenData = localData.find(element => element.id == id)

    $("#full").val(givenData.name)
    $("#email").val(givenData.email)
    $("#password").val(givenData.password)   
    $("#date").val(givenData.bod)
    $("#age").val(givenData.age)
    $("#img").attr("src", givenData.image)
    $("#country").val(givenData.country)
    $("#address").val(givenData.address)
 
    let gender = $('input[name="RadioOptions"]');
    gender.each((index, radio) => {
        $(radio).prop("checked", $(radio).val() == givenData.gender);
    });

    let hobbies = $('input[name="hobbies"]');
    hobbies.each((index, check) => {
        $(check).prop(
            "checked",
            givenData.hobbies.includes($(check).val())
        );
    });

    showForm()
    submitBtn.text("Update"); 

}

function deleteRow(id){
    if(confirm("Are you sure?")){
        const index = localData.findIndex(el => String(el.id) === String(id));
        if (index === -1) return;

        localData.splice(index, 1);
        storage.setItem("data", JSON.stringify(localData));
        showPages()
    }
}

// $("#cancel").on("click", "[data-conform]", function cancle(){

//     let btn = $(this).data("conform")

//     if(btn == "yes")
    
//     $("#confirm-shadow").hide()
// })


function getFormData(){
   return { 
        name: $("#full").val(),
        address: $("#address").val(),
        age: $("#age").val(),
        bod: $("#date").val(),
        country:$("#country").val(),
        email: $("#email").val(),
        gender: $('input[name="RadioOptions"]:checked').val(),
        hobbies: $('input[name="hobbies"]:checked').toArray().map(cb => $(cb).val()),
        image: $("#img").attr("src") || "./passport.jpg",
        password: $("#password").val()
    }
}

$("#row").on("change", function(){
    showPages($(this).val(), $(".active").text())
})

$(".pagination").on("click", ".page", function(){

    $(".page-item").removeClass("active");

    $(this).closest(".page-item").addClass("active");

    let page = $(this).text(); 

    showPages($("#row").val(), page);
})


function showPages(rows = $("#row").val(), page = $(".active").text()){

    let last = rows * page
    let first  = last - rows

    renderPages();
    printTable(undefined , first, last);
}

function renderPages() {

    let length = localData.length;
    let row = parseInt($("#row").val());
    let totalPages = Math.ceil(length / row);

    let container = $(".pagination");
    let current = parseInt($(".active").text()) || 1;
    current = current > totalPages ? totalPages : current;
    

    container.html("");

    container.append(`<li class="page-item prev"><a class="page-link">Prev</a></li>`);
    if(current == 1)
        $(".prev").addClass("disabled")
    
    

    for (let i = 1; i <= totalPages; i++) {
        container.append(`
            <li class="page-item ${i === current ? "active" : ""}">
                <a class="page-link page">${i}</a>
            </li>
        `);
    }

    container.append(`<li class="page-item next"><a class="page-link">Next</a></li>`);
    
    if(current == totalPages)
        $(".next").addClass("disabled")
    

    
}


$(".pagination").on("click", ".prev", function () {

    let current = parseInt($(".active").text()) || 1;

    if (current > 1) {
        let prev = current - 1;

        $(".page-item").removeClass("active");
        $(".page").each(function () {
            if ($(this).text() == prev) {
                $(this).closest(".page-item").addClass("active");
            }
        });

        showPages($("#row").val(), prev);
    }
        
});

$(".pagination").on("click", ".next", function () {

    let current = parseInt($(".active").text()) || 1;
    let row = parseInt($("#row").val());
    let totalPages = Math.ceil(localData.length / row);

    if (current < totalPages) {
        let next = current + 1;

        $(".page-item").removeClass("active");
        $(".page").each(function () {
            if ($(this).text() == next) {
                $(this).closest(".page-item").addClass("active");
            }
        });

        showPages(row, next);
    }
});


$(".table").on("click", ".head", function(){


    $(".head").removeClass("sort")
    $(this).addClass("sort")

    let column = $(this).data("id")
    console.log(column);
    
    if(column == "id"){
        localData.sort((a, b) => a[column] - b[column]);
    }
    else
        localData.sort((a, b) => a[column].localeCompare(b[column]));
    showPages()

})