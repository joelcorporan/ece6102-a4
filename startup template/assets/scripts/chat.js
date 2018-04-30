$(function() {

    /*************** THIS IS JUST A TEMPLATE TO CHANGE BETWEEN CHAT ROOMS *************/

    $('.chat[data-chat=person1]').addClass('active-chat');
    $('.channel[data-chat=person1]').addClass('active');

    $('.left .channel').on('click', function(){
        if ($(this).hasClass('active')) return false;

        else {
            console.log("not here: ", $(this).hasClass('active'))

            var findChat = $(this).attr('data-chat');
            var personName = $(this).find('.name').text();

            $('.right .top .name').html(personName);
            $('.chat').removeClass('active-chat');
            $('.left .channel').removeClass('active');
            $(this).addClass('active');
            $('.chat[data-chat = '+findChat+']').addClass('active-chat');
        }
    });

    /****************************************END******************************************/

    // Search for channel
    try {

        var $search = $('#search');
        var $search_button = $('#button-search');
        var $input = $('#input-search');

        $search_button.on('click', function() {
            console.log("Channel search button clicked");
        });

        $input.on('keydown', function(event) {
            if(event.keyCode == 13) $search_button.click();
        });

    } catch(e) {
        console.log("Error loading search elements:", e);
    }

    // Sending message
    try {

        var $msg_button = $('.button_id_submit');
        var $message_input = $('.write input.message');

        $msg_button.on('click', function() {
            console.log("Message sent");
        });

        $message_input.on('keydown', function(event) {
            if(event.keyCode == 13) $msg_button.click();
        });

    } catch(e) {
        console.log("Error loading sending elements:", e);
    }

});