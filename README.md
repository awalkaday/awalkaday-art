# awalkaday.art Photography Collection
This is the __code repository__ of a web gallery, mainly built in _JavaScript_, that is used to exhibit a digital photo collection.  

<img src="https://raw.githubusercontent.com/awalkaday/awalkaday-art/master/assets/icons/awalkaday_art-web_overview.png" alt="website overview screenshot">  

## Highlights
1. __Easy__ setup and __lightweight__ web gallery.
2. __No complex code__ changes required. 
3. __Responsive & fast__ display for various devices.

## Quick Start
If you have basic knowledge of web development, then this open-source project may help you set up a web application to showcase all your visual creations without much effort.  

Follow the steps below and your site will be live in no time:  

1. Fork this repo by clicking the `Fork` button at the top right corner.
2. Enable _GitHub Pages_ in the code repository settings.
3. Upload your pictures to the `images` directory. (You may do that via _GitHub.com_ or clone/push the images to your repo.)
4. Add your own web domain in the `CNAME` file or just delete the file if you don't own a domain in order to use the default domain that _GitHub_ provides.
5. Update the `baseurl` field inside `_config.yml` with the web domain used in step #4.
6. And that's it, your web app is set and ready. To view the results, visit the link configured in the CNAME file. In this particular case, the web address is [awalkaday.art](https://awalkaday.art).

It is possible to modify the short site description shown on the front-page's bottom area by editing the `_config.yml` file.  
Site navigation pointers, such as social media icons, contact methods, external links, license documents, legal statements, ... are located in the footer section. 

<img src="https://raw.githubusercontent.com/awalkaday/awalkaday-art/master/assets/icons/awalkaday_art-web_footer.png" alt="website footer screenshot">  
 
## Build Instructions
The essential tool required to build the website is an [NPM](https://www.npmjs.com) package: [gulp](https://gulpjs.com/) which is used to automate image resizing and thumbnail generation.  

Do the following before you push your images to a remote code repository:

1. Fork and then, clone the project to your computer.
2. Go inside the project's root folder `$ cd awalkaday`.
3. Install all Node Package Manager (npm) dependencies by running `$ npm install`. This step will take some time required to download and install recent versions of [NodeJS](https://nodejs.org/en/), [ImageMagick](https://imagemagick.org/index.php), [Git](https://git-scm.com/), [Python](https://www.python.org/), Build Tools for your IDE like [Node.js for Visual Studio](https://visualstudio.microsoft.com/vs/features/node-js/) and other specified dependencies.
4. Copy all your photographs (if possible: in JPG file format, of the largest size available, straight from your camera memory card) and place them inside the `images` directory.
5. Run `$ gulp` on the command line inside the _git_ folder in order to resize the images and generate thumbnails.
6. Add your local code changes to a remote server by using `$ git add --all` then, follow up with a [signed commit](https://docs.github.com/en/github/authenticating-to-github/managing-commit-signature-verification/signing-commits) `$ git commit -S -m "a short and descriptive commit message"` and lastly, update your remote code repo with the command `$ git push origin master`.  

## Credits
__Forked__ from: [rampatra/photography](https://github.com/rampatra/photography) — Enhanced for [Jekyll](https://jekyllrb.com/) by [Ram  Patra](https://github.com/rampatra) — Code reused under [GPL-3.0 License](https://raw.githubusercontent.com/rampatra/photography/master/LICENSE).   
__Template__: [Multiverse by HTML5 UP](https://html5up.net/multiverse) — Web designer and developer: [ajlkn](https://aj.lkn.io/).  
__Fonts__: [Source Sans 3](https://github.com/awalkaday/awalkaday-art/blob/master/assets/fonts/SourceSans3-Regular.ttf) — Used under: [SIL Open Font License](https://raw.githubusercontent.com/daqhris/daqhris.github.io/master/style/font/license/OFL.txt).  
__Icons__ made from: [OpenMoji](https://openmoji.org/about/) — Remixed under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/legalcode).  

## Copyrights
__Code__ Open-source License: [European Union Public License 1.2](https://raw.githubusercontent.com/awalkaday/awalkaday-art/master/LICENSE).    
__Content__ Legal Rights: [Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)](https://creativecommons.org/licenses/by-nc/4.0/).  
__Website__ Owner & Developer: [Chris-Armel](https://daqhris.com) [(@daqhris)](https://github.com/daqhris).  

<img src="https://raw.githubusercontent.com/awalkaday/awalkaday-art/master/assets/icons/awalkaday-logo-1x1.png" alt="website logo" width="200" height="200">  
