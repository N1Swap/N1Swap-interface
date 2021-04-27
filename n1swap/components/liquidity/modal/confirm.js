 import React,{useRef} from 'react';

import classNames from 'classnames';
// import { connect } from "react-redux";
// import SwapInput from 'components/swap/input';
// import SwapSetting from 'components/swap/setting';
import Image from 'next/image'

import {Button,Divider,Modal,Steps} from 'antd';
const { Step } = Steps;

import styles from 'styles/components/modal.module.less'

import { withRouter } from 'next/router'
import {PlusIcon} from '@heroicons/react/outline';

import {t,strFormat} from 'helper/translate'

import {LoadingOutlined} from '@ant-design/icons'

class CheckModal extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
        }
    }   
    

    render() {

        const {steps,token1,token2,active_step} = this.props;

        /*
<Step title="Finished" description={null}/>
                        <Step title="In Progress" description={} />
                        <Step title="Waiting" description={null} />
        */

        let i = 0;

        let active_step_one = null;
        return (
            <Modal
                className={'border_modal'}
                width={420}
                title="Add Liquidity" 
                visible={this.props.visible} 
                footer={null}
                onCancel={this.props.onCancel}
                >

                <div className={styles.confirm_title}>
                    <div className={styles.p1}>
                        <span className={styles.amount}>{token1.amount}</span>
                        <span className={styles.token}>{token1.token.name}</span>
                    </div>
                    <div className={styles.p2}>
                        <span className={styles.addicon}><PlusIcon className="icon-24"/></span>
                    </div>
                    <div className={styles.p1}>
                        <span className={styles.amount}>{token2.amount}</span>
                        <span className={styles.token}>{token2.token.name}</span>
                    </div>
                </div>

                <Divider />

                <div className={styles.step_info}>{t('Please follow the instruction below to complete the process')}</div>

                <div className={styles.steps}>
                    <Steps direction="vertical" size="small" current={active_step}>
                        {
                            steps.map(one=> {
                                {/*console.log('debug=step',one.toJS())*/}
                                let desc = null;
                                if (i == active_step) {
                                    desc = <div className="loading-icon"><LoadingOutlined /></div>
                                    active_step_one = one
                                }
                                i += 1;
                                if (one.get('type') == 'approve') {
                                    return <Step title={strFormat(t('approve for {token}'),{token:one.get('token_name')})} description={desc} key={'step'+i}/>
                                }else if (one.get('type') == 'add_liquidity') {
                                    return <Step title={t('add liquidity')} description={desc} key={'step'+i}/>
                                }
                            })
                        }
                        
                    </Steps>
                </div>

                <div className={styles.ft}>
                    {
                        (active_step_one && active_step_one.get('status') == 'init')
                        ? <Button block size="large" className="big-radius-btn" type="primary" disabled >{t('Waiting for Sign')}</Button>
                        : null
                    }
                    {
                        (active_step_one && active_step_one.get('status') == 'abort')
                        ? <div>
                            <p className={styles.step_warning}>{active_step_one.get('message')}</p>
                            <Button block size="large" className="big-radius-btn" type="primary"  onClick={this.props.handleRetry}>{t('Retry')}</Button>
                        </div>
                        : null
                    }
                </div>

                


            </Modal>
        );
    }
}

module.exports = withRouter(CheckModal)
