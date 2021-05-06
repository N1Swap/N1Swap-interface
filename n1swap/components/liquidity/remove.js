import React,{useRef,useContext} from 'react';

import { connect } from "react-redux";
import SwapInput from 'components/swap/input';
import SwapSetting from 'components/swap/setting';
import CheckModal from 'components/liquidity/modal_remove/check'
import SuccessModal from 'components/liquidity/modal_remove/success'
import ConfirmModal from 'components/liquidity/modal_remove/confirm'
import Loading from 'components/common/loading'
import TronscanLink from 'components/common/tronscan_link'
import TokenIcon from 'components/common/token_icon'

import Immutable from "immutable";

import WalletConnectBtn from 'components/wallet/connectbtn'

import { withRouter } from 'next/router'

import {Button,Alert,message,Modal,notification,Input,Slider} from 'antd';

import styles from 'styles/swap_trade.module.less'

import {PlusIcon,ArrowLeftIcon,ExclamationCircleIcon,ArrowNarrowDownIcon} from '@heroicons/react/solid';

import {t} from 'helper/translate'
import TranslateHoc from 'helper/translate/hoc'

import {percentDecimal,getPoolPercent,getIntAmount,forceDecimal} from 'helper/number'
import {getLiquidity,removeLiquidity,tokenApprove} from 'helper/contract'

import {getIsTronlinkReady,getTx,address0} from 'helper/tron'
import {getAmountToInt} from 'helper/tron_util'
import { isMobile} from "react-device-detect";

const notificationPlacement = (isMobile)?"bottomRight":"topRight";

class LiquidityAdd extends React.Component {

    constructor(props) {
        super(props)
        this.state = {

            amount      : 0,

            show_submit_confirm_modal : false,
            show_step_confirm_modal   : false,
            show_success_modal        : false,

            steps : [],

            active_step : 0,
        }


        this.settingRef = React.createRef();

        this.timer = {};

        this.getBalance = ::this.getBalance

        this.handleAmountChange = ::this.handleAmountChange

        this.submitConfirm = ::this.submitConfirm

        this.handleCloseModals = ::this.handleCloseModals
        this.beginRemoveLiquidity = ::this.beginRemoveLiquidity

        this.checkModalConfirm = ::this.checkModalConfirm

        this._listenTx = ::this._listenTx
        this.openListenTx = ::this.openListenTx


        this.handleSliderChange = ::this.handleSliderChange


    }   

    componentDidMount() {

        // setTimeout(()=>this.checkModalConfirm(),3000)
        // ;
    }

