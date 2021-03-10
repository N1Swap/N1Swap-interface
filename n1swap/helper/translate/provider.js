import React from 'react'
import { connect } from 'react-redux'

import TranslateContext from 'helper/translate/context'

import en from 'public/locales/en';
import zh from 'public/locales/zh';

export const messagesCache = { zh, en }

console.log('debug0,messagesCache',messagesCache);


function getMessages(language) {
    if (messagesCache[language]) {
        return messagesCache[language];
    }else {
        return {}
    }
}


class TranslateProvider extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            'text'               : '',
        }
    }

    render() {
        let { language , edit_mode } = this.props;
        const {text } = this.state;

        return (
            <TranslateContext.Provider value={{
                'language'          : language,
                'localeMessage'     : getMessages(language),
            }}>
                 {this.props.children}
            </TranslateContext.Provider>
        )
    }
};



const mapStateToProps = (state, ownProps) => ({
    language        :  state.getIn(['setting','language']),
});

export default connect(mapStateToProps)(TranslateProvider);