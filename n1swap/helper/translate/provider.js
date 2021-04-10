import React from 'react'
import { connect } from 'react-redux'

import TranslateContext from 'helper/translate/context'

import en from 'public/locales/en';
import zh from 'public/locales/zh';
import de from 'public/locales/de';
import fr from 'public/locales/fr';
import ko from 'public/locales/ko';
import ja from 'public/locales/ja';
import id from 'public/locales/id';
import it from 'public/locales/it';
import ru from 'public/locales/ru';

export const messagesCache = { zh, en , de, fr,ko ,ja, id , it,ru }

// console.log('debug0,messagesCache',messagesCache);


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
        let { language  } = this.props;
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
    language        :  state.getIn(['setting','language']).toLowerCase(),
});

export default connect(mapStateToProps)(TranslateProvider);