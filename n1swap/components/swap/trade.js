import React,{useRef} from 'react';

import { connect } from "react-redux";
import SwapInput from 'components/swap/input';
import SwapSetting from 'components/swap/setting';

import {Button} from 'antd';

import styles from 'styles/swap_trade.module.less'

import {ArrowNarrowDownIcon} from '@heroicons/react/outline';

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

        // console.log('debug,tronlink',tronlink.toJS());
        // console.log('debug-t',t);

        return (
            <div className={styles.box_wrapper}>
                <div className={styles.box_head}>
                    <div className={styles.title}>Swap</div>
                    <div className={styles.tool}>
                        <SwapSetting />
                    </div>
                </div>
                <div className={styles.box_content_top}>
                    <div className={styles.box_form}>
                        <div className={styles.box_from_input}>
                            <h3>From</h3>
                            <div className={styles.currency_input}>
                                <SwapInput 
                                    ref={this.fromRef}
                                    default_token={'TRX'} 
                                    disable_token={this.state.from_token_disable}
                                    setDisableToken={this.handleTokenDisable.bind({},'to')}
                                    />
                            </div>
                        </div>
                        <div className={styles.to}>
                            <div className={styles.to_icon}>
                                <ArrowNarrowDownIcon className={'icon-20'} />
                            </div>
                        </div>
                        <div className={styles.box_from_input}>
                            <h3>To</h3>
                            <div className={styles.currency_input}>
                                <SwapInput 
                                    ref={this.toRef}
                                    disable_token={this.state.to_token_disable}
                                    setDisableToken={this.handleTokenDisable.bind({},'from')}
                                    />
                            </div>
                        </div>
                    </div>
                    <div className={styles.box_footer}>
                        <Button block size="large" className="big-radius-btn" type="primary" onClick={this.test}>{'Get Value'}</Button>
                    </div>
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

module.exports = connect(mapStateToProps,mapDispatchToProps)(SwapTrade)
