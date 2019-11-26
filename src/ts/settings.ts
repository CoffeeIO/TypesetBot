/**
 * Class for managing the program settings.
 */
class TypesetBotSettings {

    // Copy of the custom user settings.
    private _tsb: TypesetBot;
    private _customSettings: object;

    /**
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

    // ------------------------------------------------------------------------
    // SETTINGS ---------------------------------------------------------------
    // ------------------------------------------------------------------------

    // Algorithm. -------------------------------------------------------------
    alignment: string = 'justify'; // Other options are 'ragged-right', 'ragged-left' and 'ragged-center'

    hyphenPenalty      : number = 50; // Penalty for line-breaking on a hyphen
    hyphenPenaltyRagged: number = 500; // Penalty for line-breaking on a hyphen when using ragged text
    flagPenalty        : number = 3000; // Penalty when current and last line had flag value 1. Reffered to as 'α'
    fitnessClassDemerit: number = 3000; // Penalty when switching between ratio classes. Reffered to as 'γ'
    demeritOffset      : number = 1; // Offset to prefer fewer lines by increasing demerit of "~zero badness lines"

    // "the value of q is increased by 1 (if q < 0) or decreased by 1 (if q > 0) until a feasible solution is
    //  found." - DT p.114
    loosenessParam  : number = 0; // If zero we find to solution with fewest total demerits. Reffered to as 'q'
    absoluteMaxRatio: number = 5; // Max adjustment ratio before we give up on finding solutions

    maxRatio: number = 2; // Maximum acceptable adjustment ratio. Referred to as 'p'
    minRatio: number = -1; // Minimum acceptable adjustment ratio. Less than -1 will make the text too closely spaced.

    // Hyphen. ----------------------------------------------------------------
    hyphenLanguage: string = 'en-us'; // Language of hyphenation patterns to use
    hyphenLeftMin : number = 2; // Minimum number of letters to keep on the left side of word
    hyphenRightMin: number = 2; // Minimum number of letters to keep on the right side of word

    // 4 classes of adjustment ratios.
    fitnessClass: number[] = [-1, -0.5, 0.5, 1, Infinity];

    // Font. ------------------------------------------------------------------
    spaceUnit          : string = 'em'; // Space width unit, em is relative to font-size
    spaceWidth         : number = 1 / 3; // Ideal space width
    spaceStretchability: number = 1 / 6; // How much can the space width stretch
    spaceShrinkability : number = 1 / 9; // How much can the space width shrink

    // Tags inside element that might break the typesetting algorithm
    unsupportedTags: string[] = ['BR', 'IMG'];

    // Settings functions. ----------------------------------------------------

    /**
     * Calculate adjustment ratio.
     *
     * @param idealW
     * @param actualW
     * @param wordCount
     * @param shrink
     * @param stretch
     * @returns         The adjustment ratio
     */
    ratio = function(idealW: number, actualW: number, wordCount: number, shrink: number, stretch: number): number {
        if (actualW < idealW) {
            return (idealW - actualW) / ((wordCount - 1) * stretch);
        }

        return (idealW - actualW) / ((wordCount - 1) * shrink);
    }

    /**
     * Calculate the badness score.
     *
     * @param ratio The adjustment ratio
     * @returns     The badness
     */
    badness = function(ratio: number): number {
        if (ratio == null || ratio < this.minRatio) {
            return Infinity;
        }

        return 100 * Math.pow(Math.abs(ratio), 3) + 0.5;
    }

    /**
     * Calculate the demerit.
     *
     * @param badness
     * @param penalty
     * @param flag
     * @returns       The line demerit
     */
    demerit = function(badness: number, penalty: number, flag: boolean): number {
        const flagPenalty = flag ? this.flagPenalty : 0;
        if (penalty >= 0) {
            return Math.pow(this.demeritOffset + badness + penalty, 2) + flagPenalty;
        } else if (penalty === -Infinity) {
            return Math.pow(this.demeritOffset + badness, 2) + flagPenalty;
        } else {
            return Math.pow(this.demeritOffset + badness, 2) - Math.pow(penalty, 2) + flagPenalty;
        }
    }
}
