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

        this.setAmountMax = ::this.setAmountMax
        this.setAmount = ::this.setAmount
    }

    // componentDidMount() {
    //     if (this.props.default_token) {
    //         let default_token = this.props.token.toLowerCase()
    //         this.handleTokenChange(default_token);
    //     }
    // }

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
        this.setAmount(e.target.vlaue)
    }

    setAmount(amount) {
        this.setState({
            'amount' : amount
        })
        
        if (typeof this.props.setAmount == 'function') {
            this.props.setAmount(amount)
        }
    }

    setAmountMax() {
        const {max} = this.props;
        this.setAmount(max)
    }

    handleTokenChange(token) {
        // console.log('debug001,更换当前选中的token:',token)
        this.setState({
            'token' : token,
        })

        if (typeof this.props.setToken == 'function') {
            this.props.setToken(token)
        }

        this.setAmount(0)
        
    }


    render() {

        const {token,amount,is_open_token_modal} = this.state;
        const {disable_token,default_token_name,max} = this.props;

        // console.log('debug001,当前选中的token是',token,this.state);
        // console.log('debug001,当前disable的token是',disable_token);

        return (
            <div className={styles.input_wrapper}>
                <Input bordered={false} className={styles.input} value={amount} placeholder={'0.0'} onChange={this.handleAmountChange}/>
                {(max > 0) ? <a className="max-btn" onClick={this.setAmountMax}>Max</a> : null}
                <TokenSelect token={token} default_token_name={default_token_name} disable_token={disable_token} onChange={this.handleTokenChange} />
            </div>
        );
    }
}

module.exports = SwapInput
