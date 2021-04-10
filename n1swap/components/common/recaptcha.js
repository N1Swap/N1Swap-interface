import React from 'react'
import ReCAPTCHA from "react-google-recaptcha";
import {autobind} from 'react-decoration'

import getConfig from 'next/config'
import Cookies from 'universal-cookie';

const { publicRuntimeConfig } = getConfig()


class Recaptcha extends React.Component {

  constructor(props) {
        super(props);
        this.state = {
            'token' : ''
        }
        this.recaptchaRef = React.createRef();
        this.key = publicRuntimeConfig['env']['RECAPTCHA_V2_KEY'];
    }

    onChange() {

    }

    @autobind
    getValue() {
        return this.recaptchaRef.current.getValue();
    }

    // @autobind
    // verifyCallback(token) {
    //     console.log('fetch_recaptcha_token',token)
    //     this.setState({
    //         'token' :  token
    //     })
    // }

    // @autobind
    // refetchToken() {
    //     if (!this.state.token) {
    //         return;
    //     }
    //     const {action} = this.props;
    //     var verifyCallback = this.verifyCallback;
    //     grecaptcha.ready(function() {
    //         window.grecaptcha
    //         .execute(getConfig('recaptcha_v3_key'), { action: action })
    //         .then(token => {
    //             verifyCallback(token)
    //         })
    //     });
    // }

    // @autobind
    // getToken() {
    //     return this.state.token
    // }

    render() {

        console.log('this.key',this.key)

        return (
            <div className="block-recaptcha">
            <ReCAPTCHA
                ref={this.recaptchaRef}
                sitekey={this.key}
                onChange={this.onChange}
              />
            </div>
        );
    }
}

export default Recaptcha;
