export const dispatchCustomEvent = (e) => {
    if (document && e && e.type) {
        const event = new CustomEvent(e.type, {detail: e.data, bubbles: true, cancelable: true});
        document.dispatchEvent(event);
    }
};
