import React from 'react';
import {Input} from 'antd';

import styles from 'styles/swap_input.module.less'

import TokenSelect from 'components/common/token_select'

class SwapInput extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            'is_open_token_modal'   : false,
        }

        this.handleAmountChange = this.handleAmountChange.bind(this);
        this.handleTokenChange = this.handleTokenChange.bind(this);

        // this.setAmountMax = ::this.setAmountMax
        // this.getValue = this.getValue.bind(this)
        // this.setAmount = ::this.setAmount
    }

    handleAmountChange(e) {
        console.log('更改了amount')
        this.props.setAmount(e.target.value)
    }

    // setAmountMax() {
    //     const {max} = this.props;
    //     this.props.setAmount(max)
    // }

    handleTokenChange(token) {
        // console.log('debug001,更换当前选中的token:',token)
        this.props.setToken(token)
        // this.props.setAmount(0)
    }


    render() {

        const {is_open_token_modal} = this.state;
        const {disable_token,default_token_name,max,amount,token} = this.props;

        console.log('debug001,当前的token和余额',token,max);
        // console.log('debug001,当前disable的token是',disable_token);

        return (
            <div className={styles.input_wrapper}>
                <Input bordered={false} className={styles.input} value={amount} placeholder={'0.0'} onChange={this.handleAmountChange}/>
                {(max > 0 && disable_token) ? <a className="max-btn" onClick={this.props.handleSetMaxAmount}>Max</a> : null}
                <TokenSelect token={token} default_token_name={default_token_name} disable_token={disable_token} onChange={this.handleTokenChange} />
            </div>
        );
    }
}

module.exports = SwapInput
