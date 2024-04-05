export function changeChat(value, name) {
    if (value == true) {
        $('body.vtt').addClass(name);
    } else {
        $('body.vtt').removeClass(name);
    }
}