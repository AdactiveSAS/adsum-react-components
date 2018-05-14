<p align="center">
  <a href="http://adactive.com">
    <img alt="babel" src="./logo.jpg" width="546">
  </a>
</p>

# Adsum-React-Components
- Mono repositories for Adsum React Components
  
  
## Getting Started

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
    
## To add a new component
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
