// http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/

(function () {
    'use strict';
    var lastTime = 0;
    (['webkit', 'moz']).forEach(function (key) {
        window.requestAnimationFrame = window.requestAnimationFrame || window[key + 'RequestAnimationFrame'] || null;
        window.cancelAnimationFrame = window.cancelAnimationFrame || window[key + 'CancelAnimationFrame'] || null;
    });
    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function (callback) {
            var currTime = Date.now(),
                timeToCall = Math.max(0, 16 - (currTime - lastTime)),
                id = window.setTimeout(function () { callback(currTime + timeToCall); }, timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    }
    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function (id) {
            window.clearTimeout(id);
        };
    }
}());