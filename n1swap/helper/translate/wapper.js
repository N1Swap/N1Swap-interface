import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import TranslateContext from '~/common/translate/context'
import {strFormat} from '~/helper/str'


const translateHoc = WrappedComponent => {

    return class TranslateCompent extends Component {

        static contextType = TranslateContext;

        constructor(props, context) {
            super(props, context);
            this.getTranslate = ::this.getTranslate
        }

        getTranslate(name, values = {}) {
            // console.log('debug:this.context.intl',this.context)
            var translated = name;
            if (this.context.localeMessage && this.context.localeMessage[name]) {
                translated = this.context.localeMessage[name];
            }

            if (Object.keys(values).length === 0) {
                return translated // 如果为空,返回false
            }else {
                return strFormat(translated,values)
            }
        }
    
        render() {
            return <WrappedComponent 
                ref={instanceComponent => this.instanceComponent = instanceComponent}
                {...this.props} 
                getTranslate={this.getTranslate}/>
        }
    }

}

export default translateHoc;