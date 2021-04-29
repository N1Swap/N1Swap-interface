import React,{useRef,useContext} from 'react';

import classNames from 'classnames';
import { connect } from "react-redux";
import SwapInput from 'components/swap/input';
import SwapSetting from 'components/swap/setting';
import CheckModal from 'components/swap/modal/check'
import SuccessModal from 'components/swap/modal/success'
import ConfirmModal from 'components/swap/modal/confirm'
import Loading from 'components/common/loading'
import TronscanLink from 'components/common/tronscan_link'

import Immutable from "immutable";

import WalletConnectBtn from 'components/wallet/connectbtn'

import { withRouter } from 'next/router'

import {Button,Alert,message,Modal,notification} from 'antd';

import styles from 'styles/swap_trade.module.less'

import {PlusIcon,ArrowLeftIcon,ExclamationCircleIcon,ArrowNarrowDownIcon} from '@heroicons/react/solid';
import {t} from 'helper/translate'
import TranslateHoc from 'helper/translate/hoc'

import {percentDecimal,getPoolPercent,getIntAmount,getPoolPriceAfter,autoDecimal,getExchangePrice,getToAmount,getFromAmount} from 'helper/number'
import {getLiquidity,addLiquidity,tokenApprove,swapToken} from 'helper/contract'
import {getUnixtime} from 'helper/misc'

import {getIsTronlinkReady,getTx,address0} from 'helper/tron'
import {getConfig} from 'helper/config'
import {getAmountToInt} from 'helper/tron_util'
import { isMobile} from "react-device-detect";

const notificationPlacement = (isMobile)?"bottomRight":"topRight";

class SwapMain extends React.Component {

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

            total_lp_token  : 0,
            is_fetched_pool : false,
            is_fetching_pool: false,

            show_submit_confirm_modal : false,
            show_step_confirm_modal   : false,
            show_success_modal        : false,

            tolerance : 1,
            deadline  : 20,

            steps : [],

