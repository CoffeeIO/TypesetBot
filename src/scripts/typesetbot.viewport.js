TypesetBot.viewport = (function(obj) {

    window.load = false;

    $(window).on("load", function () {
        window.load = true;
    });

    var rtime;
    var timeout = false;
    var delta = 200;
    $(window).resize(function() {
        $('body').addClass('typeset-viewport');
        rtime = new Date();
        if (timeout === false) {
            timeout = true;
            setTimeout(resizeend, delta);
        }
    });

    function resizeend() {
        if (new Date() - rtime < delta) {
            setTimeout(resizeend, delta);
        } else {
            timeout = false;
            console.log('change viewport');
            console.time('typesetting');
            TypesetBot.runAllAttached();
            $('body').removeClass('typeset-viewport');
            console.timeEnd('typesetting');
        }
    }

    return obj;
})(TypesetBot.viewport || {});
