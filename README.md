<p style="float:right">
    <img alt="Rax" align="right" src="logo.png" width="300">
</p>

<div style="float: left; width: calc(100% - 310px)">
<h1 >TypesetBot</h1>
    <p>Small project to dynamically typeset text on the web.</p>

<p align="">
<a href="https://travis-ci.org/CoffeeIO/TypesetBot"><img alt="TypesetBot" src="https://travis-ci.org/CoffeeIO/TypesetBot.svg?branch=master"></a>
<a href="https://www.codacy.com/app/mgapcdev/TypesetBot/dashboard"><img src="https://api.codacy.com/project/badge/Grade/c098136ef81345b78c480ee695314a21"/></a>
<br>
<a href="https://www.npmjs.com/package/typesetbot"><img alt="typesetbot" src="https://img.shields.io/npm/v/typesetbot.svg"></a>
<a href="https://www.npmjs.com/package/typesetbot"><img alt="typesetbot" src="https://img.shields.io/npm/dm/typesetbot.svg"></a>
</p>

See [coffeeio.com](http://coffeeio.com/) for complete docs and demos.
</div>
<div style="clear: both">


## Install


### Download
- CSS

- JavaScript

### CDN


## License


### Commercial license

If you want to use TypesetBot to develop commercial sites, themes, projects, and applications, the Commercial license is the appropriate license. With this option, your source code is kept proprietary. Purchase a Flickity Commercial License at [coffeeio.com](http://coffeeio.com/)

### Open source license

If you are creating an open source application under a license compatible with the [GNU GPL license v3](https://www.gnu.org/licenses/gpl-3.0.html), you may use TypesetBot under the terms of the GPLv3.



## Usage


More examples found at [coffeeio.com](http://coffeeio.com/)

```html
<head>
    <!-- Get hyphenation library -->
    <script type="text/javascript" src="https://unpkg.com/@coffeeio/hypher@1.0.0/dist/hypher.js"></script>
    <!-- Get 'en-us' hyphenation patterns -->
    <script type="text/javascript" src="https://unpkg.com/@fluid-project/hyphenation-patterns@0.2.2-dev.20181115T211247Z.d313a52/dist/browser/en-us.js"></script>

    <!-- Get TypesetBot dependencies (latest version) -->
    <link rel="stylesheet" href="https://unpkg.com/typesetbot/dist/typesetbot.min.css">
    <script type="text/javascript" src="https://unpkg.com/typesetbot/dist/typesetbot.min.js"></script>

    <!-- Initialize TypesetBot -->
    <script type="text/javascript">
        let tsb = new TypesetBot(
            '.container',                 // Query selector
            { 'hyphenLanguage': 'en-us' } // Settings
        );
    </script>
</head>
<body>
    <p class="container">Lorem ipsum...</p>
    <p class="container">Lorem ipsum...</p>
</body>
```

## Features


### Line breaking
The line breaking algorithm implemented, is inspired by TeX's implementation of the total-fit algorithm.
The implementation is modified specifically for the web domain. This required some rethinking some fundamentatal elements of the algorithm we get: use of query selectors,  html inline-tag support, handle viewport changes.

### Query selectors
TypesetBot can be either initialized with a query selector, a Node or NodeList.

### Hyphenation
TypesetBot does not require the use of hyphenation libraries, but hyphenation of words can be used to greatly improve the line breaking quality. Hyphenation is done with [hypher](https://github.com/bramstein/hypher) and uses the open source TeX hyphenation patterns and can hyphenate text in various languages. Languages supported can be found in [hyphenation-patterns by bramstein](https://github.com/bramstein/hyphenation-patterns/tree/master/dist/browser)

### Viewport changes
With responsive design being a important thing on the web, I think it only made sense to consider that the user might change the viewport size by dragging the browser or going from portrait to landscape on mobile. When using the _TypesetBot.attach()_ we recalculate the line breaking every time the viewport changes and with some clever CSS the transition is hard to notice.

### Tag support
On of the biggest changes that had to be made from the total-fit algorithm, is the support for inline tags in paragraphs. The support allows the user to wrap text in style changing tags like `<span>` or `<b class="someClass">` these can be used as you would expect, even in the middle of a word and with styles that change the font-size.

## Settings


Default settings. Any setting can be overwritten.
Most common settings to adjust is `hyphenLanguage` and `alignment`.

```js
{
    // Hyphenation. -----------------------------------------------------------

    // Language of hyphenation patterns to use
    hyphenLanguage: string = 'en-us';

    // Minimum number of letters to keep on the left side of word
    hyphenLeftMin : number = 2;

    // Minimum number of letters to keep on the right side of word
    hyphenRightMin: number = 2;

    // 4 classes of adjustment ratios.
    fitnessClasses: number[] = [-1, -0.5, 0.5, 1, Infinity];

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

    // Space width unit, em is relative to font-size
    spaceUnit          : string = 'em';

    // Ideal space width
    spaceWidth         : number = 1 / 3;

    // How much can the space width stretch
    spaceStretchability: number = 1 / 6;

    // How much can the space width shrink
    spaceShrinkability : number = 1 / 9;

    // Debug mode: prints performance stats. -----------------------------------

    debug: boolean = true;

}
```

---

Copyright &copy; 2020 CoffeeIO (Mathias Grundtvig Andreasen).

</div>
