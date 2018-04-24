// $('.chat[data-chat=person2]').addClass('active-chat');
// $('.person[data-chat=person2]').addClass('active');

$('.left .person').mousedown(function(){
    // window.location.href = window.location.origin + `/channels/${$(this).attr('data-chat')}`
    // window.location.href = window.location.origin + `/channels/`
    console.log(window.location.origin)
    if ($(this).hasClass('.active')) {
        return false;
    } else {
        var findChat = $(this).attr('data-chat');
        var personName = $(this).find('.name').text();
        $('.right .top .name').html(personName);
        $('.chat').removeClass('active-chat');
        $('.left .person').removeClass('active');
        $(this).addClass('active');
        $('.chat[data-chat = '+findChat+']').addClass('active-chat');
    }
});

// var search = document.getElementById('search');
// var button = document.getElementById('button');
// var input = document.getElementById('input');

// function loading() {
//     search.classList.add('loading');
    
//     setTimeout(function() {
//         search.classList.remove('loading');
//     }, 1500);
// }

// button.addEventListener('click', loading);

// input.addEventListener('keydown', function() {
//     if(event.keyCode == 13) loading();
// });



$(document).ready(function() {
  
    const wrapper = document.querySelector(".input-wrapper"),
        textInput = document.querySelector("input[type='text']");
        
    textInput.addEventListener("keyup", event => {
        wrapper.setAttribute("data-text", event.target.value);
    });
  
});