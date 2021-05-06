import React, { useState } from 'react';

import { connect } from "react-redux";
import classNames from "classnames";

import PageWrapper from 'components/pagewrapper'
import RemoveBox from 'components/liquidity/remove'
import LiquidityFind from 'components/liquidity/find'

import Head from 'next/head'

import {getData} from 'helper/http'
import styles from 'styles/swap_trade.module.less'
import card_styles from 'styles/components/liquidity/card.module.less'

import {PlusIcon,ArrowLeftIcon} from '@heroicons/react/solid';
import {t} from 'helper/translate'
import {sortStr} from 'helper/str'

const Page = (props) => {

    console.log('debug02,props',props);


    return <PageWrapper>
            <Head>
                <title>Import Liquidity</title>
            </Head>


            <div className="color-bg">
            <div className="max-width page-all">

                <div className={classNames(styles.box_wrapper)}>

                    <div className={styles.box_head}>

                        <div className={styles.nav}>
                            <a onClick={()=>this.props.router.push('/liquidity')}><ArrowLeftIcon className="icon-16" /></a>
                        </div>
                        <div className={styles.title}>
                            {t('remove  Liquidity')}
                        </div>
                        <div className={styles.tool}>
                        </div>
                    </div>

                    <div className={classNames(styles.box_content_top,styles.box_content_top2)}>

                        <LiquidityFind token1={props.token1} token2={props.token2} account={props.account} bg={'white'}/>
                    
                        <RemoveBox token1={props.token1} token2={props.token2} lp_token={props.lp_token} pool={props.pool} />

                    </div>
                </div>

            </div>
            </div>
    </PageWrapper>

    
}


Page.getInitialProps = async (props) => {
    //这里调用官网提供的数据接口做测试
    let [token1,token2] = sortStr(props.query.token1,props.query.token2);
    const json = await getData('/v1/token/list',{token1:token1,token2:token2})
    return { token1: json.data[0] , token2 : json.data[1]}
}

// Home.getInitialProps = ({store, pathname, req, res}) => {
//     console.log('2. Page.getInitialProps uses the store to dispatch things');
//     store.dispatch({type: 'TICK', payload: 'was set in error page ' + pathname});
// };

const mapDispatchToProps = (dispatch) => {
     return {
     }
}
function mapStateToProps(state,ownProps) {

    const {token1,token2} = ownProps;

    return {
        'account' : state.getIn(['setting','tronlink','account']),
        'pool'    : state.getIn(['liquidity','pool',token1.contract_address,token2.contract_address]),
        'lp_token': state.getIn(['liquidity','lp_token',token1.contract_address,token2.contract_address]),
    }
}

module.exports = connect(mapStateToProps,mapDispatchToProps)(Page)
