TypesetBot.viewport = (function(obj) {

    // Check if window is loaded.
    $(window).on("load", function () {
        TypesetBot.load = true;
    });


    // Check for when user stops resizing viewport.
    // **MODIFIED**
    // http://stackoverflow.com/a/5926068/2741279
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
            console.time('typesetting');
            $('body').removeClass('typeset-viewport');

            TypesetBot.runAllAttached();
            console.timeEnd('typesetting');
        }
    }

    return obj;
})(TypesetBot.viewport || {});
