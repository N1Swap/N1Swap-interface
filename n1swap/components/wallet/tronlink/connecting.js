import React from 'react';
import {Button,message} from 'antd';
import Image from 'next/image'
import { BrowserView, MobileView ,isMobile} from "react-device-detect";
import styles from 'styles/components/wallet/base.module.less'
import {CopyToClipboard} from 'react-copy-to-clipboard';

class TronlinkConnecting extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
        }
    }   

    render() {
        return (
            <div className={styles.block_connecting}> 
                <div className={styles.hd}>
                    <div className={styles.icon}> <Image
                        src={"/img/wallet/tronlink.jpg"}
                        width={20}
                        height={20}
                        layout="fixed"
                    /></div>
                    <div className={styles.name}>TronLink Wallet</div>
                </div>
                <div className={styles.connecting}>
                    <Image src="/img/favicon.png" width={32} height={32} />
                </div>
                {
                    (isMobile)
                    ? <div className={styles.p}>Please open "n1swap.com" in Tronlink App</div>
                    : <div className={styles.p}>Please open TronLink Wallet manual</div>
                }

                <MobileView>
                    <CopyToClipboard text={'https://www.n1swap.com'}
                        onCopy={() => message.success('copy success')}>
                        <Button className="pixel-btn" block>Copy Url</Button>
                    </CopyToClipboard>
                </MobileView>
            </div>
        );
    }
}


module.exports = TronlinkConnecting
