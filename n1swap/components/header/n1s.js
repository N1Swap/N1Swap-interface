import React from 'react';
import {Button,Modal} from 'antd';

import { connect } from "react-redux";
import styles from 'styles/components/header/n1s.module.less'
import Image from 'next/image'

import {ArrowCircleRight} from 'heroicons-react'

class N1SBtn extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            'is_show_modal' : false
        }
        this.toggleModal = this.toggleModal.bind(this)
    }   


    toggleModal(name) {
        this.setState({
            'is_show_modal' : !this.state.is_show_modal
        })
    }


    render() {

        const {is_loading,is_show_modal} = this.state;
        const {tronlink} = this.props;

        // let is_logined = (tronlink.get('is_login'));
        let is_logined = true;

        return (
            <div>
                <Button
                    className={styles.n1s_btn}
                    onClick={this.toggleModal}
                >
                    <Image src="/img/logo/white.svg" width={20} height={20}/>
                    <span className={styles.amount}>0</span>
                    <span className={styles.token}>N1S</span>
                </Button>
                <Modal
                    className={'border_modal color_modal'}
                    width={420}
                    footer={null}
                    title="Your N1S Breakdown" 
                    visible={is_show_modal} 
                    onCancel={this.toggleModal}>

                    {
                        (is_logined)
                        ? <div className={styles.login_n1s}>
                            <div className={styles.big_icon}>
                                <img src={'/img/token/n1s.svg'} className={'flip'} />
                            </div>
                            <div className={styles.title}>718233.58</div>
                            <div className={styles.n1s_info}>
                                <dl>
                                    <dt>Balance</dt>
                                    <dd>0.00</dd>
                                </dl>
                                <dl>
                                    <dt>Unclaimed</dt>
                                    <dd>122.332</dd>
                                </dl>
                            </div>
                            <div className={styles.claim_btn}>
                                <Button ghost block className="round-btn">Claim All</Button>
                            </div>
                        </div>
                        : null
                    }

                    <div className={styles.n1s_info}>
                        <dl>
                            <dt>N1S price</dt>
                            <dd>$83.00</dd>
                        </dl>
                        <dl>
                            <dt>N1S in circulation</dt>
                            <dd>310304.45</dd>
                        </dl>
                        <dl>
                            <dt>Total Supply</dt>
                            <dd>100000000</dd>
                        </dl>
                    </div>
                    <div className={styles.bottom}>
                        <a className={styles.with_end_icon}>
                            <span>View N1S analytics</span>
                            <div className={styles.icon}>
                                <ArrowCircleRight size={16} />
                            </div>
                        </a>
                    </div>
                </Modal>
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

module.exports = connect(mapStateToProps,mapDispatchToProps)(N1SBtn)
