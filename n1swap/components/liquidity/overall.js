import React,{useRef} from 'react';
import { withRouter } from 'next/router'

import { connect } from "react-redux";
import SwapInput from 'components/swap/input';
import SwapSetting from 'components/swap/setting';

import {Button,Divider,Tooltip} from 'antd';

import styles from 'styles/swap_trade.module.less'

import {QuestionMarkCircleIcon} from '@heroicons/react/outline';
import {t} from 'helper/translate'


class SwapTrade extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            is_loading  : false,
            from_token_disable : null,
            to_token_disable   : null
        }

        this.fromRef = React.createRef();
        this.toRef   = React.createRef();

        this.handleTokenChange = this.handleTokenChange.bind(this)
        this.handleAmountChange = this.handleAmountChange.bind(this)
        this.handleTokenDisable = this.handleTokenDisable.bind(this)

        this.test = this.test.bind(this);

    }   
    
    handleTokenChange(key_name,token_name) {
        let new_state = {};
        new_state[key_name] = token_name
        this.setState(new_state);
    }

    handleAmountChange(key_name,e) {
        let new_state = {};
        new_state[key_name] = e.target.value
        this.setState(new_state);
    }

    test() {
        console.log('this.fromRef',this.fromRef.current.getValue());
    }

    handleTokenDisable(name,token) {
        if (name == 'from') {
            this.setState({
                'from_token_disable' : token
            })
        }else if (name == 'to') {
            this.setState({
                'to_token_disable' : token
            })
        }
    }



    render() {

        const {is_loading,
            from_token_name,from_token_amount,
            to_token_amount,to_token_name} = this.state;
        const {tronlink} = this.props;

        console.log('debug,tronlink',tronlink.toJS());
        // console.log('debug-t',t);

        return (
            <div className={styles.box_wrapper}>
                <div className={styles.box_head}>
                    <div className={styles.title}>
                        Liquidity
                        <div className={styles.sub}>Add liquidity to receive LP tokens.</div>
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
                        : <div className={styles.unlogin_box}>Connect to a wallet to view your liquidity.</div>
                    }
                </div>

                <Divider />

                <div className={styles.box_content_footer}>
                    <p className={styles.footer_text}>Don't see a pool you joined?<a>Impot it</a></p>
                </div>

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
    }
}

module.exports = withRouter(connect(mapStateToProps,mapDispatchToProps)(SwapTrade))
