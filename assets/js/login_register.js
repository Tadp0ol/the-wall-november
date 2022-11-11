$(document).ready(function(){
    $("body")
            .on("submit", "#register_form", submitRegisterForm)
            .on("submit", "#login_form", submitLoginForm);
});

function submitRegisterForm(){
    let form = $(this);

    $.post(form.attr("action"), $(form).serialize(), (data) => {
        if(data.status){
            window.location.href = "dashboard";
        }
        else{
            alert(data.message);
        }
    }, "json");

    return false;
}

function submitLoginForm(){
    let form = $(this);

    $.post(form.attr("action"), $(form).serialize(), (data) => {
        if(data.status){
            window.location.href = "dashboard";
        }
        else{
            alert(data.message);
        }
    }, "json");

    return false;
}