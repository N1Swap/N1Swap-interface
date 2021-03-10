import React from 'react';
import {Modal,Input,Button,Divider} from 'antd';

import { initStore } from 'redux/store';
import { connect } from "react-redux";
import classNames from 'classnames';
import Image from 'next/image'

import styles from 'styles/components/common/token_select.module.less'

import {ChevronDown} from 'heroicons-react';

class TokenSelect extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            'is_open_token_modal'   : false,
            'kw'             : ''
        }
        this.toggleOpenTokenList = this.toggleOpenTokenList.bind(this)
        this.handleValueChange = this.handleValueChange.bind(this)
    }


    toggleOpenTokenList() {
        this.setState({
            'is_open_token_modal' : !this.state.is_open_token_modal
        })
    }

    handleValueChange(name,e) {
        let v = {}
        v[name] = e.target.value;
        console.log('handleValueChange',name,e.target.value)
        this.setState(v)
    }

    getList(list,kw) {
        let result = []
        list.map(one=>{
            if (one.name.indexOf(kw) !== -1 || one.contract_address.indexOf(kw) !== -1) {
                result.push(one);
            }else if (one.sub && one.sub.indexOf(kw) !== -1) {
                result.push(one);
            }
        })
        return result;
    }

    render() {


        const {is_open_token_modal,kw} = this.state;
        const {token} = this.props;

        let token_list = [
            {
                'name'             : 'trx',
                'contract_address' : '0x113232323',
                'icon'             : 'trx.svg'
            },
            {
                'name'             : 'btt',
                'contract_address' : '0x113232323',
                'icon'             : 'btt.svg'
            },
            {
                'name'             : 'usdt',
                'contract_address' : '0x113232323',
                'sub'              : 'the usdt of trx',
                'icon'             : 'usdt.svg'
            }
        ]

        if (kw) {
            token_list = this.getList(token_list,kw);
        }

        return (
            <React.Fragment>
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
                        footer={null}
                        onOk={this.handleOk} 
                        onCancel={this.toggleOpenTokenList}>
                        <div className={styles.search_box_wrapper}>
                            <Input size={'large'} value={kw} onChange={this.handleValueChange.bind({},'kw')} className={classNames("input-radius","input-gray")} placeholder={'Search name or paste address'}/>
                        </div>
                        <div className={styles.search_box_content}>
                            <Divider />
                            {
                                token_list.map(token=>{
                                    return <div className={'block-token-one'}><a className="link-all">
                                        <div className="icon">
                                            <Image
                                                src={"/img/token/"+token.icon}
                                                width={24}
                                                height={24}
                                                layout="fixed"
                                            />
                                        </div>
                                        <div className={'name'}>
                                            <div className="main">{token.name}</div>
                                            <div className="sub">{token.sub ? token.sub : token.main}</div>
                                        </div>
                                    </a></div>
                                })
                            }
                        </div>
                    </Modal>
                    : null
                }
            </React.Fragment>
        );
    }
}

module.exports = TokenSelect
