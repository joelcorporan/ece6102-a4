$(function() {

    var $window = $(window),
        $body = $('body'),
        $channelItem = $('#channelItem'),
        $delta = 2;

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
        var $currentChannel = $('.channel.active');

        $msg_button.on('click', function() {
            if($message_input.val() != "") {
                publishMessage($message_input.val(), $chatRoom.data('chat'), function(error, result) {
                    if(!error) {
                        $chatRoom.append(`<div class="bubble me" data-time=${result.timestamp}>${result.message}</div>`);
                        var time = new Date(new Date(result.timestamp).toString());
                        var hour = time.getHours();
                        var minutes = time.getMinutes();

                        var currentTime = `${hour >= 12 ? hour -= 12 : hour == 0 ? 12 : hour}:${minutes} ${hour > 12 ? "PM": "AM"}`;

                        if ($currentChannel.find('span.preview').length > 0) {
                            $currentChannel.find('span.preview').text(result.message);
                            $currentChannel.find('span.time').text(currentTime);
                        } else {
                            $currentChannel.append(`<span class="time">${currentTime}</span>`);
                            $currentChannel.append(`<span class="preview">${result.message}</span>`);
                        }

                        $currentChannel.find('span.preview').text(result.message);
                        $currentChannel.find('span.time').text(`${hour >= 12 ? hour -= 12 : hour == 0 ? 12 : hour}:${minutes} ${hour > 12 ? "PM": "AM"}`)
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

        xhr.open("GET", `/search?channel=${channel}`);
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

        xhr.open("POST", `/channels/${channel}/messages`);
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

        var $chats = $chatRoom.find('div.bubble');
        
        if ($chats.length > 0) {
            var $lastTime = $chatRoom.find('div.bubble').last();
                $lastTime = $lastTime.data('time');

            const xhr = new XMLHttpRequest();

            xhr.open("GET", `/channels/${$chatRoom.data('chat')}/messages?current=${$chats.length}&time=${$lastTime.toString()}`);
            xhr.setRequestHeader("Content-type", "application/json");
            
            xhr.onreadystatechange = () => {
                if(xhr.readyState === 4){
                    if (xhr.status == 409) solveConflict(xhr.getResponseHeader("remaining"));

                    else if(xhr.status >= 200 && xhr.status <= 299){
                        $messages = JSON.parse(xhr.response);

                        addNewMessages($chats.slice($chats.length), $messages, function() {
                            setTimeout(getStatus, 250);
                        });
                    }
                }
            };
            xhr.send(null);
        }
    }

    function addNewMessages(chats, newChats, callback) {

        newChats.forEach(function(chat, index1) {
            if ($email != chat.email) {
                binaryInsert(chat, chats);
            }
        });

        if (newChats.length > 0) $chatRoom.scrollTop($chatRoom.prop("scrollHeight"));

        callback();

    }

    function binaryInsert(chat, array, startVal, endVal){

        console.log(chat, array, startVal, endVal)

        var length = array.length;
        var start = typeof(startVal) != 'undefined' ? startVal : 0;
        var end = typeof(endVal) != 'undefined' ? endVal : length - 1;//!! endVal could be 0 don't use || syntax
        var m = start + Math.floor((end - start)/2);
        
        if(length == 0) {
            $chatRoom.append(`
                <div class="bubble you" data-time="${chat.timestamp}"> 
                    <h6 class="sender"> ${chat.email} </h6>
                    <p> ${ chat.message } </p>
                </div>`
            );
            return;
        }

        if(new Date(chat.timestamp) > new Date(array[end].data('time'))) {
            array.slice(end + 1, 0).wrapInner(value);
            return;
        }

        if(new Date(chat.timestamp) < new Date(array[start].data('time'))) {
            array.slice(start, 0,).wrapInner(value);
            return;
        }

        if(start >= end) {
            return;
        }

        if(new Date(chat.timestamp) < new Date(array[m].data('time'))) {
            binaryInsert(value, array, start, m - 1);
            return;
        }

        if(new Date(chat.timestamp) > new Date(array[m].data('time'))){
            binaryInsert(value, array, m + 1, end);
            return;
        }
    }

    function solveConflict(remaining) {

        var $chats = $chatRoom.find('div.bubble');

        var timeLookUp = $chats[$chats.length - (parseInt(remaining) - $chats.length) - 1];
        var lastTime = timeLookUp.data('time');

        const xhr = new XMLHttpRequest();

        xhr.open("GET", `/messages/${$chatRoom.data('chat')}?current=${$chat.length}&time=${$lastTime.toString()}`);
        xhr.setRequestHeader("Content-type", "application/json");

        xhr.onreadystatechange = () => {
            if(xhr.readyState === 4) {
                if (xhr.status == 409) solveConflict(xhr.getResponseHeader("remaining"));

                else if(xhr.status >= 200 && xhr.status <= 299) {
                    var newChats = JSON.parse(xhr.response);

                    addNewMessages($chats.slice($chats.length - (parseInt(remaining) - $chats.length) - 1), newChats, function() {
                        setTimeout(getStatus, 250);
                    });
                }
            }
        };
        xhr.send(null);
    }
});

$.fn.insertAt = function(elements, index){
    var children = this.children();
    if(index >= children.size()){
        this.append(elements);
        return this;
    }
    var before = children.eq(index);
    $(elements).insertBefore(before);
    return this;
};