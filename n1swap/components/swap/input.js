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

    static getDerivedStateFromProps(nextProps,prevState) {
        if (nextProps.default_token) {
            prevState['token'] = nextProps.default_token
        }
        return prevState;
    }

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
        this.setState({
            'token' : token
        })
    }

    render() {


        const {token,amount,is_open_token_modal} = this.state;

        return (
            <div className={styles.input_wrapper}>
                <Input bordered={false} className={styles.input} value={amount} placeholder={'0.0'} onChange={this.handleAmountChange}/>
                <TokenSelect value={token} onChange={this.handleTokenChange} />
            </div>
        );
    }
}

module.exports = SwapInput
