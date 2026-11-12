
# DEPRECATED
## AdactiveAsia will be maintaining this application from 13th December:
 - [Link Here](https://github.com/adactiveasia/adsum-react-components)

![react-badge](https://img.shields.io/badge/react-js-53c1de.svg?style=flat)
![touch-badge](https://img.shields.io/badge/for-touch--screen-ff69b4.svg?style=flat)
![licence-badge](https://img.shields.io/github/license/mashape/apistatus.svg?style=flat)
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lernajs.io/)

<p align="center">
  <a href="http://adactive.com">
    <img alt="babel" src="https://user-images.githubusercontent.com/6003532/41638658-21e38a0c-748d-11e8-93d2-8a3d1a4ee6a7.png" width="546">
  </a>
</p>

# Touch-React-Components
- React components for touch screens enable application.

## Why ?

This is a mono-repo has been create to share and collaborate on components for interactive screens.

## What's inside ?

 - [adsum-map](https://github.com/AdactiveSAS/adsum-react-components/tree/master/packages/adsum-map)
 - [adsum-steplist](https://github.com/AdactiveSAS/adsum-react-components/tree/master/packages/adsum-steplist)
 - [adsum-loadingScreen](https://github.com/AdactiveSAS/adsum-react-components/tree/master/packages/adsum-loadingScreen)
 - [adsum-az-scroller](https://github.com/AdactiveSAS/adsum-react-components/tree/master/packages/adsum-az-scroller)
 - [adsum-carousel](https://github.com/AdactiveSAS/adsum-react-components/tree/master/packages/adsum-carousel)
 - [adsum-clock](https://github.com/AdactiveSAS/adsum-react-components/tree/master/packages/adsum-clock)
 - [adsum-itemCarousel](https://github.com/AdactiveSAS/adsum-react-components/tree/master/packages/adsum-itemCarousel)
 - [adsum-keyboard](https://github.com/AdactiveSAS/adsum-react-components/tree/master/packages/adsum-keyboard)
 - [adsum-screensaver](https://github.com/AdactiveSAS/adsum-react-components/tree/master/packages/adsum-screensaver)
 - [adsum-search](https://github.com/AdactiveSAS/adsum-react-components/tree/master/packages/adsum-search)
 - [adsum-utils](https://github.com/AdactiveSAS/adsum-react-components/tree/master/packages/adsum-utils)
 - [adsum-qrCode](https://github.com/AdactiveSAS/adsum-react-components/tree/master/packages/adsum-qrCode)

## Stack

 - React
 - Redux
 - Flow

## How to contribute ?

### Getting Started

1. Open a terminal in the root folder

2. Install Lerna globally

    `npm install --global lerna`    

3. Set up your git environment

    `git config --global credential.helper wincred`

    `git config --global user.name "name"`

    `git config --global user.email yourEmail`

    *For more Info: https://git-scm.com/book/en/v2/Getting-Started-First-Time-Git-Setup

4. Login to Adactive NPM Account

    `npm login`

    **To check for Adactive credentials with Adactive team

### To add a new component
1. Create a new branch from develop

    `git checkout -b feature/componentName`

2. Create a new folder name 'adsum-component' in packages. For example to create a keyboard component:

    `adsum-keyboard`

3. In the coponent folder, init the following items as shown:

    - package.json
    ````
    {
      "name": "@adactive/arc-keyboard",
      "version": "0.0.1",
      "description": "Adsum Keyboard Component",
      "main": "index.js",
      "author": "yourName <yourEmail>",
      "license": "UNLISENCED",
      "readmeFilename": "README.md",
      "repository": {
        "type": "git",
        "url": "git://github.com/AdactiveSAS/adsum-react-components.git"
      },
      "bugs": {
        "url": "https://github.com/AdactiveSAS/adsum-react-components.git/issues"
      },
      "scripts": {},
      "publishConfig": {
        "access": "public"
      },
      "keywords": [
        "adsum",
        "react",
        "redux"
      ]
    }
    ````
    ** Replace 'keyboard' with the name of your component<br/>

    ````
    "publishConfig": {
        "access": "public"
    },
    ````
    ** This properties set the repository to a public repository. To create a private repository, remove this property from package.json.

    - README.md
    - Changelog.md

4. Start developing
5. Submit for PR
6. Once approved, run the following command:

    `Lerna publish`
