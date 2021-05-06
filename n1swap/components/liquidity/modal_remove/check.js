 import React,{useRef} from 'react';

import classNames from 'classnames';
import Image from 'next/image'

import {Button,Divider,Modal} from 'antd';
import styles from 'styles/components/modal.module.less'
import { withRouter } from 'next/router'

import {t} from 'helper/translate'
import {autoDecimal,getPoolPercent} from 'helper/number'

class CheckModal extends React.Component {

    constructor(props) {
        super(props)
    }   

    render() {

        var {token1,token2,amount} = this.props;

        return (
            <Modal
                className={'border_modal'}
                width={420}
                title="Remove Liquidity" 
                visible={this.props.visible} 
                footer={null}
                onCancel={this.props.onCancel}
                >

                <div className={styles.check_title}>
                    <div className={styles.p1}>{t('you will remove')}</div>
                    <div className={styles.p2}>
                        <span>{amount}</span>
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
                </div>

                <Divider />

                <div className={styles.line}>
                    <div className={styles.l1}>
                        <span className="upper">{token1.token.name}</span> {t('will receive')}
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
                        <span className="upper">{token2.token.name}</span> {t('will receive')}
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

                

                <div className={styles.ft}>
                    <Button block size="large" className="big-radius-btn" type="primary" onClick={this.props.onOk}>{t('confirm')}</Button>
                </div>

                


            </Modal>
        );
    }
}

module.exports = withRouter(CheckModal)
