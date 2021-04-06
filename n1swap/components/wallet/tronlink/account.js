import React from 'react';
import {Button,Typography,Divider,message} from 'antd';
const { Title } = Typography;
import {CursorClickIcon,DuplicateIcon} from '@heroicons/react/outline';
import classNames from 'classnames';

import Image from 'next/image'
import styles from 'styles/components/wallet/base.module.less'
import {CopyToClipboard} from 'react-copy-to-clipboard';

class TronlinkAccount extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
        }
    }   

    render() {
        const {account} = this.props;
        return (
            <div className={styles.wallet_info}>
                <p className={styles.sub}>Connected with TronLink</p>
                <div className={styles.address}>
                    <div className={styles.icon}>
                        <Image
                            src={"/img/wallet/tronlink.jpg"}
                            width={20}
                            height={20}
                            layout="fixed"
                        />
                    </div>
                    <div className={classNames("flex-start",styles.addr)}>

                        {
                            (account.get('account'))
                            ? account.get('account').slice(0,5) + '...' + account.get('account').slice(-5)
                            : '...'
                        }
                        <CopyToClipboard text={account.get('account')}
                            onCopy={() => message.success('copy success')}>
                            <DuplicateIcon className="icon-24" />
                        </CopyToClipboard>
                    </div>
                </div>
                <Divider />
                <div className={styles.more}>
                    <div className={styles.morep}>
                        <a><CursorClickIcon className={"icon-16"} />View on Tronscan</a>
                    </div>
                </div>
            </div>
        );
    }
}


module.exports = TronlinkAccount
