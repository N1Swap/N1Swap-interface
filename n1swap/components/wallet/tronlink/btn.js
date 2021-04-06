import React from 'react';
import styles from 'styles/components/wallet/base.module.less'
import Image from 'next/image'

class TronlinkBtn extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
        }
    }   

    render() {

        return (
            <div>
                <a className={styles.wallet_list_btn} onClick={this.props.onClick}>
                    <span className={styles.name}>TronLink</span>
                    <span className={styles.icon}><Image src="/img/wallet/tronlink.jpg" width={24} height={24} className="wallet-icon-img"/></span>
                </a>
            </div>
        );
    }
}
export default TronlinkBtn
