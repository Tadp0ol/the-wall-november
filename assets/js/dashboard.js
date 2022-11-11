$(document).ready(function(){
    $("body")
            .on("submit", "#post_message_form", submitMessageForm)
            .on("submit", ".post_comment_form", submitCommentForm)
            .on("submit", ".delete_message", submitDeleteMessageForm)
            .on("submit", ".delete_comment", submitDeleteCommentForm);
});

function submitMessageForm(){
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

function submitCommentForm(){
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

