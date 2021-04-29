import React,{useRef,useContext} from 'react';

import { connect } from "react-redux";
import SwapInput from 'components/swap/input';
import SwapSetting from 'components/swap/setting';
import CheckModal from 'components/liquidity/modal/check'
import SuccessModal from 'components/liquidity/modal/success'
import ConfirmModal from 'components/liquidity/modal/confirm'
import Loading from 'components/common/loading'
import TronscanLink from 'components/common/tronscan_link'

import Immutable from "immutable";

import WalletConnectBtn from 'components/wallet/connectbtn'

import { withRouter } from 'next/router'

import {Button,Alert,message,Modal,notification} from 'antd';

import styles from 'styles/swap_trade.module.less'

import {PlusIcon,ArrowLeftIcon,ExclamationCircleIcon} from '@heroicons/react/solid';
import {t} from 'helper/translate'
import TranslateHoc from 'helper/translate/hoc'

import {percentDecimal,getPoolPercent,getIntAmount} from 'helper/number'
import {getLiquidity,addLiquidity,tokenApprove} from 'helper/contract'

import {getIsTronlinkReady,getTx,address0} from 'helper/tron'
import {getAmountToInt} from 'helper/tron_util'
import { isMobile} from "react-device-detect";

const notificationPlacement = (isMobile)?"bottomRight":"topRight";

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
            total_lp_token  : 0,
            is_fetched_pool : false,
            is_fetching_pool: false,

            show_submit_confirm_modal : false,
            show_step_confirm_modal   : false,
            show_success_modal        : false,

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
        this.handleAmountChange = this.handleAmountChange.bind(this)
        this.getBalance = ::this.getBalance
        this.afterTokenChange = ::this.afterTokenChange
        this.getTokenSwap = ::this.getTokenSwap

        this.handleAmountChange = ::this.handleAmountChange

        this.submitConfirm = ::this.submitConfirm

        this.handleCloseModals = ::this.handleCloseModals
        this.beginAddLiquidity = ::this.beginAddLiquidity

        this.checkModalConfirm = ::this.checkModalConfirm

        this._listenTx = ::this._listenTx
        this.openListenTx = ::this.openListenTx

        this.handleSetMaxAmount = ::this.handleSetMaxAmount


    }   

    componentDidMount() {

        // setTimeout(()=>this.checkModalConfirm(),3000)
        // ;
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

        this.setState({
            'is_fetching_pool' : true
        })
        const {token1,token2} = this.state;

        if (token1.contract_address == '') {
            token1.contract_address = ''
        }

        let token_pool = await getLiquidity(token1,token2);

        // console.log('token_pool',token_pool);

        this.setState({
            'token1_pool'       : token_pool.token1_amount,
            'token2_pool'       : token_pool.token2_amount,
            'total_lp_token'    : token_pool.total_lp_token,
            'is_fetched_pool'   : true,
            'is_fetching_pool'  : false
        })
        
    }    

    handleAmountChange(key_name,value) {

        console.log('debug,handleAmountChange',key_name,value)

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

    handleSetMaxAmount() {
        const {token1_pool,token2_pool,is_fetched_pool,token1,token2} = this.state;
        
        let token1_balance = this.getBalance(token1);
        let token2_balance = this.getBalance(token2);

        if (is_fetched_pool) {

            if (token1_pool && token2_pool) {

                ///先根据amount1来算       
                let token1_amount,token2_amount;

                token2_amount = token1_balance * token2_pool / token1_pool

                if ( token2_amount > token2_balance) {
                    token1_amount = token2_balance * token1_pool / token2_pool
                    token2_amount = token2_balance;
                }else {
                    token1_amount = token1_balance;
                }

                this.setState({
                    'token1_amount' : token1_amount,
                    'token2_amount' : token2_amount
                })
            }else {
                this.setState({
                    'token1_amount' : token1_balance,
                    'token2_amount' : token2_balance
                })
            }

        }

    }


    handleTokenChange(name,token) {
        console.log('debug,调用了handleTokenChange')

        let state = {}
        state[name] = token;

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

        if (token2.contract_address != address0) {
            var stepone = Immutable.Map({
                'type'              : 'approve',
                'contract_address'  : token2.contract_address,
                'status'            : 'init',
                'result'            : false,
                'token_name'        : token2.name,
                'amount'            : getIntAmount(token2_amount,token2.decimal)
            })
            steps = steps.push(stepone);
        }


        var stepone = Immutable.Map({
            'type'              : 'add_liquidity',
            'status'            : 'init',
            'result'            : false
        })
        steps = steps.push(stepone);

        this.setState({
            'steps'                     : steps,
            'active_step'               : 0,
            'show_step_confirm_modal'   : true
        },()=>{
            this.beginAddLiquidity();
        })


    }

    async beginAddLiquidity() {
        console.log('T2执行到：beginAddLiquidity')
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

                case 'add_liquidity':
                    
                    var tolerance = this.settingRef.current.getTolerance();
                    var tolerance_ppt = tolerance * Math.pow(10,12);
                    console.log('tolerance',tolerance,tolerance_ppt);

                    var token1_amount_int = getAmountToInt(token1_amount,token1.decimal);
                    var token2_amount_int = getAmountToInt(token2_amount,token1.decimal);

                    var result = await addLiquidity(token1.contract_address,token1_amount_int,token2.contract_address,token2_amount_int,tolerance_ppt);

                    if (result.status == 'success') {

                        this.setState({
                            'show_success_modal' : true
                        });

                        ///开启一个轮询结果的方法
                        this.openListenTx(result.tx_id,'add_liquidity',{
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
                this.beginAddLiquidity();
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
                title = this.props.getTranslate('Add Liquidity Rquest Error');
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
                title = this.props.getTranslate('Approve Success');
            }else if (type == 'add_liquidity'){
                title = this.props.getTranslate('Add Liquidity Success');
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
            is_fetching_pool,is_fetched_pool} = this.state;
        const {tronlink} = this.props;

        // console.log('debug,tronlink',tronlink.toJS());

        let token1_balance = this.getBalance(token1);
        let token2_balance = this.getBalance(token2);

        let is_tronlink = getIsTronlinkReady(false);


        // console.log('token1_amount',token1_amount)
        // console.log('token2_amount',token2_amount)

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
                        <SwapSetting ref={this.settingRef}/>
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
                                <PlusIcon className={'icon-20'} />
                            </div>
                        </div>
                        <div className={styles.box_from_input}>
                            <div className={styles.box_title}>
                                <h3>{t('input')}</h3>
                                <div className={styles.balance}>
                                    {t('balance')}
                                    : 
                                    <span className={styles.amount}>{token2_balance}</span>
                                </div>
                            </div>
                            <div className={styles.currency_input}>
                                <SwapInput 
                                    max={token2_balance}
                                    token={token2}
                                    amount={token2_amount}
                                    disable_token={token1}
                                    setAmount={this.handleAmountChange.bind({},'token2_amount')}
                                    setToken={this.handleTokenChange.bind({},'token2')}
                                    handleSetMaxAmount={this.handleSetMaxAmount}
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
                                    <dd>{getPoolPercent(token1_amount,token1_pool)}</dd>
                                    <dt>{t('share of pool')}</dt>
                                </dl>
                            </div>
                            : null
                        }
                        {
                            (token1 && token2 && is_fetched_pool && !token1_pool && !token2_pool && is_tronlink)
                            ? <div className={styles.notice}>
                                <h3>You are the first liquidity provider.</h3>
                                <p>The ratio of tokens you add will set the price of this pool. Once you are happy with the rate click supply to review.</p>
                            </div>
                            : null
                        }
                        
                    </div>
                    <div className={styles.box_footer}>
                        {
                            (tronlink.get('is_logined'))
                            ? <Button block size="large" className="big-radius-btn" type="primary" onClick={this.submitConfirm}>{t('submit')}</Button>
                            : <WalletConnectBtn block={true} size={'large'}/>
                        }
                    </div>
                </div>

                {
                    (show_submit_confirm_modal)
                    ? <CheckModal visible={true} 
                        onCancel={this.handleCloseModals} 
                        onOk={this.checkModalConfirm}
                        token1_pool={token1_pool}
                        token2_pool={token2_pool}
                        total_lp_token={total_lp_token}
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

module.exports = TranslateHoc(withRouter(connect(mapStateToProps,mapDispatchToProps)(LiquidityAdd)))
