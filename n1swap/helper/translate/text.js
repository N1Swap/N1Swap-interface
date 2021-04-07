import React,{ Component }  from 'react'
import TranslateContext from 'helper/translate/context'

import {strFormat} from 'helper/str'

export default class Text extends Component {


    render() {

        var {values,text} = this.props;

        if (!text) {
            text = String(this.props.children)
        }

        var edit_text = text; ///用于编辑


        // console.log('当前调用text插件,传入的',this.props.children)
        // console.log('当前调用text插件,传入的string以后',String(this.props.children))

        return <TranslateContext.Consumer>{
            provider_value => {
                // console.log('text-value',provider_value)

                ///获得翻译文本
                var translated = provider_value['localeMessage'][text]
                if (!translated) {
                    translated = text;
                }

                ///获得替换values以后的翻译文本
                if (values) {
                    translated = strFormat(translated,values);
                }

                if (provider_value['edit_mode']) {
                    return <span className="trans-edit-span">
                        <a className="out-edit-a" onClick={provider_value.handleEdit.bind({},edit_text)}>edit</a>
                        {translated}
                    </span>
                }

                return <React.Fragment>{translated}</React.Fragment>
            }
        }
        </TranslateContext.Consumer>
    }
  
}