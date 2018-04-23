// $('.chat[data-chat=person2]').addClass('active-chat');
// $('.person[data-chat=person2]').addClass('active');

$('.left .person').mousedown(function(){
    window.location.href = window.location.origin + `/channels/${$(this).attr('data-chat')}`
    // window.location.href = window.location.origin + `/channels/`
    console.log(window.location.origin)
//     if ($(this).hasClass('.active')) {
//         return false;
//     } else {
//         var findChat = $(this).attr('data-chat');
//         var personName = $(this).find('.name').text();
//         $('.right .top .name').html(personName);
//         $('.chat').removeClass('active-chat');
//         $('.left .person').removeClass('active');
//         $(this).addClass('active');
//         $('.chat[data-chat = '+findChat+']').addClass('active-chat');
//     }
});