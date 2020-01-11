(window as any)['typesetbot--ready'] = false;
(window as any)['typesetbot--onload'] = false;

(function() {
    (window as any)['typesetbot--ready'] = true;
})();

(window as any).onload = function() {
    (window as any)['typesetbot--onload'] = true;
};

// Check for when user stops resizing viewport.
// **MODIFIED**
// http://stackoverflow.com/a/5926068/2741279



(window as any)['typesetbot-viewport--lastWidth'] = (window as any).innerWidth;
(window as any)['typesetbot-viewport--delta'] = 200;
(window as any)['typesetbot-viewport--rtime'] = null;
(window as any)['typesetbot-viewport--timeout'] = false;


(window as any).onresize = typesetbotCheckResize;

function typesetbotCheckResize() {

    // console.log('Resizing: ' + (window as any).innerWidth + ' --- ' + this.lastWidth);

    if ((window as any)['typesetbot-viewport--lastWidth'] !== (window as any).innerWidth) {

        document.body.classList.add('typesetbot-viewport');

        (window as any)['typesetbot-viewport--rtime'] = new Date().getTime();
        if ((window as any)['typesetbot-viewport--timeout'] === false) {
            // console.log('step2');

            (window as any)['typesetbot-viewport--timeout'] = true;
            setTimeout(function() {
                // console.log('timeout');

                typesetbotEndResize();
            }, (window as any)['typesetbot-viewport--delta']);
        }

        (window as any)['typesetbot-viewport--lastWidth'] = (window as any).innerWidth;
    }
}

function typesetbotEndResize() {
    // console.log('Called resize end');

    if ((new Date().getTime() - (window as any)['typesetbot-viewport--rtime']) < (window as any)['typesetbot-viewport--delta']) {
        setTimeout(typesetbotEndResize, (window as any)['typesetbot-viewport--delta']);
        return;
    }

    console.log('Call resize on text');


    (window as any)['typesetbot-viewport--timeout'] = false;
    document.body.classList.remove('typeset-viewport');
    // TypesetBot.runAllAttached();
}



