import React from 'react';
import {Button,Popover} from 'antd';

import classNames from 'classnames';
import {set_language} from 'redux/reducer/setting';
import { connect } from "react-redux";
import Image from 'next/image'

import styles from 'styles/components/language/btn.module.less'

class LanguageBtn extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            visible: false,
        }
        this.setLanguage = this.setLanguage.bind(this)
        this.handleVisibleChange = this.handleVisibleChange.bind(this)
        this.langMap = {
            'gb' : 'en',
            'cn' : 'zh',
            'jp' : 'ja',
            'kr' : 'ko' 
        };

        this.countryMap = this.flip(this.langMap);
    }   

    flip(obj) {
        let new_obj = {}
        for (let k in obj) {
            let value = obj[k]; //将原来的value赋值给一个变量
            new_obj[value] = k; // 为cluster_info赋新key，不能直接使用cluster_info = {cluster_info[k] : k},会报语法错误
        }
        return new_obj
    }

    setLanguage(language) {
        this.props.set_language(language);
        this.setState({
            'visible' : false
        })
    }

    transferCountryToLanguage(country) {

        if (this.langMap.hasOwnProperty(country)) {
            return this.langMap[country];
        }

        return country;
    }

    transferLanguageToCountry(lang) {

        console.log('transferLanguageToCountry',lang,this.countryMap.hasOwnProperty(lang),this.countryMap[lang])
        if (this.countryMap.hasOwnProperty(lang)) {
            console.log('transferLanguageToCountry0',this.langMap[lang])
            return this.countryMap[lang];
        }
        return lang;
    }

    transferLanguageToFullName(lang) {
        let full = null;
        switch(lang) {
            case 'en':
                full = 'English';
                break;
            case 'ja':
                full = '日本語';
                break;
            case 'zh':
                full = '中文';
                break;
            case 'id':
                full = 'Indonesian';
                break;
            case 'fr':
                full = 'Français';
                break;
            case 'it':
                full = 'Italiano';
                break;
            case 'ru':
                full = 'русский';
                break;
            case 'de':
                full = 'Deutsch';
                break;
            case 'ko':
                full = '한국어';
                break;

            default:
        }
        return full;
    }

    getFlag(country) {
        console.log('传入的国家是',country);
        let flag = null;

        if (!country) {
            return flag;
        }

        let country_lower = country.toLowerCase();
        flag = <Image src={'/img/flag/country-4x3/'+country_lower+'.svg'} width={24} height={18}/>
        console.log('得到的flag是',flag);
        return flag;
    }

    handleVisibleChange(visible) {
        this.setState({ visible });
    }

    render() {
        const {language} = this.props;

        const country = this.transferLanguageToCountry(language);

        console.log('debug-language-coutnry',language,country)

        const default_langs = ['en','zh','ja','id','it','ru','de','fr','ko'];
        let content = <div className={classNames("dropdown-menu",styles.language_list)}>
            <ul>
                {
                    default_langs.map(one=>{
                        let country = this.transferLanguageToCountry(one);
                        return <li key={one}>
                            <a onClick={this.setLanguage.bind({},one)}>
                            <div className={styles.flag}>
                                {this.getFlag(country)}    
                            </div>
                            {
                                this.transferLanguageToFullName(one)
                            }
                            </a>
                        </li>
                    })
                }
            </ul>
        </div>

        return (
            <div>
                <Popover content={content} title={null} placement="topRight" trigger="click" visible={this.state.visible}
                    onVisibleChange={this.handleVisibleChange}>
                    <Button  
                        type="normal"
                        className={styles.language_btn}
                        icon={<div className={styles.flag}>{this.getFlag(country)}</div>}>{this.transferLanguageToFullName(language)}</Button>
                </Popover>
            </div>
        );
    }
}


const mapDispatchToProps = (dispatch) => {
    return {
       set_language : (lang) => {
            return dispatch(set_language(lang))
       }
    }
}
function mapStateToProps(state,ownProps) {
    return {
        'language' : state.getIn(['setting','language']),
    }
}

module.exports = connect(mapStateToProps,mapDispatchToProps)(LanguageBtn)
