import React, { useState } from 'react';
import { withRouter } from 'next/router'
import Link from 'next/link'
import { connect } from "react-redux";
import classNames from "classnames";

import Loading from 'components/common/loading'
import LiquidityCard from 'components/liquidity/card'

import {Button} from 'antd';

import styles from 'styles/swap_trade.module.less'
import {t} from 'helper/translate'

import {getLPTokenBalance,getLiquidity} from 'helper/contract';
import {get_liquidity_by_token} from 'redux/reducer/liquidity'
import {getLpToken} from 'helper/state'

class LiquidityFind extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            token1      : null,
            token2      : null,
            account     : null,

            is_fetching : false,
            is_fetched : false,
        }
                
        this.handleTokenChange = ::this.handleTokenChange
        this.findLiquidity = ::this.findLiquidity
    }   

    static getDerivedStateFromProps(nextProps, prevState) {
        let new_state = {};
        let change = 0;
        if (nextProps.account != prevState.account) {
            new_state['account'] = nextProps.account
            change = 1;
        }
        if (nextProps.token1 != prevState.token1) {
            new_state['token1'] = nextProps.token1
            change = 1;
        }
        if (nextProps.token2 != prevState.token2) {
            new_state['token2'] = nextProps.token2
            change = 1;
        }
        if (change == 1) {
            return new_state;
        }else {
            return null;
        }

    }


    componentDidMount() {
        this.findLiquidity();
    }

    componentDidUpdate(prevProps, prevState) {
        if (
          this.state.token1 !== prevState.token1  
          || this.state.token2 !== prevState.token2 
          || this.state.account !== prevState.account
        ) {
            this.findLiquidity();
        }
      }

    handleTokenChange(name,token) {
        // console.log('debug,调用了handleTokenChange')
        let state = {}
        state[name] = token;

        var that = this;
        this.setState(state,()=>that.findLiquidity());
    }

    async findLiquidity() {
        const {token1,token2,account} = this.state;

        if (token1 && token2 && account) {

            this.setState({'is_fetching':true,'is_fetched':false})

            let lp_token = await this.props.get_liquidity_by_token(token1,token2,account);

            this.setState({
                'is_fetching': false,
                'is_fetched' : true,
            })

        }
    }


    render() {
        const {account,bg,lp_token} = this.props;
        const {token1,token2,data,is_fetched,is_fetching} = this.state;

        console.log('debug:find:tokens',token1,token2);

        return <div className={styles.block_find}>

  

            {
                (is_fetching && !lp_token)
                ? <Loading theme="gray" />
                : null
            }

            {
                (is_fetched && !lp_token) 
                ? <div>
                    {
                        (account)
                        ? <div className={styles.gray_box}>
                            <div className={styles.empty}>
                                {t('no liquidity found.')}
                                <p><Link href="/liquidity/add"><a>{t('add liquidity')}</a></Link></p>
                            </div>
                        </div>
                        : <div className={styles.unlogin_box}>{t('Connect to a wallet to view your liquidity.')}</div>
                    }
                </div>
                : null
            }

            {
                (lp_token)
                ? <LiquidityCard lp_token={lp_token} token1={token1} token2={token2} bg={bg}/>
                : null
            }

            {
                (!account)
                ? <div className={styles.unlogin_box}>{t('Connect to a wallet to view your liquidity.')}</div>
                : null
            }

        </div>

    }
    
}

const mapDispatchToProps = (dispatch) => {
    return {
        get_liquidity_by_token: get_liquidity_by_token(dispatch),
    }
}
function mapStateToProps(state,ownProps) {
    return {
        'account'  : state.getIn(['setting','tronlink','account']),
        'lp_token' : getLpToken(state,ownProps.token1.contract_address,ownProps.token2.contract_address)
    }
}
module.exports = withRouter(connect(mapStateToProps,mapDispatchToProps)(LiquidityFind))


