import React, { useState } from 'react';
import { withRouter } from 'next/router'
import Head from 'next/head'
import { connect } from "react-redux";
import classNames from "classnames";

import PageWrapper from 'components/pagewrapper'
import TokenSelect from 'components/common/token_select'
import LiquidityFind from 'components/liquidity/find'

import {PlusIcon,ArrowLeftIcon} from '@heroicons/react/solid';
import {Divider} from 'antd';

import styles from 'styles/swap_trade.module.less'
import {t} from 'helper/translate'

class LiquidityFindPage extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            token1      : null,
            token2      : null,

            account     : null,
        }
        this.handleTokenChange = ::this.handleTokenChange
    }   

    static getDerivedStateFromProps(nextProps, prevState) {
        let new_state = {};
        let change = 0;
        if (nextProps.account != prevState.account) {
            new_state['account'] = nextProps.account
            change = 1;
        }
        if (change == 1) {
            return new_state;
        }else {
            return null;
        }

    }

    handleTokenChange(name,token) {
        let state = {}
        state[name] = token;
        this.setState(state);
    }

    render() {
        const {token1,token2,account,data,is_fetched,is_fetching} = this.state;

        console.log('准备的数据，token1，token2',token1 , token2)

        return <PageWrapper>
                <Head>
                    <title>Import Liquidity</title>
                </Head>


                <div className="color-bg">
                <div className="max-width page-all">

                    <div className={styles.box_wrapper}>
                        <div className={styles.box_head}>

                            <div className={styles.nav}>
                                <a onClick={()=>this.props.router.push('/liquidity')}><ArrowLeftIcon className="icon-16" /></a>
                            </div>
                            <div className={styles.title}>
                                {t('import Liquidity')}
                            </div>
                            <div className={styles.tool}>
                            </div>
                        </div>

                        <div className={classNames(styles.box_content_top,styles.box_content_top2)}>
                            <div className={classNames(styles.box_form,styles.box_find)}>
                                <div className={styles.box_from_input}>
                                    <div className={styles.currency_input}>
                                        <TokenSelect token={token1} default_token_name={'trx'} 
                                            disable_token={token2} 
                                            onChange={this.handleTokenChange.bind({},'token1')} />
                                    </div>
                                </div>
                                <div className={styles.to}>
                                    <div className={styles.to_icon}>
                                        <PlusIcon className={'icon-20'} />
                                    </div>
                                </div>
                                <div className={styles.box_from_input}>
                                    <div className={styles.currency_input}>
                                        <TokenSelect token={token2} 
                                            disable_token={token1} 
                                            onChange={this.handleTokenChange.bind({},'token2')} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Divider />

                        <div className={styles.box_content_footer}>
                            {
                                (token1 && token2) 
                                ? <LiquidityFind token1={token1} token2={token2} account={account}/>
                                : <div className={styles.gray_box}>
                                    <div className={styles.empty}>
                                    {t('please select a token')}
                                    </div>
                                </div> 
                            }
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
        'account' : state.getIn(['setting','tronlink','account']),
    }
}

module.exports = withRouter(connect(mapStateToProps,mapDispatchToProps)(LiquidityFindPage))
