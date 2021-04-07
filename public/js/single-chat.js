var input = document.querySelector("input");
var emoji = document.querySelector('.emoji');
var picker = new EmojiButton({
    position: "left-start"
});
picker.on('emoji', function (emoji) {
    input.value += emoji;
})

emoji.addEventListener('click', function () {
    picker.pickerVisible ? picker.hidePicker() : picker.showPicker(input);
})


var chat_message = document.querySelectorAll('.chat-message');
var box_context_menu = document.querySelector('.box-context-menu');
chat_message.forEach((value) => {
    value.addEventListener('click', (e) => {
        if (box_context_menu.getAttribute('data-tog') == "true") {
            box_context_menu.removeAttribute('data-tog');
            box_context_menu.setAttribute('data-tog', "false");
            box_context_menu.style.display = "none";

        } else {
            box_context_menu.removeAttribute('data-tog');
            box_context_menu.setAttribute('data-tog', "true");
            box_context_menu.style.top = e.y + "px";
            box_context_menu.style.left = (e.x + 10) + "px";
            box_context_menu.style.display = "block";
        }
        console.log(box_context_menu.getAttribute('data-tog'))
    })
})
