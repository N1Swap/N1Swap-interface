export const pageReady = (func) => {
    window.addEventListener('load', function() {
        func();
    });
}