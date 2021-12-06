# WALK≡DAY Visual Arts Gallery
This is the __code repository__ of a web app mainly built in _JavaScript_ that is used to run a digital art gallery.  

<img src="https://raw.githubusercontent.com/awalkaday/awalkaday-art/master/assets/icons/awalkaday_art-web_overview.PNG" alt="website overview demo">  

## Highlights
1. __Easy__ setup and __free__ digital art gallery web app.
2. __No complex code__ changes required. Just upload your pictures to the repository.
3. __Responsive & fast__ display for __web and mobile__ devices.

## Quick Start
If you have basic knowledge about web development and you like photography, then this open-source project may help you setup a web application to showcase all your creations without much effort.  

**Follow the steps below and your website would be live in no time:**

1. Fork this repo by hitting the `Fork` button at the top right corner.
2. Enable _Github Pages_ from the repo settings.
3. Upload your pictures to `images` directory. (You may do that on github.com itself or you may clone and push the images to your repo.)
4. Add your own custom domain in `CNAME` file or just remove the file if you don't own a domain and use the default domain that GitHub provides.
5. Update `baseurl` field in `_config.yml` file with whatever domain you used in step #4.
6. And that's it, your web application is set. To view, go to [awalkaday.art](https://awalkaday.art) (or whatever you have in the CNAME file) and if you don't have one, you can go to [[yourusername].github.io/awalkaday](https://yourusername.github.io/awalkaday).

And, of course, you can modify the words that are shown on the landing page's footer in `_config.yml` file as well as few other settings like your social media icons, contact form, etc.  

<img src="https://raw.githubusercontent.com/awalkaday/awalkaday-art/master/assets/icons/awalkaday_art-web_footer.PNG" alt="website footer demo">  
 
## Tips
The website is set up as a [npm](https://www.npmjs.com) package with [gulp](https://gulpjs.com/) to automate image resizing and thumbnail generation.   
You can just do the following before you push your images to GitHub:

1. Fork and then clone the project to your computer.
2. Go inside the project's local folder `$ cd awalkaday-art`.
3. Install all dependencies by running `$ npm install`. This step might take some time while automatically downloading and installing recent versions of [NodeJS](https://nodejs.org/en/), [ImageMagick](https://imagemagick.org/index.php), [Git](https://git-scm.com/), [Python](https://www.python.org/), Build Tools for your IDE like [Node.js for Visual Studio](https://visualstudio.microsoft.com/vs/features/node-js/) and other required dependencies.
4. Copy all your pictures (if possible in JPG file format, the largest size available, straight from your camera or original files) and put them inside `images` directory.
5. Run `$ gulp` on the command-line inside the git folder in order to resize the images and to generate thumbnails.
6. Push your local changes to _github.com_ by using `$ git add --all`, then send a [signed commit](https://docs.github.com/en/github/authenticating-to-github/managing-commit-signature-verification/signing-commits) `$ git commit -S -m "a short and descriptive commit message"` and finally update your remote code repo on GitHub by using `$ git push origin master`.  

## Credits
__Forked__ from: [rampatra/photography](https://github.com/rampatra/photography) — Enhanced for [Jekyll](https://jekyllrb.com/) by [Ram  Patra](https://github.com/rampatra) — Code reused under [GPL-3.0 License](https://raw.githubusercontent.com/rampatra/photography/master/LICENSE).   
__Template__: [Multiverse by HTML5 UP](https://html5up.net/multiverse) — Web designer and developer: [ajlkn](https://aj.lkn.io/).  
__Fonts__: [Source Sans 3](https://github.com/awalkaday/awalkaday-art/blob/master/assets/fonts/SourceSans3-Regular.ttf) — Used under: [SIL Open Font License](https://raw.githubusercontent.com/daqhris/daqhris.github.io/master/style/font/license/OFL.txt).  
__Icons__ made from: [OpenMoji](https://openmoji.org/about/) — Remixed under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/legalcode).  

## Copyrights
__Code__ License: [European Union Public License 1.2](https://raw.githubusercontent.com/awalkaday/awalkaday-art/master/LICENSE).    
__Content__ Legal Rights: [Creative Commons Zero License: Public Domain (CC0 1.0)](https://creativecommons.org/publicdomain/zero/1.0/legalcode).  
__Website__ owner & developer: [Chris-Armel](https://daqhris.com) [(@daqhris)](https://github.com/daqhris).  

<img src="https://raw.githubusercontent.com/awalkaday/awalkaday-art/master/assets/icons/awalkaday-logo-1x1.png" alt="website logo" width="200" height="200">  