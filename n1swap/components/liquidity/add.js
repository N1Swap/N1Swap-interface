import React,{useRef} from 'react';

import { connect } from "react-redux";
import SwapInput from 'components/swap/input';
import SwapSetting from 'components/swap/setting';
import CheckModal from 'components/liquidity/modal/check'
import SuccessModal from 'components/liquidity/modal/success'
import ConfirmModal from 'components/liquidity/modal/confirm'
import Loading from 'components/common/loading'

import { withRouter } from 'next/router'

import {Button,Alert} from 'antd';

import styles from 'styles/swap_trade.module.less'

import {PlusIcon,ArrowLeftIcon} from '@heroicons/react/solid';
import {t} from 'helper/translate'

import {percentDecimal} from 'helper/number'
import {getLiquidity} from 'helper/contract'

class LiquidityAdd extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            is_loading  : false,

            token1      : null,
            token2      : null,

            token1_amount : 0,
            token2_amount : 0,

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

        this.handleAmountChange = ::this.handleAmountChange

    }   

    async getTokenSwap() {

        this.setState({
            'is_fetching_pool' : true
        })
        const {token1,token2} = this.state;

        if (token1.contract_address == '') {
            token1.contract_address = ''
        }

        let token_pool = await getLiquidity(token1.contract_address,token2.contract_address);

        this.setState({
            'token1_pool'       : token_pool.token1Amount,
            'token2_pool'       : token_pool.token2Amount,
            'is_fetched_pool'   : true,
            'is_fetching_pool'  : false
        })
        
    }    

    handleAmountChange(key_name,value) {

        // console.log('debug,handleAmountChange',key_name,value)

        let new_state = {};
        new_state[key_name] = value

        if (this.state.token1_pool && this.state.token2_pool && this.state.is_fetched_pool) {

            switch(key_name) {
                case 'token1_amount':
                    new_state['token2_amount'] = value * this.state.token2_pool / this.state.token1_pool
                    break;
                case 'token2_amount':
                    new_state['token1_amount'] = value * this.state.token1_pool / this.state.token2_pool
                    break;

            }

        }

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

        if (!token) {
            return 0
        }

        let b = this.props.balance.get(token.contract_address);
        if (!b) {
            return 0
        }

        return b.get('show_balance')
    }

    getPoolPercent(token_amount,total_amount) {
        token_amount = Number(token_amount);
        total_amount = Number(total_amount);
        console.log('计算我占据的算力，原始输入',token_amount,total_amount)
        if (token_amount) {
            let p = token_amount / (total_amount + token_amount)
            console.log('计算我占据的算力大约是',p)
            if (p < 0.0001) {
                return  "<" + percentDecimal(token_amount / (total_amount + token_amount)) + '%'
            }else {
                return "≈" + percentDecimal(token_amount / (total_amount + token_amount)) + '%'
            }
        }else {
            return '-';
        }
    }

    render() {

        const {is_loading,
            token1_amount,token2_amount,
            token1_pool,token2_pool,
            token1,token2,
            is_fetching_pool,is_fetched_pool} = this.state;
        const {tronlink} = this.props;

        console.log('debug,token1_amount',token1_amount);

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
                                    amount={token1_amount}
                                    token={token1}
                                    default_token_name='trx'
                                    disable_token={token2}
                                    setAmount={this.handleAmountChange.bind({},'token1_amount')}
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
                                    token={token2}
                                    amount={token2_amount}
                                    disable_token={token1}
                                    setAmount={this.handleAmountChange.bind({},'token2_amount')}
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
                            (token1 && token2 && is_fetched_pool && !is_fetching_pool)
                            ? <div className={styles.liquidity_pool_info}>
                                <h2>Price and pool share</h2>
                                {
                                    (token1_pool && token2_pool)
                                    ? <React.Fragment>
                                        <dl>
                                            <dd>{token1_pool/token2_pool}</dd>
                                            <dt><span className="upper">{token1.name}</span> {t('per')} <span className="upper">{token2.name}</span></dt>
                                        </dl>
                                        <dl>
                                            <dd>{token2_pool/token1_pool}</dd>
                                            <dt><span className="upper">{token2.name}</span> {t('per')} <span className="upper">{token1.name}</span></dt>
                                        </dl>
                                    </React.Fragment>
                                    : null
                                }
                                <dl>
                                    <dd>{this.getPoolPercent(token1_amount,token1_pool)}</dd>
                                    <dt>{t('share of pool')}</dt>
                                </dl>
                            </div>
                            : null
                        }
                        {
                            (token1 && token2 && is_fetched_pool && !token1_pool && !token2_pool)
                            ? <div className={styles.notice}>
                                <h3>You are the first liquidity provider.</h3>
                                <p>The ratio of tokens you add will set the price of this pool. Once you are happy with the rate click supply to review.</p>
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
