const Jimp = require('jimp');

//var commentsFile = fs.readFileSync('./assets/comments/comments.txt').toString('utf-8').split('\n').filter(function(entry) { return entry.trim() != ''; });
function generateLightColor() {

  const r = Math.floor(Math.random() * 128 + 128).toString(16).padStart(2, '0');
  const g = Math.floor(Math.random() * 128 + 128).toString(16).padStart(2, '0');
  const b = Math.floor(Math.random() * 128 + 128).toString(16).padStart(2, '0');

  const hexCode = `#${r}${g}${b}`;
  
  return hexCode;
}

async function create(){
    // var textFiles = fs.readdirSync('./assets/titles/ready/');
    // for(let i = 0; i < textFiles.length; i++){
    //   var pinTitles = fs.readFileSync('./assets/titles/ready'+textFiles[i]).toString('utf-8').split('\n').filter(function(entry) { return entry.trim() != ''; });
    //   for(let j = 0; j < pinTitles.length; j++){

        const WIDTH = 1000;
        const HEIGHT = 1500;

        var textSTR = 'Hair Growth Natural'// text to add
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
        
        const lowerImage = await Jimp.read('./stockImages/ready/1bbae0d4f2987bdad678f65d62c0be0e.jpg');
        lowerImage.resize(970, 650);
        const x = (WIDTH - lowerImage.bitmap.width) / 2;
        const y = HEIGHT / 2;
        image.composite(lowerImage, x, y);
        
        const logo = await Jimp.read('./logo/ready/logo1.png');
        image.composite(logo,0,0);
        
        const button = await Jimp.read('./watchLogo/ready/watch1.png');
        image.composite(button,0,0);
        var title = textSTR.split(' ').join('_').toString()

        await image.writeAsync('./output/'+title+'.jpg');
    //   }
    // }
}

create();
