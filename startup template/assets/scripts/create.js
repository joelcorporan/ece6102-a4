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
        console.log("button for create clicked")
    });

});