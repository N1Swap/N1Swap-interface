import React from 'react';
import {Tag} from 'antd';

class TronReact extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            installed   : false,
            is_login    : false,
            is_loading  : false
        }

        console.log('debug-tronreact,constructor');
        this.checkTronLink = this.checkTronLink.bind(this);
    }   

    componentDidMount() {

        console.log('debug-tronreact,didmount');

        this.setState({
            is_loading:true
        })

        let that = this;
        window.addEventListener('load', function() {
            that.checkTronLink();
        });

        this.checkTronLink();
    }

    checkTronLink() {
        // console.log('debug-tron,window.tronWeb:',window.tronWeb)

        if (this.state.is_login) {
            return false;
        }

        if (window.tronWeb) {
            console.log('debug-tron,window.tronWeb.ready:',window.tronWeb.ready)
        }

        if(window.tronWeb) {
            this.setState({
                installed   : !!window.tronWeb,
                is_login    : window.tronWeb && window.tronWeb.ready,
                is_loading  : false
            });
        }
    }


    render() {

        const {installed,is_login,is_loading} = this.state;

        return (
            <div>
                TronReact Status
                {
                    (installed)
                    ? <Tag color="green">installed</Tag>
                    : <Tag color="red">uninstalled</Tag>
                }
                {
                    (is_login)
                    ? <Tag color="green">Logined</Tag>
                    : <Tag color="red">unlogined</Tag>
                }
                {
                    (is_loading)
                    ? <Tag color="green">loading</Tag>
                    : <Tag color="red">loaded</Tag>
                }
            </div>
        );
    }
}

export default TronReact;


