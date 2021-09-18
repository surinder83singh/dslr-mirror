const path = require("path");
const fs = require("fs");

const ROOT = path.join(__dirname, './');
const PUBLIC = path.join(ROOT, 'public');
const TPL = path.join(ROOT, 'src', 'tpl');

const products = [];
/*
const PRODUCTS = path.join(PUBLIC, 'images/products');
let dir = fs.readdirSync(PRODUCTS);

dir.forEach(file=>{
    //console.log("file", file)
    const infoFilePath = path.join(PRODUCTS, file, 'info.json');
    if(/^[._]/.test(file) || !fs.existsSync(infoFilePath))
        return
    const info = JSON.parse(fs.readFileSync(infoFilePath)+"")
    info.images = [];
    info.dir = file;
    fs.readdirSync(path.join(PRODUCTS, file)).forEach(img=>{
        if(/.jpg$/i.test(img))
            info.images.push(img)
    })
    products.push(info)
})
*/

class Helper {
    /*
    static get products(){
        return products;
    }
    static watch(file){
        this._file = file;
        let dir = fs.readdirSync(TPL);
        const onFileChange = this.onFileChange.bind(this);
        dir.map(file=>{
            if(!/\.ejs$/.test(file) && this._file != file)
                return
            fs.watchFile(path.join(TPL, file), onFileChange)
        })
    }
    static onFileChange(){
        let filePath = path.join(TPL, this._file);
        let c = fs.readFileSync(filePath)
        //if(!c.includes('<!--TS-STAMP>'))
        //    c += '<!--TS-STAMP></TS-STAMP-->';
        //c.replace(/<\!\-\-TS\-STAMP>[^<]*<\/TS\-STAMP\-\->/, `<!--TS-STAMP>${Date.now()}</TS-STAMP-->`)
        fs.writeFileSync(filePath, c);
    }
    */
}

//Helper.watch('index.ejs');

module.exports = Helper