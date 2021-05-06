import React from 'react';
import {Modal,Input,Button,Divider} from 'antd';
import { connect } from "react-redux";

import classNames from 'classnames';

import Image from 'next/image'

import styles from 'styles/swap_trade.module.less'

import {ChevronDownIcon} from '@heroicons/react/solid';

class TokenSelect extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            'is_open_token_modal'   : false,
            'kw'             : '',
            'token_list' : [
                {
                    'name'             : 'trx',
                    'contract_address' : 'T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb',
                    'icon'             : 'trx.svg',
                    'type'             : 'trc10',
                    'decimal'          : 6,
                },
                {
                    'name'             : 'wbtt',
                    'contract_address' : 'TF5Bn4cJCT6GVeUgyCN4rBhDg42KBrpAjg',
                    'icon'             : 'btt.svg',
                    'type'             : 'trc20',
                    'decimal'          : 6,
                },
                {
                    'name'             : 'usdt',
                    'contract_address' : 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
                    'sub'              : 'the usdt of trx',
                    'icon'             : 'usdt.svg',
                    'type'             : 'trc20',
                    'decimal'          : 6,
                },
                {
                    'name'             : 'NST',
                    'contract_address' : 'TYuUHP9v2ye3LMwGQP7YZhqRxbHiCLXFJy',
                    'sub'              : 'n1swap',
                    'icon'             : 'nst.svg',
                    'type'             : 'trc20',
                    'decimal'          : 6,
                }
            ],
        }
        this.toggleOpenTokenList = this.toggleOpenTokenList.bind(this)
        this.handleValueChange = this.handleValueChange.bind(this)
        this.selectToken = this.selectToken.bind(this)
        this.setDefaultToken = ::this.setDefaultToken
    }

    componentDidMount() {
        this.setDefaultToken(this.props.default_token_name)
    }

    componentDidUpdate(prevProps,prevState) {
        // console.log('componentDidUpdate',prevProps,prevState)
        if (prevProps.default_token_name != this.props.default_token_name) {
            this.setDefaultToken(this.props.default_token_name);
        }
    }

    setDefaultToken(name) {
        if (!name) {
            return;
        }

        let default_token = this.getSelect(this.state.token_list,name);
        if (default_token) {
            this.props.onChange(default_token);
        }
    }

    toggleOpenTokenList() {
        this.setState({
            'is_open_token_modal' : !this.state.is_open_token_modal
        })
    }

    handleValueChange(name,e) {
        let v = {}
        v[name] = e.target.value;
        // console.log('handleValueChange',name,e.target.value)
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

    selectToken(token) {

        const {disable_token} = this.props;

        console.log('selectToken',token,disable_token)

        if (disable_token && disable_token.name == token.name) {
            return false;
        }


        if (typeof this.props.onChange == 'function') {
            console.log('this.props.onChange ',this.props.onChange )
            this.props.onChange(token);
            this.toggleOpenTokenList();
        }

    }

    getSelect(token_list,token) {

        let token_lower = token.toLowerCase();
        let select = null
        token_list.map(one=>{
            // console.log('debug001,check',one.name,token_lower)
            if (one.name == token_lower) {
                // console.log('debug001,find',one.name);
                select = one;
            }
        })
        return select;
    }

    render() {

        const {is_open_token_modal,kw,token_list} = this.state;
        const {token,disable_token,balance} = this.props;

        // console.log('传入的disable_token',disable_token)

        if (kw) {
            token_list = this.getList(token_list,kw);
        }

        let select_token = null
        if (typeof token == 'string') {
            select_token = this.getSelect(token_list,token)
        }else if (typeof token == 'object'){
            select_token = token
        }

        let disable_token_name = null
        if (typeof disable_token == 'string') {
            let disable_token_obj = this.getSelect(token_list,disable_token)
            disable_token_name = (disable_token_obj) ? disable_token_obj.name : '';
        }else if (typeof disable_token == 'object' && disable_token) {
            disable_token_name = disable_token.name
        } 

        return (
            <React.Fragment>
                <button 
                    className={styles.token_btn} 
                    onClick={this.toggleOpenTokenList} 
                    >
                    {
                        (select_token != null)
                        ? <span className={styles.token_name}>
                            <span className={styles.token_icon}>
                            <Image
                                src={"/img/token/"+select_token.icon}
                                width={16}
                                height={16}
                                layout="fixed"
                            />
                            </span>
                            {select_token.name.toUpperCase()}
                        </span>
                        : <span className={styles.token_name}>select token</span>
                    }
                    <span className={styles.arrow}><ChevronDownIcon className="icon-16" /></span>
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
                                    let is_disable = false;
                                    if (token.name == disable_token_name) {
                                        is_disable = true;
                                    }
                                    let contract_address = (token.contract_address == 'T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb') ? 'trx' : token.contract_address;
                                    return <div className={'block-token-one'} key={token.name}><a 
                                        className={classNames("link-all",{"disable":is_disable})} 
                                        onClick={this.selectToken.bind({},token)}>
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
                                        <div className="balance">
                                            {
                                                (balance.get(contract_address))
                                                ? balance.getIn([contract_address,'show_balance'])
                                                : 0
                                            }
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


const mapDispatchToProps = (dispatch) => {
     return {
     }
}
function mapStateToProps(state,ownProps) {
    return {
        'balance' : state.getIn(['token','balance']),
    }
}

module.exports = connect(mapStateToProps,mapDispatchToProps)(TokenSelect)
