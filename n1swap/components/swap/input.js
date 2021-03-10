import React from 'react';
import {Input} from 'antd';

import styles from 'styles/swap_input.module.less'

import TokenSelect from 'components/common/token_select'

class SwapInput extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            'token'                 : null,
            'amount'                : 0,
            'is_open_token_modal'   : false,
        }

        this.handleAmountChange = this.handleAmountChange.bind(this);
        this.getValue = this.getValue.bind(this)
        this.handleTokenChange = this.handleTokenChange.bind(this);
    }

    componentDidMount() {
        if (this.props.default_token) {
            let default_token = this.props.default_token.toLowerCase()
            this.handleTokenChange(default_token);
        }
    }

    // static getDerivedStateFromProps(nextProps,prevState) {
    //     if (nextProps.default_token) {
    //         prevState['token'] = nextProps.default_token
    //     }
    //     return prevState;
    // }

    getValue() {
        return {
            'token'  : this.state.token,
            'amount' : Number(this.state.amount)
        }
    }

    handleAmountChange(e) {
        this.setState({
            'amount' : e.target.vlaue
        })
    }

    handleTokenChange(token) {
        console.log('debug001,更换当前选中的token:',token)
        this.setState({
            'token' : token,
        })
        this.props.setDisableToken(token);
    }

    render() {

        const {token,amount,is_open_token_modal} = this.state;
        const {disable_token} = this.props;

        console.log('debug001,当前选中的token是',token,this.state);
        console.log('debug001,当前disable的token是',disable_token);

        return (
            <div className={styles.input_wrapper}>
                <Input bordered={false} className={styles.input} value={amount} placeholder={'0.0'} onChange={this.handleAmountChange}/>
                <TokenSelect token={token} disable_token={disable_token} onChange={this.handleTokenChange} />
            </div>
        );
    }
}

module.exports = SwapInput
