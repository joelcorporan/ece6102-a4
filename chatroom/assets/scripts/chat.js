$(function() {

    var $window = $(window),
        $body = $('body'),
        $channelItem = $('#channelItem');

    $body.on('click', '.channels .channel', function() {
        window.location.href = window.location.origin + `/channels/${$(this).data('chat')}`
    });

    try {
        var $search = $('#search'),
            $search_button = $('#button-search'),
            $input = $('#input-search'),
            $channels = $('.channels');

        $search_button.on('click', function() {
            if ($input.val() != "") {
                searchChannel($input.val(), $search);
            }
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
        var $chatRoom = $('.chat.active-chat');
        var $email = $chatRoom.data('email');

        $msg_button.on('click', function() {
            if($message_input.val() != "") {
                publishMessage($message_input.val(), $chatRoom.data('chat'), function(error, result) {
                    if(!error) {
                        $chatRoom.append(`<div class="bubble me" data-time=${result.timestamp}>${result.message}</div>`);
                        $message_input.val("")
                        $chatRoom.scrollTop($chatRoom.prop("scrollHeight"));
                    }
                });
            } 
        });

        $message_input.on('keydown', function(event) {
            $chatRoom.scrollTop($chatRoom.prop("scrollHeight"));

            if(event.keyCode == 13) $msg_button.click();
        });

    } catch(e) {
        console.log("Error loading sending elements:", e);
    }

    // Getting Messages
    try {
        getStatus();

    } catch(e) {
        console.log("Error loading real-time messages:", e);
    }

    function searchChannel(channel, search) {
        $search.addClass('loading');

        const xhr = new XMLHttpRequest();

        xhr.open("GET", `/searchChannel?channel=${channel}`);
        xhr.setRequestHeader("Content-type", "application/json");
        
        xhr.onreadystatechange = () => {
            if(xhr.readyState === 4){
                if(xhr.status >= 200 && xhr.status <= 299){
                    console.log(xhr.response)
                    $template = $($channelItem.html())

                    $template.find('span.name').text(xhr.response);
                    $template.data('chat', xhr.response);

                    $channels.append($template);

                    $('.no-channels').remove();
                } else {
                    console.log(xhr)
                }

                $search.removeClass('loading');
            }
        };

        xhr.send(null);
    }

    function publishMessage(text, channel, callback) {

        const xhr = new XMLHttpRequest();
        var body = JSON.stringify({text: text})

        xhr.open("POST", `/messages/${channel}`);
        xhr.setRequestHeader("Content-type", "application/json");
        
        xhr.onreadystatechange = () => {
            if(xhr.readyState === 4){
                if(xhr.status >= 200 && xhr.status <= 299){
                    callback(null, JSON.parse(xhr.response));
                } else {
                    callback(xhr.status, null);
                }
            }
        };

        xhr.send(body);
    }

    function getStatus() {

        var $length = $chatRoom.find('div.bubble').length;
        
        if ($length > 0) {
            var $lastTime = $chatRoom.find('div.bubble').last();
                $lastTime = $lastTime.data('time');

            const xhr = new XMLHttpRequest();

            xhr.open("GET", `/messages/${$chatRoom.data('chat')}?current=${$length}&time=${$lastTime.toString()}`);
            xhr.setRequestHeader("Content-type", "application/json");
            
            xhr.onreadystatechange = () => {
                if(xhr.readyState === 4){
                    if(xhr.status >= 200 && xhr.status <= 299){
                        var chats = JSON.parse(xhr.response);

                        chats.forEach(function(chat) {
                            if ($email != chat.email) {
                                $chatRoom.append(`
                                    <div class="bubble you" data-time="${chat.timestamp}"> 
                                        <h6 class="sender"> ${chat.email} </h6>
                                        <p> ${ chat.message } </p>
                                    </div>`
                                );
                            }
                        });

                        if (chats.length > 0) {
                            $chatRoom.scrollTop($chatRoom.prop("scrollHeight"));
                        }
                    }

                    setTimeout(getStatus, 250);
                }
            };
            xhr.send(null);
        }
    }

});