const fs = require('fs')
const parse = require('csv-parse');

const csv_path = './public/locales/translate.csv';
const save_path = './public/locales/';


function removeUnuseChars(str) {
    str = str.replace(/\n/g, '')
    return str.trim();
}

var translate_map = {}

function saveTranslate(lang,key,value) {
    let lang_lower = lang.toLowerCase();
    
    // console.log('测试',lang,key,value);

    if (!translate_map[lang_lower]) {
        translate_map[lang_lower] = {}
    }

    translate_map[lang_lower][key] = value;
}

var parser = parse({columns: true}, function (err, records) {
    // console.log(records);
    records.map(one=>{
        // console.log('record-one',one);
        Object.keys(one).map(lang=>{
            // console.log('record-one',lang,removeUnuseChars(one[lang]));
            if (lang) {

                let lang_lower = lang.toLowerCase();
                let key = removeUnuseChars(one['En']);
                let value = removeUnuseChars(one[lang]);

                saveTranslate(lang,key,value)
            }


        })
    })

    Object.keys(translate_map).map(lang=>{
        let data = JSON.stringify(translate_map[lang]);
        fs.writeFileSync(save_path+lang+'.json', data);
    })

    // console.log('translate_map',translate_map);


});

fs.createReadStream(csv_path).pipe(parser);
