<h1 align="center">TypesetBot</h1>
<p align="center">
    <img alt="Rax" src="logo.png" width="300">
</p>
<p align="center">
Small project to dynamically typeset text on the web.
</p>
<p align="center">
<a href="https://travis-ci.org/CoffeeIO/TypesetBot"><img alt="TypesetBot" src="https://travis-ci.org/CoffeeIO/TypesetBot.svg?branch=master"></a>
<a href="https://www.codacy.com/app/mgapcdev/TypesetBot/dashboard"><img src="https://api.codacy.com/project/badge/Grade/c098136ef81345b78c480ee695314a21"/></a>
<a href="LICENSE"><img alt="TypesetBot" src="https://img.shields.io/aur/license/yaourt.svg"></a>
<br>
<a href="https://www.npmjs.com/package/typesetbot"><img alt="typesetbot" src="https://img.shields.io/npm/v/typesetbot.svg"></a>
<a href="https://www.npmjs.com/package/typesetbot"><img alt="typesetbot" src="https://img.shields.io/npm/dm/typesetbot.svg"></a>
<br>
<a href="https://waffle.io/CoffeeIO/TypesetBot"><img alt="TypesetBot" src="https://badge.waffle.io/CoffeeIO/TypesetBot.svg?columns=all"></a>
</p>

Your browser uses a very simple line breaking algorithm to arrange the text on your screen, TypesetBot changes this arrangement using am algorithm inspired by TeX's total-fit algorithm. TypesetBot looks at all the lines in your paragraph and finds the best line breaks for all of them. This process reduces whitespace between words and applies hyphenations only when necessary, so the text becomes more readable.

TypesetBot is designed with the web in mind: written in JavaScript for wide support, query selector to only typeset the correct elements, recalculates the typesetting when the viewport size changes, support for inline tags, easy installs with CDN and NPM, hyphenation for 39 languages. 

<p align="center">
    <img alt="Quick Example" src="http://i.imgur.com/LTlGqgp.png" width="500">
</p>

