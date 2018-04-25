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


try {
    var search = document.getElementById('search');
    var button = document.getElementById('button');
    var input = document.getElementById('input');

    function loading() {
        search.classList.add('loading');
        
        setTimeout(function() {
            search.classList.remove('loading');
        }, 1500);
    }

    button.addEventListener('click', loading);

    input.addEventListener('keydown', function() {
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
    console.log("here")
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

function validate() {
    setTimeout(function() {
        $( "#button-create" ).removeClass( "onclic" );
        $( "#button-create" ).addClass( "validate", 450, upload_image );
    }, 2250 );
}


// HTTP Request
function updateCartInstance(url, type, callback) {
    const xhr = new XMLHttpRequest();
    var body;

    xhr.open(type, url);
    xhr.setRequestHeader("Content-type", "application/json");
    
    xhr.onreadystatechange = () => {
        if(xhr.readyState === 4){
            if(xhr.status >= 200 && xhr.status <= 299){


            } else {
                search.classList.add('error');
    
                setTimeout(function() {
                    search.classList.remove('error');
                }, 1500);
            }
        }
    };

    xhr.send(body);
}