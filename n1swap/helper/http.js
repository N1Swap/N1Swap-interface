import getConfig from 'next/config'
import {message} from 'antd'

const { publicRuntimeConfig } = getConfig()

export const fetchData = async function(url) {

    let fetch_url = publicRuntimeConfig['env']['API']+url;

    const res = await fetch(fetch_url)
    const data = await res.json()

    catchError(data);

    return data;
}

const catchError = function(data) {
    if (data.status != 'success') {
        if (data.messages) {
            Object.keys(data.messages).map(k=>{
                message.error(data.messages[k]);
            })
        }
    }
}

export const postData = async function(url,post_data) {

    let fetch_url = publicRuntimeConfig['env']['API']+url;

    const res = await fetch(fetch_url, {
      body: JSON.stringify(post_data),
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST'
    })
    const data = await res.json()

    console.log('原始请求的结果是',data);

    catchError(data);

    console.log('准备把数据返回',data);

    return data;
}


export const fetchPost = async function(url,post_data) {
    console.log('准备发起请求',url,post_data);

    const res = await fetch(url, {
      body: JSON.stringify(post_data),
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST'
    })
    const data = await res.json()

    console.log('原始请求的结果是',data);

    catchError(data);

    console.log('准备把数据返回',data);

    return data;
}