$(document).ready(function(){
    $("body")
            .on("submit", "#create_message", submitCreateMessageForm)
            .on("submit", ".delete_message", submitDeleteMessageForm)
            .on("submit", ".create_comment", submitCreateCommentForm)
            .on("submit", ".delete_comment", submitDeleteCommentForm);
});

function submitCreateMessageForm(){
    let form = $(this);

    $.post(form.attr("action"), $(form).serialize(), (data) => {
        if(data.status){
            location.reload();
        }
        else{
            alert(data.message);
        }
    }, "json");

    return false;
}

function submitDeleteMessageForm(){
    let form = $(this);

    $.post(form.attr("action"), $(form).serialize(), (data) => {
        if(data.status){
            location.reload();
        }
        else{
            alert(data.message);
        }
    }, "json");

    return false;
}

function submitCreateCommentForm(){
    let form = $(this);

    $.post(form.attr("action"), $(form).serialize(), (data) => {
        if(data.status){
            location.reload();
        }
        else{
            alert(data.message);
        }
    }, "json");

    return false;
}

function submitDeleteCommentForm(){
    let form = $(this);

    $.post(form.attr("action"), $(form).serialize(), (data) => {
        if(data.status){
            location.reload();
        }
        else{
            alert(data.message);
        }
    }, "json");

    return false;
}