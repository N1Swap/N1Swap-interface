import React from 'react';
import {Button,Tag,Typography,Modal} from 'antd';
const { Paragraph, Text } = Typography;

import { initStore } from '../redux/store';
import {tronlink_installed,tronlink_logined,tronlink_set_account} from '../redux/reducer/setting';
import { connect } from "react-redux";

import styles from 'styles/components/tron.module.css'

import {pageReady} from 'helper/misc';

import {getTronLinkLoginAccount,getIsInstalledTronLink,getIsLoginTronLink,sendTx} from 'helper/tron';

class TronReact extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            is_loading  : false,
            is_show_account_modal : false,
            is_show_connect_modal : false
        }

        // console.log('debug-tronreact,constructor');
        this.checkTronLink = this.checkTronLink.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
    }   

    componentDidMount() {
        // console.log('debug-tronreact,didmount');
        this.setState({
            is_loading:true
        })

        // let that = this;
        // window.addEventListener('load', function() {
        //     that.checkTronLink();
        // });

        pageReady(this.checkTronLink);

        this.checkTronLink();
    }

    checkTronLink() {

        const {tronlink} = this.props;

        const is_intalled = getIsInstalledTronLink();
        // console.log('debug0,is_intalled',is_intalled);

        if(is_intalled) {

            this.props.tronlink_installed(is_intalled);

            let is_logined = getIsLoginTronLink();
            // console.log('debug0,is_logined',is_logined);

            this.props.tronlink_logined(is_logined);


            let tronlink_account = getTronLinkLoginAccount();
            // console.log('debug0,tronlink_account',tronlink_account);

            if(tronlink_account){
                // console.log('tronlink_set_accountd',tronlink_account)
                this.props.tronlink_set_account(tronlink_account);
            }


            this.setState({
                is_loading  : false
            });
        }
    }

    toggleModal(name) {
        let d = {}
        switch(name) {
            case 'account':
                d['is_show_account_modal'] = !this.state.is_show_account_modal;
                break;
            case 'connect':
                d['is_show_connect_modal'] = !this.state.is_show_connect_modal;
                break;
        }
        this.setState(d)
    }

    sendtx() {
        sendTx('TPCyLGT4U3ZcoMyenJ61iZ2zJrrJEnGATJ',10);
    }


    render() {

        const {is_loading,is_show_account_modal,is_show_connect_modal} = this.state;
        const {tronlink} = this.props;

        console.log('debug,tronlink',tronlink.toJS());
        /*  {
                    (tronlink.get('is_installed'))
                    ? <Tag color="green">installed</Tag>
                    : <Tag color="red">uninstalled</Tag>
                }
                {
                    (is_loading)
                    ? <Tag color="green">loading</Tag>
                    : <Tag color="red">loaded</Tag>
                }
                */
        return (
            <div>
                {
                    (tronlink.get('is_logined'))
                    ? <Button
                        className="account-btn"
                        onClick={this.toggleModal.bind({},'account')}
                    >
                        <Text
                            style={{ width: 100 }}
                            ellipsis={{ tooltip: tronlink.get('account') }}
                          >
                            {tronlink.get('account')}
                        </Text>
                    </Button>
                    : <Button type="primary" onClick={this.toggleModal.bind({},'connect')}>Connect Wallet</Button>
                }
                <div className="test-wapper">
                    <Button onClick={this.sendtx}>send trx test</Button>
                </div>
                <Modal
                    className={'border_modal'}
                    width={420}
                    title="Account" 
                    visible={is_show_account_modal} 
                    onOk={this.handleOk} 
                    onCancel={this.toggleModal.bind({},'account')}>
                    <div className={styles.search_box_content}>
                    </div>
                </Modal>
                <Modal
                    className={'border_modal'}
                    width={420}
                    title="Connect Wallet" 
                    visible={is_show_connect_modal} 
                    onOk={this.handleOk} 
                    onCancel={this.toggleModal.bind({},'connect')}>
                    <div className={styles.block_wallet_list}>
                        <ul>
                            <li>
                                <a className="wallet">
                                    <span className="name">TronLink</span>
                                    <span className="wallet-icon"></span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </Modal>
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
     return {
        'tronlink_installed' : (is_installed) => {
            return dispatch(tronlink_installed(is_installed))
        },
        'tronlink_logined'   : (is_logined) => {
            return dispatch(tronlink_logined(is_logined))
        },
        'tronlink_set_account'   : (account) => {
            return dispatch(tronlink_set_account(account))
        }
     }
}
function mapStateToProps(state,ownProps) {
    return {
        'tronlink' : state.getIn(['setting','tronlink']),
    }
}

module.exports = connect(mapStateToProps,mapDispatchToProps)(TronReact)
