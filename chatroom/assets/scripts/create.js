$(function() {

    const $wrapper = $(".input-wrapper"),
          $textInput = $("input[type='text'].create"),
          $button = $("#button-create");
    
    try {
            
        $textInput.on("keyup", event => {
            $wrapper.attr("data-text", event.target.value);
        });


    } catch(e) {
        console.log(e)
    }

    $button.click(function() {
        if($textInput.val() !== "") {
            $button.addClass("onclic", 250, createChannel);
        }
    });


    function createChannel() {

        $userInput = $('.input-wrapper input[type=text]').val();

        const xhr = new XMLHttpRequest();
        var body = JSON.stringify({name: $userInput});

        xhr.open("POST", '/create');
        xhr.setRequestHeader("Content-type", "application/json");
        
        xhr.onreadystatechange = () => {
            if(xhr.readyState === 4){
                if(xhr.status >= 200 && xhr.status <= 299){
                    setTimeout(function() {
                        $button.removeClass("onclic").addClass("validate");
                            var response = JSON.parse(xhr.response);
                            window.location.href = `/channels/${response['channel']}`
                    }, 15000 );

                } else {
                    $button.removeClass("onclic").addClass("invalidate");
                        setTimeout(function() {
                            $button.removeClass("invalidate");
                    }, 1250 );
                }
            }
        };

        xhr.send(body);
    }
});