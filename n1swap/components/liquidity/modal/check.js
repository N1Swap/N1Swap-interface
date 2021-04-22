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

class CheckModal extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            is_loading  : false,
        }
    }   
    

    render() {


        return (
            <Modal
                className={'border_modal'}
                width={420}
                title="Add Liquidity" 
                visible={this.props.visible} 
                footer={null}
                onClose={this.handleClose}
                onOk={this.handleOk} 
                >

                <div className={styles.check_title}>
                    <div className={styles.p1}>{t('you will receive')}</div>
                    <div className={styles.p2}>
                        <span>28.82</span>
                        <div className={styles.icons}>
                            <div className={classNames('icon-img',styles.iconone,styles.icon1)}>
                            <Image
                                src={"/img/token/usdt.svg"}
                                width={24}
                                height={24}
                                layout="fixed"
                            />
                            </div>
                            <div className={classNames('icon-img',styles.iconone,styles.icon2)}>
                            <Image
                                src={"/img/token/trx.svg"}
                                width={24}
                                height={24}
                                layout="fixed"
                            />
                            </div>
                        </div>
                    </div>
                    <div className={styles.p3}>
                        <span className="margin-right-12">{'TRX / USDT'}</span>
                        <span>{t('Pool Tokens')}</span>
                    </div>
                    <div className={styles.p4}>
                        Output is estimated. If the price changes by more than 0.5% your transaction will revert.
                    </div>
                </div>

                <Divider />

                <div className={styles.line}>
                    <div className={styles.l1}>
                        TRX {t('deposited')}
                    </div>
                    <div className={styles.l2}>
                        <div className={styles.coin}>
                            <div className={classNames('icon-img',styles.iconone)}>
                            <Image
                                src={"/img/token/trx.svg"}
                                width={24}
                                height={24}
                                layout="fixed"
                            />
                            </div>
                        </div>
                        <div className={styles.coinname}>16.29</div>
                    </div>
                </div>

                <div className={styles.line}>
                    <div className={styles.l1}>
                        USDT {t('deposited')}
                    </div>
                    <div className={styles.l2}>
                        <div className={styles.coin}>
                            <div className={classNames('icon-img',styles.iconone)}>
                            <Image
                                src={"/img/token/usdt.svg"}
                                width={24}
                                height={24}
                                layout="fixed"
                            />
                            </div>
                        </div>
                        <div className={styles.coinname}>2.29</div>
                    </div>
                </div>

                <div className={styles.line}>
                    <div className={styles.l1}>
                        {t('Rate')}
                    </div>
                    <div className={styles.l3}>
                        <div className={styles.ll}>1 TRX = 0.145823 USDT</div>
                        <div className={styles.ll}>1 USDT = 6.857646 TRX</div>
                    </div>
                </div>
                <div className={styles.line}>
                    <div className={styles.l1}>
                        {t('Share of Pool')}
                    </div>
                    <div className={styles.l3}>
                        <div className={styles.ll}> 0.01%</div>
                    </div>
                </div>

                <div className={styles.ft}>
                    <Button block size="large" className="big-radius-btn" type="primary" onClick={this.test}>{t('confirm')}</Button>
                </div>

                


            </Modal>
        );
    }
}

module.exports = withRouter(CheckModal)
