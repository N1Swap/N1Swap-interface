const fs = require('fs')
const parse = require('csv-parse');
const path = require('path');
const util = require('util');

const readdir = util.promisify(fs.readdir);
const stat = util.promisify(fs.stat);
const stringify = require('csv-stringify')

const csv_path = './public/locales/un_translate.csv';
const already_translate_csv_path = './public/locales/translate.csv';

let total_result = [];

let chars = [
    [
        "{t('",
        "')}"
    ],
    [
        "{t(\"",
        "\")}"
    ],
    [
        "tpure(\"",
        "\""
    ],
    [
        "tpure('",
        "'"
    ]
]

function saveResult(text) {
    if (text && text.length > 0) {
        total_result.push(text);
    }
}

function findTranlateText(filedir) {
    var content = fs.readFileSync(filedir, 'utf-8');

    chars.map(c=>{
        let result = findChars(content,c[0],c[1]);
        if (result.length > 0) {
            result.map(one=>{
                saveResult(one)
            })
        }
    })

}


function findChars(text,before,end) {

    let chats = [];
    let r = findChar(text,before,end);

    while(r['status'] == 'find') {
        console.log('找到了数据',r['text']);
        chats.push(r['text']);
        r = findChar(r['rest_text'],before,end);
    }
    return chats;

}

function findChar(text,before,end) {
    let find_l,find_r;
    find_l = text.indexOf(before);

    let result = {
        'status' : 'unfind'
    };

    if (find_l != -1) {
        let temp_text = text.slice(find_l+before.length);
        find_r = temp_text.indexOf(end);
        if (find_r != -1) {

            console.log('find数据',find_l+before.length,find_r);
            let r_pos = find_l+before.length+find_r;

            result['status'] = 'find';
            result['text'] = text.slice(find_l+before.length,r_pos);
            result['rest_text'] = text.slice(r_pos+end.length);
        }
    }

    return result
}


const fileDisplay = async function(filePath){
    //根据文件路径读取文件，返回文件列表
    let files = await readdir(filePath)

    //遍历读取到的文件列表
    const promises = files.map(async function(filename){
        //获取当前文件的绝对路径
        var filedir = path.join(filePath, filename);
        //根据文件路径获取文件信息，返回一个fs.Stats对象
        var stats = await stat(filedir)

        var isFile = stats.isFile();//是文件
        var isDir = stats.isDirectory();//是文件夹
        if(isFile){
            console.log(filedir);
　　　　　　　　　　　　　　　　　// 读取文件内容
            findTranlateText(filedir);
        }
        if(isDir){
            await fileDisplay(filedir);//递归，如果是文件夹，就继续遍历该文件夹下面的文件
        }

    });


    await Promise.all(promises);

}

const compareWithTranslated = async function(total_result) {

    const parser = fs
          .createReadStream(already_translate_csv_path)
          .pipe(parse({columns: true}));

    let records = [];
    let translated_map = {};
    let all_translated = [];
    for await (const record of parser) {
        // Work with each record
        records.push(record['En'])
        translated_map[record['En']] = 1;
        all_translated.push(record);
    }

    let lang_keys =[];
    if (all_translated.length > 0) {
        lang_keys = Object.keys(all_translated[0]);
    }


    console.log('已经被翻译过的文字',records);
    console.log('现在扫描到的文字',total_result);

    ///已经翻译的
    let already_translated = [];

    ///还没有翻译的
    let un_translated = [];

    ///更改上次翻译的数据
    let need_remove_translated = [];
    let need_remove_translated_map = {};

    let new_scan_map = {}
    total_result.map(one=>{
        if (translated_map[one]) {
            already_translated.push(one)
        }else {
            un_translated.push(one)
        }
        new_scan_map[one] = 1;
    });

    records.map(one=>{
        if (new_scan_map[one]) {

        }else {
            // need_remove_translated.push(one);
            need_remove_translated_map[one] = 1;
        }
    })

    ////对比现在的文字
    console.log('already_translated',already_translated)
    console.log('un_translated',un_translated)
    console.log('need_remove_translated',need_remove_translated)

    ////更新已经翻译的文字
    if (all_translated.length > 0) {

        let update_translated = [];
        all_translated.map(one=>{
            if (need_remove_translated_map[one['En']]) {

            }else {
                update_translated.push(one);
            }
        })


        console.log('update_translated',update_translated)
        let new_translated = [];
        update_translated.map(one=>{
            let row = []
            lang_keys.map(k=>{
                row.push(one[k])
            })
            new_translated.push(row);
        })
        console.log('new_translated',new_translated)

        let columns = {};
        lang_keys.map(one=>{
            columns[one] = one;
        })

        ///写入文件（更新翻译）
        const temp_csv_file = './public/locales/translate.csv';
        stringify(new_translated, { header: true, columns: columns }, (err, output) => {
          if (err) throw err;
          fs.writeFile(temp_csv_file, output, (err) => {
            if (err) throw err;
            console.log('translate_temp.csv saved.');
          });
        });
    }

    ///写入文件还没有翻译的
    columns = {
      en: 'En',
    };
    let data = []
    un_translated.map(one=>{
        data.push([one])
    })

    const csv_file = './public/locales/un_translate.csv';
    stringify(data, { header: true, columns: columns }, (err, output) => {
      if (err) throw err;
      fs.writeFile(csv_file, output, (err) => {
        if (err) throw err;
        console.log('my.csv saved.');
      });
    });

    return records
}


const loop = async function() {


    ///扫描的目录
    let loop_dirs = [
        'components',
        'pages'
    ];

    ///寻找翻译
    const promises =loop_dirs.map(async dir=>{
        var filePath = path.resolve('./'+dir);
        await fileDisplay(filePath);
    })

    await Promise.all(promises);

    console.log('执行到这里');
    console.log('total_result2',total_result)

    ///对比已经翻译过的插件中翻译的部分
    compareWithTranslated(total_result);
    return;

    let columns = {
      en: 'En',
    };

    let data = []
    total_result.map(one=>{
        data.push([one])
    })

    stringify(data, { header: true, columns: columns }, (err, output) => {
      if (err) throw err;
      fs.writeFile(csv_path, output, (err) => {
        if (err) throw err;
        console.log('my.csv saved.');
      });
    });



}

loop();

// compareWithTranslated({});

