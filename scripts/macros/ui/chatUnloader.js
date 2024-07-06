export function chatUnloader(wrapped) {
    if (!this.rendered) return Promise.resolve();
    const maxMessageCount = game.settings.get('mba-premades', 'Chat Unloader Limit');
    if (this.collection.size <= CONFIG.ChatMessage.batchSize) return wrapped(event);
    const log = event.target;
    const messages = $(log).find('li.chat-message');
    let topMessageIndex = -1;
    const pct = log.scrollTop / log.scrollHeight;
    const chatViewTop = log.scrollTop + messages[0].offsetTop;
    let c = Math.trunc(messages.length * pct);
    if (messages[c].offsetTop < chatViewTop) {
        for (; c < messages.length; c++) {
            if (
                (messages[c].offsetTop <= chatViewTop && messages[c].offsetTop + messages[c].offsetHeight >= chatViewTop) ||
                (c - 1 >= 0 && messages[c].offsetTop >= chatViewTop && messages[c - 1].offsetTop + messages[c - 1].offsetHeight)
            ) {
                topMessageIndex = c;
                break;
            }
        }
    }
    else {
        for (; c >= 0; c--) {
            if (
                (messages[c].offsetTop <= chatViewTop && messages[c].offsetTop + messages[c].offsetHeight >= chatViewTop) ||
                (c - 1 >= 0 && messages[c].offsetTop >= chatViewTop && messages[c - 1].offsetTop + messages[c - 1].offsetHeight)
            ) {
                topMessageIndex = c;
                break;
            }
        }
    }
    if (topMessageIndex < 0) return Promise.resolve();
    if (topMessageIndex < (CONFIG.ChatMessage.batchSize / 4) && messages.length < this.collection.size) return this._renderBatch(this.element, CONFIG.ChatMessage.batchSize);
    else if (topMessageIndex > maxMessageCount) {
        const count = topMessageIndex - (maxMessageCount - 1);
        this._lastId = messages[count].dataset.messageId;
        messages.slice(0, count).remove();
    }
    return Promise.resolve();
}