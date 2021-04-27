import React from 'react';

import {Button,Typography,Modal} from 'antd';

import TronlinkBtn from 'components/wallet/tronlink/btn'
import TronlinkConnecting from 'components/wallet/tronlink/connecting'
import TronlinkAccount from 'components/wallet/tronlink/account'

import {pageReady} from 'helper/misc';
import {ArrowNarrowLeftIcon,XIcon} from '@heroicons/react/solid';

import translateHoc from 'helper/translate/hoc'
import tronlinkHoc from 'components/wallet/tronlink/hoc'

import styles from 'styles/components/wallet/base.module.less'

import {t} from 'helper/translate'
import {getTrxFromSun} from 'helper/misc'


class WalletConnectBtn extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            is_loading          : false,

            modal_type          : 'list', //list,wallet,
            active_wallet       : null,   //null,'tronlink',

            is_show_modal       : false

        }

        this.checkWalletAll = this.checkWalletAll.bind(this)
        this.toggleModal = this.toggleModal.bind(this);
        this.toggleShowModal = this.toggleShowModal.bind(this);
        this.resetModal = this.resetModal.bind(this)
        this.getModalContent = this.getModalContent.bind(this)
        this.getModalWalletContent = this.getModalWalletContent.bind(this);

        this.getModalTitle = this.getModalTitle.bind(this)

        this.getTronlinkContent = this.getTronlinkContent.bind(this)

        this._timer = null;
    }   

    componentDidMount() {
        // console.log('debug-tronreact,didmount');
        pageReady(this.checkWalletAll);
        this.setIntervalCheck();
    }

    componentWillUnmount() {
        if (this._timer) {
            window.clearInterval(this._timer);
        }
    }

    setIntervalCheck() {
        
        // const is_intalled = getIsInstalledTronLink();
        // this.props.tronlink_installed(is_intalled);

        // if (!is_intalled) {
        //     return;
        // }

        if (window) {
            this._timer = window.setInterval(()=>{
                this.checkWalletAll();
            },3000);
        }
    }

    checkWalletAll() {
        this.props.checkTronLink();
    }

    toggleModal(modal_type,wallet_name = null) {
        this.setState({
            'modal_type' : modal_type,
            'active_wallet' : wallet_name
        })
    }

    resetModal() {
        this.toggleModal('list',null);
    }

    toggleShowModal() {
        if (this.state.is_show_modal) {
            this.setState({
                'is_show_modal' : !this.state.is_show_modal
            })
            ///关闭的时候要reset一次
            this.resetModal()
        }else {
            this.setState({
                'is_show_modal' : !this.state.is_show_modal
            })
        }
    }

    getModalTitle() {
        const {active_wallet,modal_type} = this.state;
        switch(modal_type) {
            case 'list':
                return t('Connect to a wallet');
            case 'wallet':
                return this.props.getTranslate('Account') + ' - ' + active_wallet;
            default:
                return null;
        }
    }

    getModalContent() {
        switch(this.state.modal_type) {
            case 'list':
                return <div className={styles.block_wallet_list}>
                    <ul>
                        <li>
                            <TronlinkBtn onClick={this.toggleModal.bind({},'wallet','tronlink')}/>
                        </li>
                    </ul>
                </div>
            case 'wallet':
                return this.getModalWalletContent(this.state.active_wallet);
            default:
                return null;
        }
    }

    getModalWalletContent(modal_name) {
        switch(modal_name) {
            case 'tronlink':
                return this.getTronlinkContent(this.props.tronlink)
            default:
                return null
        }
    }

    getTronlinkContent(wallet) {
        const {tronlink} = this.props;
        if (tronlink.get('is_logined')) {
            return <TronlinkAccount account={tronlink} />
        }else {
            return <TronlinkConnecting />
        }
    }

    render() {

        const {is_loading,is_show_modal,modal_type,active_wallet} = this.state;
        const {tronlink,balance} = this.props;

        let trx_balance = 0;
        if (balance.getIn(['trx','show_balance'])) {
            trx_balance = Number(balance.getIn(['trx','show_balance']));
        }


        return (    
            <div>
                {
                    (tronlink.get('is_logined'))
                    ? <div className={styles.block_account_btn}>
                        <div className={styles.tron_info}>
                            <div className={styles.amount}>{trx_balance.toFixed(2)}</div>
                            <div className={styles.token}>TRX</div>
                        </div>
                        <Button
                            className={styles.wallet_btn}
                            onClick={this.toggleShowModal}
                        >
                            {
                                (tronlink.get('account'))
                                ? tronlink.get('account').slice(0,5) + '...'
                                : '...'
                            }
                        </Button>
                    </div>
                    : <div className={styles.block_account_btn_empty}>
                        <Button className={styles.wallet_btn} type="primary" block={this.props.block} size={(this.props.size)?this.props.size:'normal'} onClick={this.toggleShowModal}>Connect Wallet</Button>
                    </div>
                }

                <Modal
                    // maskStyle={{'background':'#fff'}}
                    className={'border_modal'}
                    width={420}
                    title={
                        (modal_type != 'list')
                        ? <div className="flex-start modal-title-with-icon">
                            <a onClick={this.toggleModal.bind({},'list',null)} className="icon flex-center"><ArrowNarrowLeftIcon className="icon-20" /></a>
                            {this.getModalTitle()}
                        </div>
                        : this.getModalTitle()
                    } 
                    closeIcon={<XIcon className="icon-20" />}
                    footer={null}
                    visible={is_show_modal} 
                    onOk={this.handleOk} 
                    onCancel={this.toggleShowModal}>
                    {
                        this.getModalContent()
                    }
                </Modal>
            </div>
        );
    }
}

module.exports = tronlinkHoc(
    translateHoc(
        WalletConnectBtn
    )
)
