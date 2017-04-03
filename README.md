<h1 align="center">TypesetBot</h1>
<p align="center">
    <img alt="Rax" src="http://i.imgur.com/E0WUums.gif" width="300">
</p>
<p align="center">
Small project to dynamically typeset text on the web.
</p>
<p align="center">
<a href="https://travis-ci.org/MGApcDev/TypesetBot"><img alt="TypesetBot" src="https://travis-ci.org/MGApcDev/TypesetBot.svg?branch=master"></a>
<a href="https://www.codacy.com/app/mgapcdev/TypesetBot/dashboard"><img src="https://api.codacy.com/project/badge/Grade/c098136ef81345b78c480ee695314a21"/></a>
<a href="https://waffle.io/MGApcDev/TypesetBot"><img alt="TypesetBot" src="https://img.shields.io/waffle/label/MGApcDev/TypesetBot.svg"></a>
<a href="LICENSE"><img alt="TypesetBot" src="https://img.shields.io/aur/license/yaourt.svg"></a>
</p>

## Installing

```bash
$ npm install typesetbot
```

_or_

```bash
$ git clone https://github.com/MGApcDev/TypesetBot.git
```

_or_

[Just link it, no download! (see example)](http://codepen.io/MGApcDev/pen/jBdzKG)

## Basic usage
```html
<html>
<head>
    <link rel="stylesheet" href="/dist/main.min.css">
    <script type="text/javascript" src="/dist/mainWithPatterns.min.js"></script>
    <script type="text/javascript">
        TypesetBot.attach('body');
    </script>
</head>
<body>
    <p>Lorem ipsum...</p>
</body>
```

## Dependencies
- **jQuery** --> [jQuery write less, do more](https://jquery.com/)
- **hypher** --> [A fast and small JavaScript hyphenation engine](https://github.com/bramstein/hypher)
- **hyphenation-patterns** --> [Hyphenation patterns for use with Hypher](https://github.com/bramstein/hyphenation-patterns)
- **Queue.js** --> [JavaScript queues](http://code.stephenmorley.org/javascript/queues/)

Copyright &copy; 2016 Mathias Grundtvig Andreasen (MGApcDev). Licensed under the terms of the [GPLv3 license](LICENSE.md).
