import React, { useState } from 'react';
import {wrapper} from 'redux/store';
import { withRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import { connect } from "react-redux";

import PageWrapper from 'components/pagewrapper'


import {FireIcon,ArrowCircleRightIcon,QuestionMarkCircleIcon} from '@heroicons/react/solid';
import {Button,Divider,Tooltip} from 'antd';

import styles from 'styles/swap_trade.module.less'
import {t} from 'helper/translate'

class LiquidityAll extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
        }
    }   


    render() {
        const {tronlink} = this.props;
        return <PageWrapper>
                <Head>
                    <title>Home</title>
                </Head>


                <div className="color-bg">
                <div className="max-width page-all">

                    <div className="color-box margin-bottom-20">
                        <div className="head">
                            <div className="icon"><FireIcon className={'icon-16'} /></div>
                            <div className="title">{t('Liquidity provider rewards')}</div>
                        </div>
                        <div className="content">
                            {t('Liquidity providers earn a 0.3% fee on all trades proportional to their share of the pool. Fees are added to the pool, accrue in real time and can be claimed by withdrawing your liquidity.')}
                        </div>
                        <div className="bottom">
                            <a className="with-end-icon">
                                <span>{t('Read more about providing liquidity')}</span>
                                <div className="icon">
                                    <ArrowCircleRightIcon className={'icon-16'}/>
                                </div>
                            </a>
                        </div>
                    </div>


                    <div className={styles.box_wrapper}>
                        <div className={styles.box_head}>
                            <div className={styles.title}>
                                {t('Liquidity')}
                                <div className={styles.sub}>{t('Add liquidity to receive LP tokens.')}</div>
                            </div>
                            <div className={styles.tool}>
                            </div>
                        </div>

                        <div className={styles.box_content_mid}>
                        
                            <Button block size="large" className="big-radius-btn" type="primary" onClick={()=>this.props.router.push('/liquidity/add')}>{'Add Liquidity'}</Button>

                        </div>

                        <Divider />

                        <div className={styles.box_content_mid2}>
                        
                            <div className={styles.liquidity_list}>
                                <div className={styles.liquidity_head}>
                                    <h3>{t('your liquidity')}</h3>
                                    <Tooltip placement="top" title={t('When you add liquidity, you are given pool tokens that represent your share. If you don’t see a pool you joined in this list, try importing a pool below.')}>
                                        <QuestionMarkCircleIcon className={'icon-16'} />
                                    </Tooltip>
                                </div>
                            </div>

                        </div>

                        <div className={styles.box_content_mid2}>
                            {
                                (tronlink.get('account'))
                                ? <div className={styles.login_box}>
                                    <div className={styles.empty}>
                                        No liquidity found.
                                    </div>
                                </div>
                                : <div className={styles.unlogin_box}>{t('Connect to a wallet to view your liquidity.')}</div>
                            }
                        </div>

                        <Divider />

                        <div className={styles.box_content_footer}>
                            <p className={styles.footer_text}>{t("Don't see a pool you joined?")}<Link href="/liquidity/find"><a>{t('Impot it')}</a></Link></p>
                        </div>

                    </div>

                </div>
                </div>
        </PageWrapper>
    }
    
}


const mapDispatchToProps = (dispatch) => {
     return {
     }
}
function mapStateToProps(state,ownProps) {
    return {
        'tronlink' : state.getIn(['setting','tronlink']),
    }
}

module.exports = withRouter(connect(mapStateToProps,mapDispatchToProps)(LiquidityAll))
