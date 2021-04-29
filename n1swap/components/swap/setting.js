import React from 'react';
import {Modal,Input,Button,Tooltip} from 'antd';
import classNames from 'classnames'

import { connect } from "react-redux";
import Image from 'next/image'

import styles from 'styles/components/swap/setting.module.less'
import {t} from 'helper/translate'

import {CogIcon,QuestionMarkCircleIcon} from '@heroicons/react/outline';

class SwapInput extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            'tolerance'             : 1.0,
            'deadline'              : 20,
            'is_open_modal'         : false,
        }

        this.getValue = this.getValue.bind(this)
        this.toggleOpenModal = this.toggleOpenModal.bind(this)
        this.handleEventValueChange = this.handleEventValueChange.bind(this)
        this.setTolerance = this.setTolerance.bind(this)
        this.getTolerance = ::this.getTolerance
    }

    getValue() {
        return {
            'tolerance'  : Number(this.state.tolerance),
            'deadline'   : Number(this.state.deadline)
        }
    }


    toggleOpenModal() {
        this.setState({
            'is_open_modal' : !this.state.is_open_modal
        })
    }

    setTolerance(v) {
        this.setState({
            'tolerance' : v
        })
        if (this.props.onChange) {
            this.props.onChange({
                'tolerance' : v
            });
        }
    }

    getTolerance() {
        return this.state.tolerance / 100;
    }

    handleEventValueChange(key_name,event){
        var new_state = {}
        new_state[key_name] = event.target.value;
        this.setState(new_state);

        if (this.props.onChange) {
            this.props.onChange(new_state);
        }
    }


    render() {


        const {tolerance,deadline,is_open_modal} = this.state;

        return (
            <div className={styles.input_wrapper}>

                <a className={styles.btn} onClick={this.toggleOpenModal}>
                    <CogIcon className="icon-20" />
                </a>
                
                {
                    (is_open_modal)
                    ? <Modal 
                        className={'border_modal'}
                        width={420}
                        title="Settings" 
                        visible={is_open_modal} 
                        onOk={this.handleOk} 
                        footer={null}
                        onCancel={this.toggleOpenModal}>
                        <div className={styles.setting_wrapper}>
                            <div className={styles.setting_one}>
                                <div className={styles.head}>
                                    <h3>{t('Slippage tolerance')}</h3>
                                    <Tooltip placement="top" title={'your transaction will revert'}>
                                        <QuestionMarkCircleIcon className='icon-16' />
                                    </Tooltip>
                                </div>
                                <div className={styles.ct}>
                                    <a onClick={this.setTolerance.bind({},0.1)} className={(tolerance == 0.1) ? classNames(styles.one,styles.active) : styles.one}>0.1%</a>
                                    <a onClick={this.setTolerance.bind({},0.5)} className={(tolerance == 0.5) ? classNames(styles.one,styles.active) : styles.one}>0.5%</a>
                                    <a onClick={this.setTolerance.bind({},1)} className={(tolerance == 1) ? classNames(styles.one,styles.active) : styles.one}>1%</a>
                                    <Input value={tolerance} className={styles.input} onChange={this.handleEventValueChange.bind({},'tolerance')} suffix="%"/>
                                </div>
                            </div>
                            <div className={styles.setting_one}>
                                <div className={styles.head}>
                                    <h3>{t('Transaction deadline')}</h3>
                                    <Tooltip placement="top" title={'your transaction will revert'}>
                                        <QuestionMarkCircleIcon className='icon-16' />
                                    </Tooltip>
                                </div>
                                <div className={styles.ct}>
                                    <Input className={classNames(styles.input,styles.time_input)}  
                                        value={deadline} 
                                        onChange={this.handleEventValueChange.bind({},'deadline')}
                                        suffix="minutes"/>
                                </div>
                            </div>
                        </div>
                    </Modal>
                    : null
                }

            </div>
        );
    }
}

module.exports = SwapInput
