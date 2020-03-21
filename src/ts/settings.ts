/**
 * Class for managing the program settings.
 */
class TypesetBotSettings {

    // Copy of the custom user settings.
    private _tsb: TypesetBot;
    private _customSettings: object;

    // ------------------------------------------------------------------------
    // SETTINGS ---------------------------------------------------------------
    // ------------------------------------------------------------------------

    // Hyphenation. -----------------------------------------------------------

    // Language of hyphenation patterns to use
    hyphenLanguage: string = 'en-us';

    // Minimum number of letters to keep on the left side of word
    hyphenLeftMin : number = 2;

    // Minimum number of letters to keep on the right side of word
    hyphenRightMin: number = 2;

    // Algorithm. -------------------------------------------------------------

    // Other options are 'left', 'right' and 'center'.
    alignment: string = 'justify';

    // Penalty for line-breaking on a hyphen
    hyphenPenalty      : number = 50;

    // Penalty for line-breaking on a hyphen when using ragged text
    hyphenPenaltyRagged: number = 500;

    // Penalty when current and last line had flag value 1.
    flagPenalty        : number = 3000;

    // Penalty when switching between ratio classes.
    fitnessClassDemerit: number = 3000;

    // 4 classes of adjustment ratios.
    fitnessClasses: number[] = [-1, -0.5, 0.5, 1, Infinity];

    // Offset to prefer fewer lines by increasing demerit of "~zero badness lines"
    demeritOffset      : number = 1;

    // Max adjustment ratio before we give up on finding solutions
    absoluteMaxRatio: number = 5;

    // Maximum acceptable adjustment ratio.
    maxRatio: number = 2;
    // Minimum acceptable adjustment ratio. Less than -1 will make the text too closely spaced.
    minRatio: number = -1;

    // Tags inside element that might break the typesetting algorithm
    unsupportedTags: string[] = ['BR', 'IMG'];

    // Font. ------------------------------------------------------------------

    // Ideal space width
    spaceWidth         : number = 1 / 3;

    // How much can the space width stretch
    spaceStretchability: number = 1 / 6;

    // How much can the space width shrink
    spaceShrinkability : number = 1 / 9;

    // Debug mode: prints performance stats. -----------------------------------

    debug: boolean = false;

    /**
     * @param tsb
     * @param settings Optional settings object.
     */
    constructor(tsb: TypesetBot, settings: object = null) {
        this._tsb = tsb;
        this._customSettings = settings;
        this._mergeSettings(settings);
    }

    /**
     * Merge custom settings with a default set of settings.
     *
     * @param settings The custom overwrite settings
     */
    private _mergeSettings = function(settings: object = null) {
        if (settings == null) {
            return;
        }

        for (const [key, value] of Object.entries(settings)) {
            if (this[key] === undefined) {
                this._tsb.logger.warn('Unknown settings key "' + key +'"');
            }

            this[key] = value;
        }
    }
}
