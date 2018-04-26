// $('.chat[data-chat=person2]').addClass('active-chat');
// $('.person[data-chat=person2]').addClass('active');

$('.left .person').mousedown(function(){
    // window.location.href = window.location.origin + `/channels/${$(this).attr('data-chat')}`
    // window.location.href = window.location.origin + `/channels/`
    // console.log(window.location.origin)
    // if ($(this).hasClass('.active')) {
    //     return false;
    // } else {
    //     var findChat = $(this).attr('data-chat');
    //     var personName = $(this).find('.name').text();
    //     $('.right .top .name').html(personName);
    //     $('.chat').removeClass('active-chat');
    //     $('.left .person').removeClass('active');
    //     $(this).addClass('active');
    //     $('.chat[data-chat = '+findChat+']').addClass('active-chat');
    // }
});

$('body').on('click', '.people .person', function() {
    window.location.href = window.location.origin + `/channels/${$(this).data('chat')}`
});


try {
    var search = document.getElementById('search');
    var button = document.getElementById('button-search');
    var input = document.getElementById('input-search');

    function loading() {
        // search.classList.add('loading');

        searchChannel(search);
        
        // setTimeout(function() {
        //     search.classList.remove('loading');
        // }, 1500);
    }

    button.addEventListener('click', function() {
        if ($(input).val() != "") {
            searchChannel($(input).val(), search);
        }
    });

    input.addEventListener('keydown', function(event) {
        if(event.keyCode == 13) loading();
    });

} catch(e) {
    console.log(e)
}

function getStatus() {
    var $chatRoom = $('.chat.active-chat');
    var $length = $('.chat.active-chat').find('div.bubble').length;
    if ($length > 0) {
        var $lastTime = $('.chat.active-chat').find('div.bubble').last();
        $lastTime = $lastTime.data('time');

        const xhr = new XMLHttpRequest();

        xhr.open("GET", `/messages/${$chatRoom.data('chat')}?current=${$length}&time=${$lastTime.toString()}`);
        xhr.setRequestHeader("Content-type", "application/json");
        
        xhr.onreadystatechange = () => {
            if(xhr.readyState === 4){
                if(xhr.status >= 200 && xhr.status <= 299){
                    var chats = JSON.parse(xhr.response)
                    chats.forEach(function(chat) {
                        $chatRoom.append(`<div class="bubble you" data-time="${chat.timestamp}"> 
                                            <h6 class="sender"> ${chat.email} </h6>
                                            <p> ${ chat.message } </p>
                                        </div>`);
                    });

                    if (chats.length > 0) {
                        $chatRoom.scrollTop($chatRoom.prop("scrollHeight"));
                    }
                }
                setTimeout(getStatus, 1000);
            }
        };

        xhr.send(null);
    }
}


$(document).ready(function() {

    try {
        getStatus();

    } catch(e) {
        console.log(e)
    }

    // Sending message

    try {

        var $msg_button = $('.button_id_submit');
        var $message_input = $('.write input.message');
        var $chatRoom = $('.chat.active-chat');

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

            if(event.keyCode == 13)  {
                console.log("Enter")
                $msg_button.click();
            }
        });

    } catch(e) {
        console.log(e)
    }
    
    try {
        const wrapper = document.querySelector(".input-wrapper"),
            textInput = document.querySelector("input[type='text'].create");
            
        textInput.addEventListener("keyup", event => {
            wrapper.setAttribute("data-text", event.target.value);
        });


    } catch(e) {
        console.log(e)
    }
    $( "#button-create" ).click(function() {
        if($('.input-wrapper input[type=text]').val() !== "") {
            $( "#button-create" ).addClass( "onclic", 250, createChannel);
        }
    });
  
});


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

function createChannel() {

    const xhr = new XMLHttpRequest();
    var body = JSON.stringify({name: $('.input-wrapper input[type=text]').val()})

    xhr.open("POST", '/channels');
    xhr.setRequestHeader("Content-type", "application/json");
    
    xhr.onreadystatechange = () => {
        if(xhr.readyState === 4){
            if(xhr.status >= 200 && xhr.status <= 299){
                setTimeout(function() {
                    // $("#button-create").removeClass("onclic").addClass("validate");
                        setTimeout(function() {
                            // $("#button-create").removeClass("validate");
                            setTimeout(function() {
                                $("#button-create").removeClass("onclic").addClass("validate");
                                var response = JSON.parse(xhr.response);
                                window.location.href = `/channels/${response['channel']}`
                            }, 15000 );
                        }, 1250 );
                }, 1000 );

            } else {
                $("#button-create").removeClass("onclic").addClass("invalidate");
                    setTimeout(function() {
                        $("#button-create").removeClass("invalidate");
                }, 1250 );
            }
        }
    };

    xhr.send(body);
}


function searchChannel(channel, search) {

    var $channels = $('.people');

    const xhr = new XMLHttpRequest();
    var body = JSON.stringify({name: $('.input-wrapper input[type=text]').val()})

    xhr.open("GET", `/searchChannel?channel=${channel}`);
    xhr.setRequestHeader("Content-type", "application/json");
    
    xhr.onreadystatechange = () => {
        if(xhr.readyState === 4){
            if(xhr.status >= 200 && xhr.status <= 299){
                $template = $($('#channelItem').html())

                $template.find('span.name').text(xhr.response);
                $template.data('chat', xhr.response);

                $channels.append($template);

            } else {
                console.log(xhr)
            }
        }

        // search.classList.remove('loading');
    };

    xhr.send(body);
}


    // textInput.addEventListener("keyup", event => {
    //     msg_button.setAttribute("value", event.target.value);
    // });
    //     var msg_button = document.getElementById('msg_button');
    //     var ch = $('span')
    //     var ch_name = document.getElementsByClassName('span')[0].innerHTML;
    //     console.log(ch_name)
    //     msg_button.addEventListener('click', function(){
    //         var msg = msg_button.getAttribute("value");
    //         console.log(msg);





