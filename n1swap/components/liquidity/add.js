import React,{useRef} from 'react';

import { connect } from "react-redux";
import SwapInput from 'components/swap/input';
import SwapSetting from 'components/swap/setting';
import CheckModal from 'components/liquidity/modal/check'
import SuccessModal from 'components/liquidity/modal/success'
import ConfirmModal from 'components/liquidity/modal/confirm'
import Loading from 'components/common/loading'

import { withRouter } from 'next/router'

import {Button} from 'antd';

import styles from 'styles/swap_trade.module.less'

import {PlusIcon,ArrowLeftIcon} from '@heroicons/react/solid';
import {t} from 'helper/translate'

class LiquidityAdd extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            is_loading  : false,
            token1      : null,
            token2      : null,

            token1_pool     : null,
            token2_pool     : null,
            is_fetched_pool : false,
            is_fetching_pool: false
        }

        this.fromRef = React.createRef();
        this.toRef   = React.createRef();

        this.handleTokenChange = this.handleTokenChange.bind(this)
        this.handleAmountChange = this.handleAmountChange.bind(this)
        this.getBalance = ::this.getBalance
        this.afterTokenChange = ::this.afterTokenChange
        this.getTokenSwap = ::this.getTokenSwap

    }   

    getTokenSwap() {

        this.setState({
            'is_fetching_pool' : true
        })

        var that = this;
        setTimeout(()=>{
            that.setState({
                'token1_pool'       : 400,
                'token2_pool'       : 20,
                'is_fetched_pool'   : true,
                'is_fetching_pool'  : false
            })
        },2000)
        
    }    

    handleAmountChange(key_name,e) {
        let new_state = {};
        new_state[key_name] = e.target.value
        this.setState(new_state);
    }


    handleTokenChange(name,token) {
        console.log('调用了handleTokenChange')

        let state = {}
        state[name] = token;

        this.setState(state,this.afterTokenChange);
    }

    afterTokenChange() {
        console.log('afterTokenChange');
        if (this.state.token1 && this.state.token2) {
            this.getTokenSwap();
        }
    }

    getBalance(token) {

        // console.log('debug,getBalanceList,input',token,this.props.balance)
        if (!token) {
            return 0
        }

        // console.log('debug,getBalanceList,token1',this.props.balance.get(token.contract_address))
        let b = this.props.balance.get(token.contract_address);
        if (!b) {
            return 0
        }
        // console.log('debug,getBalanceList,token_balance',b.toJS())


        return b.get('show_balance')
    }

    render() {

        const {is_loading,
            from_token_name,from_token_amount,
            to_token_amount,to_token_name,token1,token2,is_fetching_pool,is_fetched_pool} = this.state;
        const {tronlink} = this.props;

        console.log('debug,is_fetching_pool',is_fetching_pool);
        console.log('debug,is_fetched_pool',is_fetched_pool);

        let token1_balance = this.getBalance(token1);
        let token2_balance = this.getBalance(token2);

        return (
            <div className={styles.box_wrapper}>
                <div className={styles.box_head}>

                    <div className={styles.nav}>
                        <a onClick={()=>this.props.router.push('/liquidity')}><ArrowLeftIcon className="icon-16" /></a>
                    </div>
                    <div className={styles.title}>
                        {t('Add Liquidity')}
                    </div>
                    <div className={styles.tool}>
                        <SwapSetting />
                    </div>
                </div>

                <div className={styles.box_content_top}>
                    <div className={styles.box_form}>
                        <div className={styles.box_from_input}>
                            <div className={styles.box_title}>
                                <h3>{t('input')}</h3>
                                <div className={styles.balance}>
                                    {t('balance')}
                                    : 
                                    <span className={styles.amount}>{token1_balance?token1_balance:'-'}</span>
                                </div>
                            </div>
                            <div className={styles.currency_input}>
                                <SwapInput 
                                    ref={this.fromRef}
                                    max={token1_balance}
                                    default_token_name='trx'
                                    disable_token={token2}
                                    setToken={this.handleTokenChange.bind({},'token1')}
                                    />
                            </div>
                        </div>
                        <div className={styles.to}>
                            <div className={styles.to_icon}>
                                <PlusIcon className={'icon-20'} />
                            </div>
                        </div>
                        <div className={styles.box_from_input}>
                            <div className={styles.box_title}>
                                <h3>{t('input')}</h3>
                                <div className={styles.balance}>
                                    {t('balance')}
                                    : 
                                    <span className={styles.amount}>{token2_balance?token2_balance:'-'}</span>
                                </div>
                            </div>
                            <div className={styles.currency_input}>
                                <SwapInput 
                                    ref={this.toRef}
                                    max={token2_balance}
                                    disable_token={token1}
                                    setToken={this.handleTokenChange.bind({},'token2')}
                                    />
                            </div>
                        </div>
                        {
                            (is_fetching_pool)
                            ? <div className={styles.liquidity_pool_info}>
                                <Loading theme="gray"/>
                            </div>
                            : null
                        }

                        {
                            (token1 && token2 && is_fetched_pool)
                            ? <div className={styles.liquidity_pool_info}>
                                <h2>Price and pool share</h2>
                                <dl>
                                    <dd>1817.22</dd>
                                    <dt><span className="upper">{token1.name}</span> {t('per')} <span className="upper">{token2.name}</span></dt>
                                </dl>
                                <dl>
                                    <dd>0.00044441</dd>
                                    <dt><span className="upper">{token2.name}</span> {t('per')} <span className="upper">{token1.name}</span></dt>
                                </dl>
                                <dl>
                                    <dd>{"<"}0.01%</dd>
                                    <dt>{t('share of pool')}</dt>
                                </dl>
                            </div>
                            : null
                        }
                    </div>
                    <div className={styles.box_footer}>
                        <Button block size="large" className="big-radius-btn" type="primary" onClick={this.test}>{t('submit')}</Button>
                    </div>
                </div>

                <CheckModal visible={false} />

                <SuccessModal visible={false} />

                <ConfirmModal visible={false} />
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
     return {
     }
}
function mapStateToProps(state,ownProps) {
    return {
        'tronlink' : state.getIn(['setting','tronlink']),
        'balance'  : state.getIn(['token','balance'])
    }
}

module.exports = withRouter(connect(mapStateToProps,mapDispatchToProps)(LiquidityAdd))
