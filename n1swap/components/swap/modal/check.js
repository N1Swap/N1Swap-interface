 import React,{useRef} from 'react';

import classNames from 'classnames';
import Image from 'next/image'

import {Button,Divider,Modal} from 'antd';

import styles from 'styles/components/modal.module.less'

import {ArrowNarrowDownIcon} from '@heroicons/react/solid';

import {t,strFormat} from 'helper/translate'
import {autoDecimal,getPoolPercent} from 'helper/number'

class CheckModal extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
        }
    }   


    render() {

        var {token1,token2,price_impact,min_received,real_price2} = this.props;
        /*                <div className={styles.check_title}>
                    <div className={styles.p1}>{t('you will receive')}</div>
                    <div className={styles.p2}>
                        <span>{my_lp_token}</span>
                        <div className={styles.icons}>
                            <div className={classNames('icon-img',styles.iconone,styles.icon1)}>
                            <Image
                                src={"/img/token/"+token1.token.icon}
                                width={24}
                                height={24}
                                layout="fixed"
                            />
                            </div>
                            <div className={classNames('icon-img',styles.iconone,styles.icon2)}>
                            <Image
                                src={"/img/token/"+token2.token.icon}
                                width={24}
                                height={24}
                                layout="fixed"
                            />
                            </div>
                        </div>
                    </div>
                    <div className={styles.p3}>
                        <span className="margin-right-12">
                            <span className="upper">{token1.token.name}</span>
                            {' / '}
                            <span className="upper">{token2.token.name}</span>
                        </span>
                        <span>{t('Pool Tokens')}</span>
                    </div>
                    <div className={styles.p4}>
                        Output is estimated. If the price changes by more than 0.5% your transaction will revert.
                    </div>
                </div>*/
        return (
            <Modal
                className={'border_modal'}
                width={420}
                title="Swap" 
                visible={this.props.visible} 
                footer={null}
                onCancel={this.props.onCancel}
                >

                <div className={styles.confirm_title}>
                    <div className={styles.p1}>
                        <span className={styles.amount}>{token1.amount}</span>
                        <span className={styles.token}>{token1.token.name}</span>
                    </div>
                    <div className={styles.p2}>
                        <span className={styles.arrowicon}><ArrowNarrowDownIcon className="icon-24"/></span>
                    </div>
                    <div className={styles.p1}>
                        <span className={styles.amount}>{token2.amount}</span>
                        <span className={styles.token}>{token2.token.name}</span>
                    </div>
                </div>


                <Divider />

                <div className={styles.line}>
                    <div className={styles.l1}>
                        {t('Price')}
                    </div>
                    <div className={styles.l2}>
                        {real_price2}<span className="upper ml6">{token2.token.name}</span><span className="ml6">{'per'}</span><span className="upper ml6">{token1.token.name}</span>
                    </div>
                </div>

                <div className={styles.line}>
                    <div className={styles.l1}>
                        {t('Minimum received')}
                    </div>
                    <div className={styles.l2}>
                        {min_received}<span className="upper ml6">{token2.token.name}</span>
                    </div>
                </div>

                <div className={styles.line}>
                    <div className={styles.l1}>
                        {t('Price Impact')}
                    </div>
                    <div className={styles.l2}>
                        <span className={(price_impact && price_impact > 1) ? "red" : "green"}>{(price_impact)?price_impact+'%' : '-'}</span>
                    </div>
                </div>

                <div className={styles.line}>
                    <div className={styles.l1}>
                        {t('Liquidity Provider Fee')}
                    </div>
                    <div className={styles.l2}>
                        {autoDecimal(token1.amount*0.003)}<span className="upper ml6">{token1.token.name}</span>
                    </div>
                </div>
                <Divider />
                <div className={styles.weak_box}>
                    {strFormat(t("The result of the exchange is the estimated value, you will get at least {token_amount} {token_name} otherwise the transaction will be cancelled; please make sure you have enough bandwidth or energy or the transaction will fail."),{"token_amount":min_received,"token_name":token2.token.name.toUpperCase()})}
                </div>

                <div className={styles.ft}>
                    <Button block size="large" className="big-radius-btn" type="primary" onClick={this.props.onOk}>{t('confirm')}</Button>
                </div>

                


            </Modal>
        );
    }
}

module.exports = CheckModal
