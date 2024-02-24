"use strict";

// Initializes custom popovers for pages that use them.

let popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));

let popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
    return new bootstrap.Popover(popoverTriggerEl);
});