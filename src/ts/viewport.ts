/**
 * Check for when user stops resizing viewport and fires event to all running typesetbot instances.
 */

 // Initialize ready and onload variables.
typesetbotWindowSet('ready', false);
typesetbotWindowSet('onload', false);

document.addEventListener('DOMContentLoaded', function() {
    typesetbotWindowSet('ready', true);
    const event = new Event('typesetbot--interactive');

    // Dispatch the event to all TSB instances.
    document.dispatchEvent(event);
});

(window as any).onload = function() {
    typesetbotWindowSet('onload', true);
    const event = new Event('typesetbot--complete');

    // Dispatch the event to all TSB instances.
    document.dispatchEvent(event);
};

// Set global typesetbot variables in window
typesetbotWindowSet('viewport--lastWidth', (window as any).innerWidth);
typesetbotWindowSet('viewport--delta', 200);
typesetbotWindowSet('viewport--rtime', null);
typesetbotWindowSet('viewport--timeout', false);

(window as any).onresize = typesetbotCheckResize;

/**
 * Indicate that viewport is being resize and start checking when resize is ended.
 */
function typesetbotCheckResize() {
    if (typesetbotWindowGet('viewport--lastWidth') !== (window as any).innerWidth) {

        document.body.classList.add('typesetbot-viewport');

        typesetbotWindowSet('viewport--rtime', new Date().getTime());
        if (typesetbotWindowGet('viewport--timeout') === false) {
            typesetbotWindowSet('viewport--timeout', true);
            setTimeout(function() {
                typesetbotEndResize();
            }, typesetbotWindowGet('viewport--delta'));
        }

        typesetbotWindowSet('viewport--lastWidth', (window as any).innerWidth);
    }
}

/**
 * Check if enough time has passed to end resize.
 */
function typesetbotEndResize() {
    if ((new Date().getTime() - typesetbotWindowGet('viewport--rtime')) < typesetbotWindowGet('viewport--delta')) {
        setTimeout(typesetbotEndResize, typesetbotWindowGet('viewport--delta'));
        return;
    }

    typesetbotWindowSet('viewport--timeout', false);
    document.body.classList.remove('typeset-viewport');

    const event = new Event('typesetbot-viewport--reize');

    // Dispatch the event to all TSB instances.
    document.dispatchEvent(event);
}

/**
 * Get variable from window.
 *
 * @param   key Some key
 * @returns     Some value
 */
function typesetbotWindowGet(key: string): any {
    if ((window as any).typesetbot == null) {
        (window as any).typesetbot = {};
    }

    return (window as any).typesetbot[key];
}

/**
 * Set variable in window.
 *
 * @param key   Some key
 * @param value Some value
 */
function typesetbotWindowSet(key: string, value: any) {
    if ((window as any).typesetbot == null) {
        (window as any).typesetbot = {};
    }

    (window as any).typesetbot[key] = value;
}
