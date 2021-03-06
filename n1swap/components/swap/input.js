import React from 'react';
import {Modal,Input,Button} from 'antd';

import { initStore } from 'redux/store';
import { connect } from "react-redux";
import Image from 'next/image'

import styles from 'styles/swap_input.module.css'

import {ChevronDown} from 'heroicons-react';

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
        this.toggleOpenTokenList = this.toggleOpenTokenList.bind(this)
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

    toggleOpenTokenList() {
        this.setState({
            'is_open_token_modal' : !this.state.is_open_token_modal
        })
    }

    handleOk() {

    }

    render() {


        const {token,amount,is_open_token_modal} = this.state;

        return (
            <div className={styles.input_wrapper}>

                    
                <Input bordered={false} className={styles.input} value={amount} placeholder={'0.0'} onChange={this.handleAmountChange}/>
                <button 
                    className={styles.token_btn} 
                    onClick={this.toggleOpenTokenList} 
                    >
                    {
                        (token)
                        ? <span className={styles.token_name}>
                            <span className={styles.token_icon}>
                            <Image
                                src="/img/token/trx.svg"
                                width={16}
                                height={16}
                                layout="fixed"
                            />
                            </span>
                            {token}
                        </span>
                        : <span className={styles.token_name}>select token</span>
                    }
                    <span className={styles.arrow}><ChevronDown /></span>
                </button>
                {
                    (is_open_token_modal)
                    ? <Modal 
                        className={'border_modal'}
                        width={420}
                        title="Select Token" 
                        visible={is_open_token_modal} 
                        onOk={this.handleOk} 
                        onCancel={this.toggleOpenTokenList}>
                        <div className={styles.search_box_wrapper}>
                            <Input size={'large'} className={styles.input_radius} placeholder={'Search name or paste address'}/>
                        </div>
                        <div className={styles.search_box_content}>
                        </div>
                    </Modal>
                    : null
                }

            </div>
        );
    }
}

module.exports = SwapInput
