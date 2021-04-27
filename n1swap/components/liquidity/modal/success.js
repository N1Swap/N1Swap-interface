 import React,{useRef} from 'react';

import classNames from 'classnames';
import {Button,Divider,Modal} from 'antd';
// import styles from 'styles/components/modal.module.less'

import { withRouter } from 'next/router'

import {PlusIcon} from '@heroicons/react/outline';

import {t} from 'helper/translate'

class CheckModal extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            is_loading  : false,
        }
    }   
    

    render() {

        const {token1,token2} = this.props;

        return (
            <Modal
                className={'border_modal'}
                width={420}
                title={null}
                visible={this.props.visible} 
                footer={null}
                onCancel={this.props.onCancel}
                >

                <div className="block-success">

                    <div className="success-icon">
                        <svg id="successAnimation" class="animated" xmlns="http://www.w3.org/2000/svg" width="116" height="116" viewBox="0 0 70 70">
                          <path id="successAnimationResult" fill="#D8D8D8" d="M35,60 C21.1928813,60 10,48.8071187 10,35 C10,21.1928813 21.1928813,10 35,10 C48.8071187,10 60,21.1928813 60,35 C60,48.8071187 48.8071187,60 35,60 Z M23.6332378,33.2260427 L22.3667622,34.7739573 L34.1433655,44.40936 L47.776114,27.6305926 L46.223886,26.3694074 L33.8566345,41.59064 L23.6332378,33.2260427 Z"/>
                          <circle id="successAnimationCircle" cx="35" cy="35" r="24" stroke="#979797" strokeWidth="2" stroke-linecap="round" fill="transparent"/>
                          <polyline id="successAnimationCheck" stroke="#979797" strokeWidth="2" points="23 34 34 43 47 27" fill="transparent"/>
                        </svg>
                    </div>

                    <h1>{t('You liquidity has been added')}</h1>

                    <Divider />

                    <div className="info">
                        <span className="tk1">{token1.amount}</span> 
                        <span className="token upper">{token1.token.name}</span> 
                        <span className="add"><PlusIcon className="icon-24"/></span>
                        <span className="tk1">{token2.amount}</span> 
                        <span className="token upper">{token2.token.name}</span> 
                    </div>

                    <div className="ft">
                        <Button block size="large" className="big-radius-btn" type="primary" onClick={()=>{this.props.onCancel(true)}}>{t('close')}</Button>
                    </div>

                    <div className="info-end">
                        {t('Transaction is confirming on tron network. Your liquidity will be added after that.')}
                    </div>
                    
                </div>


            </Modal>
        );
    }
}

module.exports = withRouter(CheckModal)