## Table of contents
- [Install](#install)
    - [NPM](#npm)
    - [CDN](#cdn)
- [License](#license)
    - [Commercial license](#commercial-license)
    - [Open source license](#open-source-license)
- [Basic Usage](#basic-usage)
- [Features](#features)
    - [Line breaking](#line-breaking)
    - [Hyphenation](#hyphenation)
    - [Viewport changes](#viewport-changes)
    - [Tag support](#tag-support)
- [Performance](#performance)
    - [Quality](#quality)
    - [Performance examples](#performance-examples)
- [Dependencies](#dependencies)

 
## Install

### NPM

```bash
# Install
$ npm install typesetbot

# (optional) Download hyphenation library and patterns, for example US english
$ npm install hypher hyphenation.en-us
```

### CDN

```html
<link rel="stylesheet" href="https://rawgit.com/MGApcDev/TypesetBot/master/dist/typesetbot.min.css">
<script type="text/javascript" src="https://rawgit.com/MGApcDev/TypesetBot/master/dist/typesetbot.js"></script>

<!-- (optional) -->
<!-- hyphenation library -->
<script type="text/javascript" src="https://cdn.rawgit.com/bramstein/hypher/v0.2.5/dist/jquery.hypher.js"></script>
<!-- hyphenation pattern for US english -->
<script type="text/javascript" src="https://cdn.rawgit.com/bramstein/hyphenation-patterns/dc01d58a/dist/browser/en-us.js"></script>
```

Full list of hyphenation patterns: https://github.com/bramstein/hyphenation-patterns/tree/master/dist/browser

## License

### Commercial license

If you want to use TypesetBot to develop commercial sites, themes, projects, and applications, the Commercial license is the appropriate license. With this option, your source code is kept proprietary. If you want to purchase a TypesetBot Commercial License contact: mgapcdev@gmail.com

### Open source license

If you are creating an open source application under a license compatible with the [GNU GPL license v3](https://www.gnu.org/licenses/gpl-3.0.html), you may use TypesetBot under the terms of the GPLv3.

## Basic usage

```html
<html>
<head>
    <link rel="stylesheet" href="node_modules/typesetbot/dist/typesetbot.min.css">
    <script type="text/javascript" src="node_modules/typesetbot/dist/typesetbot.js"></script>
    
    <script type="text/javascript" src="node_modules/hypher/dist/jquery.hypher.js"></script>
    <script type="text/javascript" src="node_modules/hyphenation.en-us/lib/en-us.js"></script>
    <script type="text/javascript">
        TypesetBot.attach('body');
    </script>
</head>
<body>
    <p>Lorem ipsum...</p>
</body>
</html>
```

## Features
### Line breaking
The line breaking algorithm implemented, is inspired by TeX's implementation of the total-fit algorithm. The algorithm was detailed in the [Digital Typography by Donald Knuth](https://www.amazon.com/Digital-Typography-Lecture-Notes-Donald-ebook/dp/B01MQGA5KF/ref=mt_kindle?_encoding=UTF8&me=).
The implementation was modified to make better sense in the web domain. This required some rethinking some fundamentatal elements of the algorithm we get: use of query selectors,  html inline-tag support, handle viewport changes and feeding preprocessed data. 

### Query selectors
TypesetBot can only work on paragraph elements (```<p>```). TypesetBot doesn't have to change your entire website, using query selectors like found in jQuery to select a single paragraph or a bigger selector to typeset multiple paragraphs.
Using 'body' you can typeset all paragraphs on a page or '.content' to find all paragraphs within the content class.

### Hyphenation
TypesetBot don't require the use of hyphenation libraries, but hyphenation of words can be used to greatly improve the line breaking quality. Hyphenation is done with [hypher](https://github.com/bramstein/hypher) and uses the open source TeX hyphenation patterns and can hyphenate text in various languages. Languages supported can be found in [hyphenation-patterns by bramstein](https://github.com/bramstein/hyphenation-patterns/tree/master/dist/browser)

### Viewport changes
With responsive design being a important thing on the web, I think it only made sense to consider that the user might change the viewport size by dragging the browser or going from portrait to landscape on mobile. When using the _TypesetBot.attach()_ we recalculate the line breaking every time the viewport changes and with some clever CSS the transition is hard to notice.

### Tag support
On of the biggest changes that had to be made from the total-fit algorithm, is the support for inline tags in paragraphs. The support allows the user to wrap text in style changing tags like ```<span>``` or ```<b class="someClass">``` these can be used as you would expect, even in the middle of a word and with styles that change the font-size.

### Settings
TypesetBot has been made to be very adjustable as there is no perfect settings. Some of these settings can increase the performance and behavior so it's important to expose these to the user.
```javascript
{
    // Algorithm.
    alignment: 'justify', // Other options are 'ragged-right', 'ragged-left' and 'ragged-center'

    hyphenPenalty: 50, // Penalty for line-breaking on a hyphen
    hyphenPenaltyRagged: 500, // Penalty for line-breaking on a hyphen when using ragged text
    flagPenalty: 3000, // Penalty when current and last line had flag value 1. Reffered to as 'α'
    fitnessClassDemerit: 3000, // Penalty when switching between ratio classes. Reffered to as 'γ'
    demeritOffset: 1, // Offset to prefer fewer lines by increasing demerit of "~zero badness lines"

    // "the value of q is increased by 1 (if q < 0) or decreased by 1 (if q > 0) until a feasible solution is
    //  found." - DT p.114
    loosenessParam: 0, // If zero we find to solution with fewest total demerits. Reffered to as 'q'
    absoluteMaxRatio: 5, // Max adjustment ratio before we give up on finding solutions

    maxRatio: 2, // Maximum acceptable adjustment ratio. Referred to as 'p'
    minRatio: -1, // Minimum acceptable adjustment ratio. Less than -1 will make the text too closely spaced.

    // Hyphen.
    hyphenLanguage: 'en-us', // Language of hyphenation patterns to use
    hyphenLeftMin: 2, // Minimum number of letters to keep on the left side of word
    hyphenRightMin: 2, // Minimum number of letters to keep on the right side of word

    // 4 classes of adjustment ratios.
    fitnessClass: [-1, -0.5, 0.5, 1, Infinity],

    // Font.
    spaceUnit: 'em', // Space width unit, em is relative to font-size
    spaceWidth: 1/3, // Ideal space width
    spaceStretchability: 1/6, // How much can the space width stretch
    spaceShrinkability: 1/9, // How much can the space width shrink

    // Inline element that the program will unwrap from paragraphs as they could disrupt the line breaking.
    unwrapElements: ['img'],


    // Dynamic width.

    // Allow the paragraph to account for overlapping elements, turn this off if you know there's no overlapping
    // element to gain performance.
    dynamicWidth: true,
    // Pixel increment of vertical search, higher better performance, lower more accurate result.
    dynamicWidthIncrement: 5,

    // Functions.
    ratio (idealW, actualW, wordCount, shrink, stretch, settings) { // Adjustment ratio
        if (actualW < idealW) {
            return (idealW - actualW) / ((wordCount - 1) * stretch);
        }

        return (idealW - actualW) / ((wordCount - 1) * shrink);
    },
    badness (ratio, settings) { // Badness calculation
        if (ratio == null || ratio < settings.minRatio) {
            return Infinity;
        }

        return 100 * Math.pow(Math.abs(ratio), 3) + 0.5;
    },
    demerit (badness, penalty, flag, settings) { // Demerit calculation
        var flagPenalty = flag ? settings.flagPenalty : 0;
        if (penalty >= 0) {
            return Math.pow(settings.demeritOffset + badness + penalty, 2) + flagPenalty;
        } else if (penalty === -Infinity) {
            return Math.pow(settings.demeritOffset + badness, 2) + flagPenalty;
        } else {
            return Math.pow(settings.demeritOffset + badness, 2) - Math.pow(penalty, 2) + flagPenalty;
        }
    },
    debug: false // Print performance information
}
```

## Performance

### Quality
The easiest way to compare quality of the typesetting is to look at the adjustment ratios that indecates how tight or loose a line is. Ideally we this value to be zero so the word-spacing is exactly 1/3 em, plain HTML can only increase word-spacing is necesarry, while TypesetBot can both increase and decrease it. The point is to degrace visual impact, so we strongly prefer to have 2 ratios of value 1, over having 1 ratio of 2 and 1 ratio of 0. TypesetBot even tries to minizing the jump between a loose line and tight line.

Normal HTML has an easier time line breaking on wider lines, but on smaller viewports it starts to fall apart, so we can see how this is affected as multiple viewports. 

Reference: [here](https://codepen.io/MGApcDev/pen/YxoaWe)
#### 900px wide
<p align="center">
    <img alt="Quick Example" src="http://i.imgur.com/HHBbtmF.gif">
</p>

#### 500px wide
<p align="center">
    <img alt="Quick Example" src="http://i.imgur.com/GTyyZ1a.gif">
</p>

#### 200px wide
<p align="center">
    <img alt="Quick Example" src="http://i.imgur.com/SUpnELJ.gif">
</p>

### Execution time
TypesetBot constructs a list of objects for each paragraph on the first run, the list contains information for every word and hyphenation in the paragraph, so it's an expensive task, but only occurs on a new page load.
The second run occurs when the users adjusts the viewport and all the linebreaking and additional hyphenations needs to be calculated. 

Reference: [here](http://codepen.io/MGApcDev/pen/QvOpeq)
#### Performance examples

| Description | First run | Second run |
| --- | --- | --- |
| 1 paragraph, 441 words, w. hyphenation | 143ms | 137ms |
| 1 paragraph, 441 words, w/o. hyphenation | 109ms | 74ms |
| 1 paragraph, 882 words, w. hyphenation | 270ms | 209ms |
| 1 paragraph, 882 words, w/o. hyphenation | 170ms | 123ms |
| 2 paragraph, 441 words, w. hyphenation | 275ms | 147ms |
| 2 paragraph, 441 words, w/o. hyphenation | 130ms | 111ms |
| 1 paragraph, 441 words, w. hyphenation, w/o. dynamic width | 53ms | 51ms |



## Dependencies
- **jQuery** --> [jQuery write less, do more](https://jquery.com/)
- **Queue.js** --> [JavaScript queues](http://code.stephenmorley.org/javascript/queues/)

(optional)
- **hypher** --> [A fast and small JavaScript hyphenation engine](https://github.com/bramstein/hypher)
- **hyphenation-patterns** --> [Hyphenation patterns for use with Hypher](https://github.com/bramstein/hyphenation-patterns)


---

Copyright &copy; 2017 Mathias Grundtvig Andreasen (MGApcDev).
