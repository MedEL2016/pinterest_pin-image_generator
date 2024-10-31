const Jimp = require('jimp');
const process = require('process');
const fs = require('fs');
const generator = require('generate-password');
var nodeBase64 = require('nodejs-base64-converter');
const querystring = require("querystring")


var currentDir = process.cwd();

function generateLightColor() {
  const r = Math.floor(Math.random() * 128 + 128).toString(16).padStart(2, '0');
  const g = Math.floor(Math.random() * 128 + 128).toString(16).padStart(2, '0');
  const b = Math.floor(Math.random() * 128 + 128).toString(16).padStart(2, '0');
  
  const hexCode = `#${r}${g}${b}`;
  
  return hexCode;
}
function randomNumber(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function sleep(s){
  var ms = s * 1000;
  return new Promise(function(resolve){setInterval(resolve,ms)});
}

async function create(textSTR,imageFile,buttomLogo,watchLogo,outputfile,boardName){
        // imageFile ex: './hair/1bbae0d4f2987bdad678f65d62c0be0e.jpg'
        // buttomLogo ex: './components/logo/logo1.png'
        // watchLogo ex: './components/logo/watch1.png'
        // outputfile ex: '/location/file.jpg'
        const WIDTH = 1000;
        const HEIGHT = 1500;

        // var textSTR = 'Biotin Hair Growth Shampoo, Clinically Proven Scalp Treatment for Thinning Hair and Hair Loss, Gentle Formula with Natural Ingredients for Men and Women'// text to add
        
        function fontCheck(text){
          var font;
          if(text.length <= 80){
            font = './100.fnt';
          }else if(text.length <= 100){
            font = './90.fnt';
          }else if(text.length >= 100 && text.length <= 145){
            font = './80.fnt';
          }else if(text.length >= 145){
            font = './70.fnt';
          }
          return font;
        }


        const font = await Jimp.loadFont(fontCheck(textSTR).toString());

        var hexColorCode = generateLightColor()
        const image = await new Jimp(WIDTH, HEIGHT, hexColorCode); 
    
        image.print(
          font,
          0,
          0,
          {
            text: textSTR, 
            alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
            alignmentY:  textSTR.length >= 50 ? Jimp.VERTICAL_ALIGN_TOP : Jimp.VERTICAL_ALIGN_MIDDLE,
            size: 90,
            weight: "bold",
            color: '#000000'
          },
          WIDTH,
          HEIGHT / 2 
        );
        
        const lowerImage = await Jimp.read(imageFile); 
        lowerImage.resize(970, 650);
        const x = (WIDTH - lowerImage.bitmap.width) / 2; 
        const y = HEIGHT / 2;
        image.composite(lowerImage, x, y);
        
        const logo = await Jimp.read(buttomLogo);
        image.composite(logo,0,0);
        
        const button = await Jimp.read(watchLogo);
        image.composite(button,0,0);


        await image.writeAsync(outputfile);
}

async function run(){
  var boards = fs.readdirSync('./titles/ready/');
  var images = fs.readdirSync('./stockImages/ready/');
  var buttomlogoArr = fs.readdirSync('./logo/ready/');
  var watchLogoArr = fs.readdirSync('./watchLogo/ready/');
  var prev = fs.readFileSync('./prev_combinations.txt').toString('utf-8').split('\n').filter(function(entry) { return entry.trim() != ''; });

  for(let i = 0; i < boards.length; i++){
    var boardname = boards[i].split('.txt')[0].toString()
    var pinTitles = fs.readFileSync('./titles/ready/'+boards[i]).toString('utf-8').split('\n').filter(function(entry) { return entry.trim() != ''; });
    for(let j = 0; j < pinTitles.length; j++){
      for(let k = 0; k < images.length; k++){
        console.log( pinTitles[j]+' | '+images[k])
        if (!fs.existsSync('./output/'+boardname)){
          fs.mkdirSync('./output/'+boardname);
        }
        var genRandText = generator.generate({
          length: 5,
          numbers: true
          });
        if(prev.includes(pinTitles[j]+'|'+images[k])){continue;}
        // var watchLogoFile = './watchLogo/ready/'+watchLogoArr[Number(randomNumber(0,watchLogoArr.length))].toString()
        var watchLogoFile = './watchLogo/ready/watch1.png'
        //let pinTitlesBase64 = nodeBase64.encode(pinTitles[j].toString()) 
        //let plainText =  pinTitles[j].split(' ').join('_').toString()
        let encodedplainText = querystring.escape(pinTitles[j]);

        var outputfileSRT = './output/'+boardname+'/'+genRandText+'+'+encodedplainText+'.jpg';
        // var buttomLogoFile = './logo/ready/'+boards[j]+'.png'
        var buttomLogoFile = './logo/ready/logo1.png'
        await create(pinTitles[j],'./stockImages/ready/'+images[k],buttomLogoFile,watchLogoFile,outputfileSRT,boardname);
        fs.appendFile('prev_combinations.txt', pinTitles[j]+'|'+images[k]+'\n', function (err) {if (err) throw err; });
        // /await sleep(2)
      }
        
    }
  }
}

run()

