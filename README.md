<h1 align="center">TypesetBot</h1>
<p align="center">
    <img alt="Rax" src="logo.png" width="300">
</p>
<p align="center">
Small project to dynamically typeset text on the web.
</p>
<p align="center">
<a href="https://travis-ci.org/MGApcDev/TypesetBot"><img alt="TypesetBot" src="https://travis-ci.org/MGApcDev/TypesetBot.svg?branch=master"></a>
<a href="https://www.codacy.com/app/mgapcdev/TypesetBot/dashboard"><img src="https://api.codacy.com/project/badge/Grade/c098136ef81345b78c480ee695314a21"/></a>
<a href="https://waffle.io/MGApcDev/TypesetBot"><img alt="TypesetBot" src="https://img.shields.io/waffle/label/MGApcDev/TypesetBot.svg"></a>
<a href="LICENSE"><img alt="TypesetBot" src="https://img.shields.io/aur/license/yaourt.svg"></a>
<br>
<a href="https://www.npmjs.com/package/typesetbot"><img alt="typesetbot" src="https://img.shields.io/npm/v/typesetbot.svg"></a>
<a href="https://www.npmjs.com/package/typesetbot"><img alt="typesetbot" src="https://img.shields.io/npm/dm/typesetbot.svg"></a>
</p>

Typeset html... TeX inspired... genereic... designed for web...
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
    - [Viewport](#viewport)
    - [Tag support](#tag-support)
- [Performance](#performance)
    - [Quality](#quality)
    - [Execution time](#execution-time)
- [Dependencies](#dependencies)

 
## Install

### NPM

```bash
// Install
$ npm install typesetbot
// Create distribution with language all languages (creates typesetbot.js)
$ typesetbot build
// or
$ typesetbot build en-us
```



### CDN

```html
<link rel="stylesheet" href="https://rawgit.com/MGApcDev/TypesetBot/master/dist/main.min.css">
<script type="text/javascript" src="https://rawgit.com/MGApcDev/TypesetBot/master/dist/typesetbot.js"></script>
```

## License

### Commercial license

If you want to use TypesetBot to develop commercial sites, themes, projects, and applications, the Commercial license is the appropriate license. With this option, your source code is kept proprietary. If you want to purchase an TypesetBot Commercial License contact: mgapcdev@gmail.com

### Open source license

If you are creating an open source application under a license compatible with the [GNU GPL license v3](https://www.gnu.org/licenses/gpl-3.0.html), you may use TypesetBot under the terms of the GPLv3.

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
</html>
```

See more in --> [examples](examples)


## Features
### Line breaking

### Hyphenation

### Viewport

### Tag support

## Performance

### Quality

#### 900px wide

#### 500px wide

#### 200px wide

### Execution time

#### First run

#### Second run

## Dependencies
- **jQuery** --> [jQuery write less, do more](https://jquery.com/)
- **hypher** --> [A fast and small JavaScript hyphenation engine](https://github.com/bramstein/hypher)
- **hyphenation-patterns** --> [Hyphenation patterns for use with Hypher](https://github.com/bramstein/hyphenation-patterns)
- **Queue.js** --> [JavaScript queues](http://code.stephenmorley.org/javascript/queues/)

---

Copyright &copy; 2017 Mathias Grundtvig Andreasen (MGApcDev).
