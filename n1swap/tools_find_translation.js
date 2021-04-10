const fs = require('fs')
const parse = require('csv-parse');
const path = require('path');
const util = require('util');

const readdir = util.promisify(fs.readdir);
const stat = util.promisify(fs.stat);
const stringify = require('csv-stringify')

const csv_path = './public/locales/un_translate.csv';

let total_result = [];

let chars = [
    [
        "{t('",
        "')}"
    ],
    [
        "{t(\"",
        "\")}"
    ]
]

function saveResult(text) {
    total_result.push(text);
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
        find_r = text.indexOf(end);
        if (find_r != -1) {

            // console.log('find数据',find_l,find_r,text.slice(find_l,find_r),text);

            result['status'] = 'find';
            result['text'] = text.slice(find_l+before.length,find_r);
            result['rest_text'] = text.slice(find_r+end.length);
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



const loop = async function() {

    let loop_dirs = [
        'components',
        'pages'
    ];

    const promises =loop_dirs.map(async dir=>{
        var filePath = path.resolve('./'+dir);
        await fileDisplay(filePath);
    })

    await Promise.all(promises);

    console.log('执行到这里');
    console.log('total_result2',total_result)


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