            active_step : 0,
        }


        // this.state['token1'] = {
        //     'name'             : 'trx',
        //     'contract_address' : 'T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb',
        //     'icon'             : 'trx.svg',
        //     'type'             : 'trc10',
        //     'decimal'          : 6,
        // }

        // this.state['token2'] = {
        //     'name'             : 'NST',
        //     'contract_address' : 'TYuUHP9v2ye3LMwGQP7YZhqRxbHiCLXFJy',
        //     'sub'              : 'n1swap',
        //     'icon'             : 'nst.svg',
        //     'type'             : 'trc20',
        //     'decimal'          : 6,
        // }

        // this.state['token1_amount'] = 100;
        // this.state['token2_amount'] = 10;

        this.settingRef = React.createRef();

        this.timer = {};

        this.handleTokenChange = this.handleTokenChange.bind(this)
        this.getBalance = ::this.getBalance
        this.afterTokenChange = ::this.afterTokenChange
        this.getTokenSwap = ::this.getTokenSwap

        this.handleAmountChange = ::this.handleAmountChange

        this.submitConfirm = ::this.submitConfirm

        this.handleCloseModals = ::this.handleCloseModals
        this.beginSwap = ::this.beginSwap

        this.checkModalConfirm = ::this.checkModalConfirm

        this._listenTx = ::this._listenTx
        this.openListenTx = ::this.openListenTx

        this.handleSetMaxAmount = ::this.handleSetMaxAmount

    }   

    componentDidMount() {

        // setTimeout(()=>this.checkModalConfirm(),3000)
        // ;
    }

    componentWillUnmount() {
        if (this._refresh_pool) {
            clearTimeout(this._refresh_pool);
        }
    }

    handleCloseModals(ignore_confirm = false) {

        console.log('调用关闭所有modals的方法',ignore_confirm);
        var that = this;
        if (ignore_confirm == true) {
            that.setState({
                show_submit_confirm_modal : false,
                show_step_confirm_modal   : false,
                show_success_modal        : false,
            })
        }else {
            Modal.confirm({
                title: this.props.getTranslate('The process is not yet complete'),
                icon: <ExclamationCircleIcon className="icon-36 anticon" />,
                content: this.props.getTranslate('Do you confirm to terminate the process and exit?'),
                okText: this.props.getTranslate('Confirm'),
                cancelText: this.props.getTranslate('Cancel'),
                onOk() {
                    that.setState({
                        show_submit_confirm_modal : false,
                        show_step_confirm_modal   : false,
                        show_success_modal        : false,
                    })
                },
            });
        }
        


        
    }

    async getTokenSwap() {
        console.log('debugT9,getTokenSwap');

        ///首先移除正在等待的轮询        
        if (this._refresh_pool) {
            clearTimeout(this._refresh_pool);
        }


        this.setState({
            'is_fetching_pool' : true
        })
        const {token1,token2} = this.state;

        ///因为轮询也会采用这个方法，所以这里有可能是空
        if (!token1 || !token2) {
            this.setState({
                'is_fetching_pool' : false,
                'is_fetched_pool'  : false,
            })
            return;
        }

        if (token1.contract_address == '') {
            token1.contract_address = ''
        }

        console.log('T8,准备获得交易流动性',token1,token2);

        let token_pool = await getLiquidity(token1,token2);
        console.log('T8,获得交易的流动性是',token_pool);

        var that = this;
        this.setState({
            'token1_pool'       : Number(token_pool.token1_amount),
            'token2_pool'       : Number(token_pool.token2_amount),
            'total_lp_token'    : Number(token_pool.total_lp_token),
            'is_fetched_pool'   : true,
            'is_fetching_pool'  : false
        },()=>{
            that.handleAmountChange('token1_amount',that.state.token1_amount)
        })
        
        ///间隔一段时间轮询
        let gap_time = getConfig('REFRESH_POOL_TIME') ? getConfig('REFRESH_POOL_TIME') : 5000;

        console.log('debugT9,gap_time',gap_time);

        this._refresh_pool = setTimeout(()=>{
            that.getTokenSwap();
        },getConfig('REFRESH_POOL_TIME'))
    }    

    handleAmountChange(key_name,value) {

        // console.log('T7,handleAmountChange',key_name,value)
        let new_state = {};
        new_state[key_name] = value

        const {token1_pool,token2_pool,is_fetched_pool} = this.state;

        if (token1_pool && token2_pool && is_fetched_pool) {

            switch(key_name) {
                case 'token1_amount':
                    if (Number(value) > token1_pool) {
                        value = token1_pool;
                        new_state[key_name] = value
                    }
                    new_state['token2_amount'] = getToAmount(token1_pool,token2_pool,value).toFixed(8)
                    break;
                case 'token2_amount':
                    if (Number(value) > token2_pool) {
                        value = token2_pool;
                        new_state[key_name] = value
                    }
                    new_state['token1_amount'] = getFromAmount(token1_pool,token2_pool,value).toFixed(8)
                    break;
            }
        }

        let that = this;
        this.setState(new_state);
    }

    handleSetMaxAmount() {

        // console.log('T7,handleSetMaxAmount')
        const {token1_pool,token2_pool,is_fetched_pool,token1,token2} = this.state;
        
        let token1_balance = this.getBalance(token1);
        let token2_balance = this.getBalance(token2);

        if (is_fetched_pool) {

            if (token1_pool && token2_pool) {

                let max_token1_amount = Math.min(token1_balance,token1_pool);
                this.handleAmountChange('token1_amount',max_token1_amount)

            }else {
                this.handleAmountChange('token1_amount',token1_balance)
            }

        }

    }


    handleTokenChange(name,token) {
        console.log('debug,调用了handleTokenChange',name,token)

        let state = {}
        state[name] = token;

        state['is_fetched_pool'] = false;

        this.setState(state,this.afterTokenChange);
    }

    afterTokenChange() {
        console.log('debug,afterTokenChange');
        if (this.state.token1 && this.state.token2) {
            this.getTokenSwap();
        }
    }

    getBalance(token) {

        // console.log('T4,token',token)

        if (!token) {
            return 0
        }

        let balance;
        if (token.contract_address == address0) {
            balance = this.props.balance.get('trx');
        }else {
            balance = this.props.balance.get(token.contract_address);
        }

        if (!balance) {
            return 0
        }

        return balance.get('show_balance')
    }


    submitConfirm() {

        //1.检查数据
        if (!this.state.token1) {
            message.error('need select token1')
            return false;
        }

        if (!this.state.token2) {
            message.error('need select token2')
            return false;
        }

        if (!this.state.token1_amount || !this.state.token2_amount) {
            message.error('need input amount,and amount must > 0')
            return false;
        }

        //1.首先要确认是否真的添加流动性
        this.setState({
            'show_submit_confirm_modal' : true
        })
    }

    async checkModalConfirm() {

        console.log('checkModalConfirm')
        const {token1_amount,token2_amount,token1,token2} = this.state;
        
        ///1.开始计算需要几步
        let steps = Immutable.List([]);
        if (token1.contract_address != address0) {
            var stepone = Immutable.Map({
                'type'              : 'approve',
                'contract_address'  : token1.contract_address,
                'status'            : 'init',
                'result'            : false,
                'token_name'        : token1.name,
                'amount'            : getIntAmount(token1_amount,token1.decimal)
            })
            steps = steps.push(stepone);
        }


        var stepone = Immutable.Map({
            'type'              : 'swap',
            'status'            : 'init',
            'result'            : false
        })
        steps = steps.push(stepone);

        this.setState({
            'steps'                     : steps,
            'active_step'               : 0,
            'show_step_confirm_modal'   : true
        },()=>{
            this.beginSwap();
        })


    }

    async beginSwap() {
        console.log('T2执行到：beginSwap')
        ///2.准备开始按照step来检查
        let {active_step,steps,token1,token2,token1_amount,token2_amount} = this.state;

        let step = steps.get(active_step);
        if (!step) {
            return;
        }

        console.log('T2准备进行这一步',step.toJS())

        console.log('T2获得的setting',this.settingRef);

        let new_active_step = active_step;


        try {
            ///开始检查这一步要做什么
            switch(step.get('type')) {
                case 'approve':
                    var result = await tokenApprove(step.get('contract_address'),step.get('amount'));

                    if (result.status == 'success') {
                        console.log('T2，准备开启轮询')

                        ///开启一个轮询结果的方法
                        this.openListenTx(result.tx_id,'approve',{
                            'token_name' : token1.name
                        });

                        console.log('T2，已经开启了轮询继续执行')

                        steps = steps.setIn([active_step,'status'],result.status)
                                    .setIn([active_step,'tx_id'],result.tx_id)
                        new_active_step += 1;

                    }else {
                        steps = steps.setIn([active_step,'status'],result.status)
                                    .setIn([active_step,'message'],result.message)
                    }
                    break;

                case 'swap':
                    

                    var {tolerance,deadline} = this.settingRef.current.getValue();

                    // var tolerance_ppt = tolerance * Math.pow(10,12);
                    let {token1_pool,token2_pool} = this.state;
                    let toTokenAmount = getToAmount(token1_pool,token2_pool,token1_amount)
                    let min_received = toTokenAmount*(1-tolerance/100)

                    let deadline_unixtime = getUnixtime() + deadline * 60;

                    var token1_amount_int = getAmountToInt(token1_amount,token1.decimal);
                    var min_received_int = Math.floor(getAmountToInt(min_received,token1.decimal));

                    var result = await swapToken(token1.contract_address,token1_amount_int,token2.contract_address,min_received_int,deadline_unixtime);

                    if (result.status == 'success') {

                        this.setState({
                            'show_success_modal' : true
                        });

                        ///开启一个轮询结果的方法
                        this.openListenTx(result.tx_id,'swap',{
                            'token1_name' : token1.name,
                            'token1_amount' : token1_amount,
                            'token2_name' : token2.name,
                            'token2_amount' : token2_amount
                        });

                        steps = steps.setIn([active_step,'status'],result.status)
                                    .setIn([active_step,'tx_id'],result.tx_id)
                        new_active_step = null;
                    }else {
                        steps = steps.setIn([active_step,'status'],result.status)
                                    .setIn([active_step,'message'],result.message)
                    }
                    break;
                
                default:
                    break;
            }
        }catch(e) {
            console.log('T2调用合约的时候出错了',e);
        }

        if (new_active_step != active_step) {
            this.setState({
                'steps'         : steps,
                'active_step'   : new_active_step
            },()=>{
                this.beginSwap();
            });
        }else {
            console.log('T2这个是测试的部分，证明调用但是却没有进行下一步',steps,new_active_step)
            this.setState({
                'steps'         : steps,
                'active_step'   : new_active_step
            });
        }
        
    }


    ///轮询tx的数据
    openListenTx(tx_id,type,ext_data = {}) {
        ///开启定时获得监听
        var that = this;
        this.timer[tx_id] = setTimeout(function(){
            that._listenTx(tx_id,type,ext_data);
        },3000);
    }


    async _listenTx(tx_id,type,ext_data) {
        console.log('T3获得交易的数据',tx_id);

        let result = await getTx(tx_id);
        console.log('T3最终结果是',result);

        let view_text = this.props.getTranslate('view in tronscan');

        if (result[0]['contractRet'] == "REVERT") {
            console.log('T3交易失败');

            let title = null;
            if (type == 'approve') {
                title = this.props.getTranslate('Approve Rquest Error');
            }else if (type == 'add_liquidity'){
                title = this.props.getTranslate('Swap Rquest Error');
            }

            notification.error({
                message: title,
                description: <TronscanLink tx_id={tx_id} text={view_text}/>,
                duration: 5,
                placement:notificationPlacement
            });

            // if (this.checking[tx_id]) {
            //     this.checking[tx_id]();
            // }

        }else if (result[0]['contractRet'] == "SUCCESS"){

            let title = null;
            if (type == 'approve') {
                title = this.props.getTranslate('Approve  Success');
            }else if (type == 'swap'){
                title = this.props.getTranslate('Swap Token Success');
            }

            notification.success({
                message:  title,
                description: <TronscanLink tx_id={tx_id} text={view_text}/>,
                duration: 3,
                placement:notificationPlacement
            });

            // if (this.checking[tx_id]) {
            //     this.checking[tx_id]();
            // }

        }else {
            this.openListenTx(tx_id);
            console.log('T3循环调用',tx_id);
        }


    }

    // handleNotification() {
    //     console.log('handleNotification')
    //     notification.error({
    //         message: 'Transaction Error',
    //         description: <TronscanLink tx_id={'4ba7c0a57dd49fafb0ac350dbdf196dbd8b57dfb2a0dedd45cbe301855c61421'} text={this.props.getTranslate('view in tronscan')}/>,
    //         duration: 60,
    //         placement: notificationPlacement
    //     });
    // }
    // <Button onClick={this.handleNotification}>测试代码</Button>

    render() {

        const {is_loading,
            show_submit_confirm_modal,
            show_step_confirm_modal,
            active_step,
            token1_amount,token2_amount,
            token1_pool,token2_pool,
            token1,token2,
            total_lp_token,
            tolerance,
            is_fetching_pool,is_fetched_pool} = this.state;
        const {tronlink} = this.props;

        // console.log('debug,tronlink',tronlink.toJS());

        let token1_balance = this.getBalance(token1);
        let token2_balance = this.getBalance(token2);

        let is_tronlink = getIsTronlinkReady(false);


        // console.log('token1_pool',token1_pool)
        // console.log('token2_pool',token2_pool)
        // console.log('pool_price_after',this.state.pool_price_after)

        let real_price = null;
        let price_impact = null;
        let pool_price = null;
        let pool_price_after = null;
        let real_price2 = null;
        let min_received = null;

        if (token1_pool && token2_pool){

            ///计算不考虑损耗的当前池子的对比的一个价格
            pool_price = token1_pool/token2_pool;

            ///计算考虑当前交易的数量产生滑点以后的一个交易价格,这个价格会基本是实际的成交价格
            real_price =  getExchangePrice(token1_pool,token2_pool,token1_amount);
            real_price2 = 1 / real_price;

            ///计算交易完成以后的池子的价格
            pool_price_after = getPoolPriceAfter(token1_pool,token2_pool,token1_amount);

            ///计算最终的价格影响
            price_impact = percentDecimal((pool_price_after-pool_price)/pool_price)

            ///最少接受的货币
            min_received = token2_amount*(1-tolerance/100)
        }

        let empty_liq = (token1 && token2 && is_fetched_pool && !token1_pool && !token2_pool && is_tronlink)

        return (
            <div className={styles.swap_wrapper}>
            <div className={styles.box_wrapper}>
                <div className={styles.box_head}>

                  
                    <div className={styles.title}>
                        {t('Swap')}
                    </div>
                    <div className={styles.tool}>
                        <SwapSetting ref={this.settingRef} onChange={(data)=>{console.log('test执行');this.setState(data)}}/>
                    </div>
                </div>

                {
                    (token1 && token2 && token1_amount)
                    ?  <div className={classNames(styles.box_gray_footer,'slidedown')}>
                        <dl>
                            <dt>{t('Minimum received')}</dt>
                            <dd>{min_received}<span className="upper ml6">{token2.name}</span></dd>
                        </dl>
                        <dl>
                            <dt>{t('Price Impact')}</dt>
                            <dd><span className={(price_impact && price_impact > 1) ? "red" : "green"}>{(price_impact)?price_impact+'%' : '-'}</span></dd>
                        </dl>
                        <dl>
                            <dt>{t('Liquidity Provider Fee')}</dt>
                            <dd>{token1_amount*0.003}<span className="upper ml6">{token1.name}</span></dd>
                        </dl>
                    </div>
                    : null
                }
               
                <div className={styles.box_content_top}>
                    <div className={styles.box_form}>
                        <div className={styles.box_from_input}>
                            <div className={styles.box_title}>
                                <h3>{t('from')}</h3>
                                <div className={styles.balance}>
                                    {t('balance')}
                                    : 
                                    <span className={styles.amount}>{token1_balance}</span>
                                </div>
                            </div>
                            <div className={styles.currency_input}>
                                <SwapInput 
                                    max={token1_balance}
                                    amount={token1_amount}
                                    token={token1}
                                    // default_token_name='trx'
                                    disable_token={token2}
                                    setAmount={this.handleAmountChange.bind({},'token1_amount')}
                                    setToken={this.handleTokenChange.bind({},'token1')}
                                    handleSetMaxAmount={this.handleSetMaxAmount}
                                    />
                            </div>
                        </div>
                        <div className={styles.to}>
                            <div className={styles.to_icon}>
                                <ArrowNarrowDownIcon className={'icon-20'} />
                            </div>
                        </div>
                        <div className={styles.box_from_input}>
                            <div className={styles.box_title}>
                                <h3>{t('to (estimated)')}</h3>
                                <div className={styles.balance}>
                                    {t('balance')}
                                    : 
                                    <span className={styles.amount}>{token2_balance}</span>
                                </div>
                            </div>
                            <div className={styles.currency_input}>
                                <SwapInput 
                                    token={token2}
                                    amount={token2_amount}
                                    disable_token={token1}
                                    setAmount={this.handleAmountChange.bind({},'token2_amount')}
                                    setToken={this.handleTokenChange.bind({},'token2')}
                                    />
                            </div>
                        </div>
                        {
                            (is_fetching_pool && !is_fetched_pool)
                            ? <div className={styles.liquidity_pool_info}>
                                <Loading theme="gray"/>
                            </div>
                            : null
                        }

                        {
                            (token1 && token2 && is_fetched_pool && token1_pool > 0)
                            ? <div className={styles.liquidity_pool_info}>
                                {
                                    (token1_pool && token2_pool)
                                    ? <React.Fragment>
                                        <dl>
                                            <dd>{t("Price")}</dd>
                                            <dt>{real_price2}<span className="upper ml6">{token2.name}</span> {t('per')} <span className="upper">{token1.name}</span></dt>
                                        </dl>
                                        <dl>
                                            <dd>{t("Slippage Tolerance")}</dd>
                                            <dt>{percentDecimal(tolerance/100)}%</dt>
                                        </dl>
                                    </React.Fragment>
                                    : null
                                }
                            </div>
                            : null
                        }

                        {
                            (empty_liq)
                            ? <div className={styles.notice}>
                                <h3>{t('The Liquidity Pool is empty')}</h3>
                                <p>{t("Since the liquidity pool is empty, you can't exchange this cryptocurrency yet and you can add some liquidity to earn profit.")}</p>
                            </div>
                            : null
                        }
                        
                    </div>
                    <div className={styles.box_footer}>
                        {
                            (tronlink.get('is_logined'))
                            ? <div>
                                {
                                    (empty_liq)
                                    ? <Button block size="large" className="big-radius-btn" disabled type="primary" onClick={this.submitConfirm}>{t('Liquidity is empty')}</Button>
                                    : <Button block size="large" className="big-radius-btn" type="primary" onClick={this.submitConfirm}>{t('submit')}</Button>
                                }
                            </div>
                            : <WalletConnectBtn block={true} size={'large'}/>
                        }
                    </div>
                </div>

            </div>
            
            {
                (show_submit_confirm_modal)
                ? <CheckModal visible={true} 
                    onCancel={this.handleCloseModals} 
                    onOk={this.checkModalConfirm}
                    min_received={min_received}
                    price_impact={price_impact}
                    real_price2={real_price2}
                    token1={{token:token1,amount:token1_amount}} token2={{token:token2,amount:token2_amount}}/>
                : null
            }
            
            {
                (show_step_confirm_modal)
                ? <ConfirmModal visible={true} 
                    onCancel={this.handleCloseModals} 
                    active_step={active_step} 
                    steps={this.state.steps} 
                    token1={{token:token1,amount:token1_amount}} 
                    token2={{token:token2,amount:token2_amount}} 
                    handleRetry={this.beginAddLiquidity}
                    />
                : null
            }
            {
                (this.state.show_success_modal)
                ? <SuccessModal visible={true} 
                    onCancel={this.handleCloseModals} 
                    token1={{token:token1,amount:token1_amount}} 
                    token2={{token:token2,amount:token2_amount}} />
                : null
            }
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

module.exports = TranslateHoc(withRouter(connect(mapStateToProps,mapDispatchToProps)(SwapMain)))


                                //
