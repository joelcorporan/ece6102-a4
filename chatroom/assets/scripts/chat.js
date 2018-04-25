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



$(document).ready(function() {

    try {
        const wrapper = document.querySelector(".input-wrapper"),
            textInput = document.querySelector("input[type='text']");
            
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

function createChannel() {

    const xhr = new XMLHttpRequest();
    var body = JSON.stringify({name: $('.input-wrapper input[type=text]').val()})

    xhr.open("POST", '/channels');
    xhr.setRequestHeader("Content-type", "application/json");
    
    xhr.onreadystatechange = () => {
        if(xhr.readyState === 4){
            if(xhr.status >= 200 && xhr.status <= 299){
                setTimeout(function() {
                    $("#button-create").removeClass("onclic").addClass("validate");
                        setTimeout(function() {
                            $("#button-create").removeClass("validate");
                            setTimeout(function() {
                                var response = JSON.parse(xhr.response);
                                window.location.href = `/channels/${response['channel']}`
                            }, 1000 );
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

    xhr.open("GET", `/search?channel=${channel}`);
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