    handleSliderChange(value) {
        const {lp_token} = this.props;

        if (!lp_token) {
            return false;
        }
        let v = lp_token * value / 100 
        this.handleAmountChange(v);
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


    handleAmountChange(value) {
        let v = Number(value);

        const {lp_token} = this.props;

        if (v > lp_token) {
            v = lp_token;
        }

        const {token1,token2} = this.props;

        let decimal = 12;
        if (token1 && token2) {
            decimal = token1.decimal+token2.decimal
        }

        let new_state = {};
        new_state['amount'] = forceDecimal(v,decimal)

        this.setState(new_state);
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
        if (!this.props.token1) {
            message.error('need select token1')
            return false;
        }

        if (!this.props.token2) {
            message.error('need select token2')
            return false;
        }

        if (!this.state.amount) {
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

        const {token1,token2} = this.state;
        const {amount} = this.state;
        
        ///1.开始计算需要几步
        let steps = Immutable.List([]);
        // if (token1.contract_address != address0) {
        //     var stepone = Immutable.Map({
        //         'type'              : 'approve',
        //         'contract_address'  : token1.contract_address,
        //         'status'            : 'init',
        //         'result'            : false,
        //         'token_name'        : token1.name,
        //         'amount'            : getIntAmount(token1_amount,token1.decimal)
        //     })
        //     steps = steps.push(stepone);
        // }

        // if (token2.contract_address != address0) {
        //     var stepone = Immutable.Map({
        //         'type'              : 'approve',
        //         'contract_address'  : token2.contract_address,
        //         'status'            : 'init',
        //         'result'            : false,
        //         'token_name'        : token2.name,
        //         'amount'            : getIntAmount(token2_amount,token2.decimal)
        //     })
        //     steps = steps.push(stepone);
        // }


        var stepone = Immutable.Map({
            'type'              : 'remove_liquidity',
            'status'            : 'init',
            'result'            : false
        })
        steps = steps.push(stepone);

        this.setState({
            'steps'                     : steps,
            'active_step'               : 0,
            'show_step_confirm_modal'   : true
        },()=>{
            this.beginRemoveLiquidity();
        })


    }

    async beginRemoveLiquidity() {
        console.log('T2执行到：beginRemoveLiquidity')
        ///2.准备开始按照step来检查
        let {active_step,steps,amount} = this.state;
        let {token1,token2} = this.props;

        let step = steps.get(active_step);
        if (!step) {
            return;
        }

        console.log('T2准备进行这一步',step.toJS())

        // console.log('T2获得的setting',this.settingRef);

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

                case 'remove_liquidity':
                    console.log('T2，开启移除流动性的代码')

                    var result = await removeLiquidity(token1,token2,amount);

                    if (result.status == 'success') {

                        this.setState({
                            'show_success_modal' : true
                        });

                        ///开启一个轮询结果的方法
                        this.openListenTx(result.tx_id,'remove_liquidity',{
                            'token1_name' : token1.name,
                            'token2_name' : token2.name,
                            'amount'      : amount
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
                this.beginRemoveLiquidity();
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
            }else if (type == 'remove_liquidity'){
                title = this.props.getTranslate('Remove Liquidity Rquest Error');
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
            }else if (type == 'remove_liquidity'){
                title = this.props.getTranslate('Remove Liquidity Success');
            }

            notification.success({
                message:  title,
                description: <TronscanLink tx_id={tx_id} text={view_text}/>,
                duration: 10,
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

        const {
            show_submit_confirm_modal,
            show_step_confirm_modal,
            active_step,
            amount,
            total_lp_token,
            is_fetching_pool,is_fetched_pool} = this.state;
        const {token1,token2,tronlink,lp_token,pool} = this.props;


        let token1_amount = 0;
        let token2_amount = 0;
        let token1_pool = 0;
        let token2_pool = 0;
        if (pool) {
            token1_amount = (amount / lp_token) * pool.get('token1_amount');
            token2_amount = (amount / lp_token) * pool.get('token2_amount');
            token1_pool = pool.get('token1_amount');
            token2_pool = pool.get('token2_amount');
            // console.log('debug,pool',pool.toJS());
        }


        // let token1_balance = this.getBalance(token1);
        // let token2_balance = this.getBalance(token2);

        return (
            <div>


                <div className={styles.box_lptoken}>
                    <h3>{t('amount')}</h3>
                    <div className={styles.input}>
                        <Input size={'large'} className={styles.amount_input} value={amount} onChange={(e)=>this.handleAmountChange(e.target.value)}/>
                    </div>
                    <div className={styles.controller}>
                        <div className={styles.slider}>
                            <Slider value={100*amount/lp_token} range={false} onChange={this.handleSliderChange}/>
                        </div>
                        <div className={styles.quickbtn}>
                            <a onClick={this.handleSliderChange.bind({},25)}>25%</a>
                            <a onClick={this.handleSliderChange.bind({},50)}>50%</a>
                            <a onClick={this.handleSliderChange.bind({},75)}>75%</a>
                            <a onClick={this.handleSliderChange.bind({},100)}>Max</a>
                        </div>
                    </div>
                </div>
                
                <div className={styles.box_icon}>
                    <ArrowNarrowDownIcon className={'icon-20'} />
                </div>

                <div className={styles.box_result}>
                    <dl className={styles.token}>
                        <dd>{token1_amount}</dd>
                        <dt><span className={styles.tokenicon}><TokenIcon token={token1} size={24} /></span><span className="upper">{token1.name}</span></dt>
                    </dl>
                    <dl className={styles.token}>
                        <dd>{token2_amount}</dd>
                        <dt><span className={styles.tokenicon}><TokenIcon token={token2} size={24} /></span><span className="upper">{token2.name}</span></dt>
                    </dl>
                </div>

                {
                    (token1_pool && token2_pool)
                    ? <dl className={styles.token_sm}>
                        <dt>{t('price')}</dt>
                        <dd>
                            <p>{token2_pool/token1_pool}<span className="upper ml6">{token2.name}</span> {t('per')} <span className="upper">{token1.name}</span></p>
                            <p>{token1_pool/token2_pool}<span className="upper ml6">{token1.name}</span> {t('per')} <span className="upper">{token2.name}</span></p>
                        </dd>
                    </dl> 
                    : null
                }

                         
                
                <div className={styles.box_end}>
                    {
                        (tronlink.get('is_logined'))
                        ? <Button block size="large" className="big-radius-btn" type="primary" onClick={this.submitConfirm}>{t('submit')}</Button>
                        : <WalletConnectBtn block={true} size={'large'}/>
                    }
                </div>

                <div className={styles.box_tips}>
                    <span className={styles.tips_b}>Tip:</span>
                    {t('Removing pool tokens converts your position back into underlying tokens at the current rate, proportional to your share of the pool. Accrued fees are included in the amounts you receive.')}
                </div>


                {
                    (show_submit_confirm_modal)
                    ? <CheckModal visible={true} 
                        onCancel={this.handleCloseModals} 
                        onOk={this.checkModalConfirm}
                        amount={amount}
                        token1={{token:token1,amount:token1_amount}} 
                        token2={{token:token2,amount:token2_amount}}/>
                    : null
                }
                
                {
                    (show_step_confirm_modal)
                    ? <ConfirmModal visible={true} 
                        onCancel={this.handleCloseModals} 
                        active_step={active_step} 
                        steps={this.state.steps} 
                        amount={amount}
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
                        amount={amount}
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
