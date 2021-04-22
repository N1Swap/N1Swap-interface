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

import {t} from 'helper/translate'

import {LoadingOutlined} from '@ant-design/icons'

class CheckModal extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            is_loading  : false,
        }
    }   
    

    render() {


        return (
            <Modal
                className={'border_modal'}
                width={420}
                title="Add Liquidity" 
                visible={this.props.visible} 
                footer={null}
                onClose={this.handleClose}
                onOk={this.handleOk} 
                >

                <div className={styles.confirm_title}>
                    <div className={styles.p1}>
                        <span className={styles.amount}>17.232322</span>
                        <span className={styles.token}>TRX</span>
                    </div>
                    <div className={styles.p2}>
                        <span className={styles.addicon}><PlusIcon className="icon-24"/></span>
                    </div>
                    <div className={styles.p1}>
                        <span className={styles.amount}>7.132</span>
                        <span className={styles.token}>USDT</span>
                    </div>
                </div>

                <Divider />

                <div className={styles.step_info}>{t('Please follow the instruction below to complete the process')}</div>

                <div className={styles.steps}>
                    <Steps direction="vertical" size="small" current={1}>
                        <Step title="Finished" description={null}/>
                        <Step title="In Progress" description={<div className="loading-icon"><LoadingOutlined /></div>} />
                        <Step title="Waiting" description={null} />
                    </Steps>
                </div>

                <div className={styles.ft}>
                    <Button block size="large" className="big-radius-btn" type="primary" onClick={this.test}>{t('confirm')}</Button>
                </div>

                


            </Modal>
        );
    }
}

module.exports = withRouter(CheckModal)
