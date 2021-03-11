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
        }
        this.setLanguage = this.setLanguage.bind(this)
    }   

    setLanguage(language) {
        this.props.set_language(language)
    }

    transferCountryToLanguage(country) {
        switch(country) {
            case 'GB':
                return 'EN';
            default:
                return country;
        }
    }

    transferLanguageToCountry(lang) {
        switch(lang) {
            case 'EN':
                return 'GB';
            default:
                return lang;
        }
    }

    transferLanguageToFullName(lang) {
        let full = null;
        switch(lang) {
            case 'EN':
                full = 'English';
                break;
            case 'JP':
                full = '日本语';
                break;
            case 'CN':
                full = '中文';
                break;
            case 'ID':
                full = 'Indonesian';
                break;

            default:
        }
        return full;
    }

    render() {
        const {language} = this.props;

        const default_langs = ['EN','CN','ID','JP'];
        const country = this.transferLanguageToCountry(language);

        let content = <div className={classNames("dropdown-menu",styles.language_list)}>
            <ul>
                {
                    default_langs.map(one=>{
                        let country = this.transferLanguageToCountry(one).toLowerCase();
                        return <li key={one}>
                            <a onClick={this.setLanguage.bind({},one)}>
                            <div className={styles.flag}>
                                <Image 
                                src={"/img/flag/country-4x3/"+country+".svg"}
                                width={24}
                                height={18}
                                /></div>
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
            <Popover content={content} title={null} placement="topRight" arrowPointAtCenter >
                <Button  
                    type={'link'}
                    className={styles.language_btn}
                    icon={<div className={styles.flag}><Image 
                    src={"/img/flag/country-4x3/"+country+".svg"}
                    width={24}
                    height={18}
                    /></div>}>{this.transferLanguageToFullName(language)}</Button>
            </Popover>
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
