 import React,{useRef} from 'react';

import classNames from 'classnames';
// import { connect } from "react-redux";
// import SwapInput from 'components/swap/input';
// import SwapSetting from 'components/swap/setting';
import Image from 'next/image'

import {Button,Divider,Modal} from 'antd';

import styles from 'styles/components/modal.module.less'

import { withRouter } from 'next/router'

// import {QuestionMarkCircleIcon} from '@heroicons/react/outline';

import {t} from 'helper/translate'
import {autoDecimal,getPoolPercent} from 'helper/number'

class CheckModal extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            is_loading  : false,
        }
    }   


    render() {

        var {token1,token2,total_lp_token,token1_pool,token2_pool} = this.props;

        let my_lp_token = (total_lp_token > 0) ? (token1.amount / token1_pool) * total_lp_token : token1.amount * token2.amount;

        // token1_pool = 10
        // token2_pool = 100

        // console.log('autoDecimal',autoDecimal)

        return (
            <Modal
                className={'border_modal'}
                width={420}
                title="Add Liquidity" 
                visible={this.props.visible} 
                footer={null}
                onCancel={this.props.onCancel}
                >

                <div className={styles.check_title}>
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
                </div>

                <Divider />

                <div className={styles.line}>
                    <div className={styles.l1}>
                        <span className="upper">{token1.token.name}</span> {t('deposited')}
                    </div>
                    <div className={styles.l2}>
                        <div className={styles.coin}>
                            <div className={classNames('icon-img',styles.iconone)}>
                            <Image
                                src={"/img/token/"+token1.token.icon}
                                width={24}
                                height={24}
                                layout="fixed"
                            />
                            </div>
                        </div>
                        <div className={styles.coinname}>{token1.amount}</div>
                    </div>
                </div>

                <div className={styles.line}>
                    <div className={styles.l1}>
                        <span className="upper">{token2.token.name}</span> {t('deposited')}
                    </div>
                    <div className={styles.l2}>
                        <div className={styles.coin}>
                            <div className={classNames('icon-img',styles.iconone)}>
                            <Image
                                src={"/img/token/"+token2.token.icon}
                                width={24}
                                height={24}
                                layout="fixed"
                            />
                            </div>
                        </div>
                        <div className={styles.coinname}>{token2.amount}</div>
                    </div>
                </div>

                {
                    (token1_pool && token2_pool)
                    ? <React.Fragment><div className={styles.line}>
                        <div className={styles.l1}>
                            {t('Rate')}
                        </div>
                        <div className={styles.l3}>
                            <div className={styles.ll}>1 <span className="upper">{token1.token.name}</span> = {autoDecimal(token2_pool/token1_pool)} <span className="upper">{token2.token.name}</span></div>
                            <div className={styles.ll}>1 <span className="upper">{token2.token.name}</span> = {autoDecimal(token1_pool/token2_pool)} <span className="upper">{token1.token.name}</span></div>
                        </div>
                    </div>
                    <div className={styles.line}>
                        <div className={styles.l1}>
                            {t('Share of Pool')}
                        </div>
                        <div className={styles.l3}>
                            <div className={styles.ll}>{getPoolPercent(token1.amount,token1_pool)}</div>
                        </div>
                    </div>
                    </React.Fragment>
                    : null
                }
                
                

                <div className={styles.ft}>
                    <Button block size="large" className="big-radius-btn" type="primary" onClick={this.props.onOk}>{t('confirm')}</Button>
                </div>

                


            </Modal>
        );
    }
}

module.exports = withRouter(CheckModal)
