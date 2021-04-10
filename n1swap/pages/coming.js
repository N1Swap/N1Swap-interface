import React, { useState } from 'react';

import {wrapper} from '../redux/store';

import PageWrapper from '../components/pagewrapper'
import Image from 'next/image'
import Recaptcha from '../components/common/recaptcha'
import {ArrowNarrowLeftIcon,XIcon,ArrowCircleRightIcon} from '@heroicons/react/solid';

import Head from 'next/head'

import {Button,message,Input,Modal} from 'antd'
import {getTronWeb,Base58ToHex} from 'helper/tron'
import Row from 'components/common/row'

import styles from '../styles/pages/comming.module.less'
import n1s_styles from 'styles/components/header/n1s.module.less'

import {  Col,Divider } from 'antd';

import {t} from 'helper/translate';

import {isTronAddress} from 'helper/tron_util';

const Home = () => {


    let [address,setAddress] = useState('');
    let [modal,setModal] = useState(false);
    let [n1s_count,setN1sCount] = useState(1);

    let submitAddress = () =>{
        console.log('address',address);

        try {
            
            // isTronAddress(address);

            ///执行下一步

            setModal(true)


        }catch(e) {
            message.error(e.message);
        }

    }

    return <PageWrapper>
            <Head>
                <title>Home</title>
            </Head>
            <div className="max-width">
                <Row>
                    <Col span="24">
                        <div className={styles.block1}>
                        <h1>{t('N1Swap,next TRX decentralized exchange worth investing in')}</h1>
                        <div className={styles.points}>
                            <div className={styles.one}><span className="emoji">💡</span>{t('Liquidity providers will receive a 0.25% transaction fee rate')}</div>
                            <div className={styles.one}><span className="emoji">💡</span>{t('N1S holders receive a 0.05% transaction fee rate')}</div>
                            <div className={styles.one}><span className="emoji">💡</span>{t('Based on Tron network, low transaction GAS')}</div>
                            <div className={styles.one}><span className="emoji">💡</span>{t('Stablecoin trading pairs use a lower slippage algorithm (similar to Curve)')}</div>
                        </div>
                        </div>
                    </Col>
                </Row>
                <Divider />
                <Row>
                    <Col span="24">
                        <div className={styles.block2}>
                            <h1><span className="emoji">📅</span>{t('Coming in End of April, Get N1S Airdop now')}</h1>
                           
                            <h2>{t('Step 1, Submit your Trx address')}</h2>
                            <div className={styles.airdop}>
                                <Input size="large" className={styles.address} placeholder={'your Trx Wallet Address'} value={address} onChange={(e)=>setAddress(e.target.value)}/>
                                <div className={styles.recaptcha}><Recaptcha /></div>
                                <Button size="large" type="primary" onClick={submitAddress}>{t('Submit')}</Button>
                            </div>


                            <div className={styles.airdophelp}>
                                <p>{t('We will be issuing airdrops of N1S after N1Swap goes live')}</p>
                                <p>{t('you can submit your address and get N1S airdrops for free')}</p>
                            </div>
                            <h2>{t('Step 2, Join in our community')}</h2>

                            <div className={styles.joinin}>
                                <Button size="large" className="btn-with-icon" type="primary" icon={<div className="icon"><Image src="/img/social/telegram_white.svg" width={16} height={16}/></div>}>Telegram</Button>
                                <Button size="large" className="btn-with-icon" type="primary" icon={<div className="icon"><Image src="/img/social/discord_white.svg" width={16} height={16}/></div>}>Discord</Button>
                            </div>
                            <div className={styles.airdophelp}>
                                <p>{t('To ensure that the drops are made by real people and not bots')}</p>
                                <p>{t('You will need to join our telegram or Discord community and we will verify your identity in the group.')}</p>
                            </div>

                            <h2>{t('Step 3, Share in Twitter or FB')}</h2>

                            <div className={styles.joinin}>
                                <Button size="large"  className="btn-with-icon" type="primary" icon={<div className="icon"><Image src="/img/social/twitter_white.svg" width={16} height={16}/></div>}>Twitter</Button>
                            </div>
                            <div className={styles.airdophelp}>
                                <p>{t('To let more Trx holder know about N1S,and make N1S more valueable')}</p>
                                <p>{t('We would greatly appreciate your help in sharing')}</p>
                            </div>

                            <Divider />

                            <h2>{t('Notice')}</h2>
                            <div className={styles.airdophelp}>
                                <p>{t('1 ip address, 1 device only 1 airdop trx address per day, that means if one user send more then 1 address, the others will be ignore.')}</p>
                                <p>{t('Please join in our community and get our new messages')}</p>
                            </div>


                        </div>
                    </Col>
                </Row>
                <Modal
                    closeIcon={<XIcon className="icon-20" />}
                    className={'border_modal color_modal'}
                    width={420}
                    footer={null}
                    title="Congratulations" 
                    visible={modal} 
                    onCancel={()=>setModal(false)}>

                    <div className={n1s_styles.login_n1s}>

                        <div className={n1s_styles.big_icon}>
                            <img src={'/img/token/n1s.svg'} className={'flip'} />
                        </div>
                        <div className={n1s_styles.title}>{n1s_count} N1S</div>
                        <div className={styles.center_notice2}>{address}</div>
                        <div className={styles.center_notice}>N1S will be send in May,2021</div>
                    </div>

                    {
                        (n1s_count < 2)
                        ? <div className={n1s_styles.n1s_info}>
                            <h2 className={styles.h2}>join our community get 1 N1S more</h2>
                            <div className={styles.joinin}>
                                <Button size="large" onClick={()=>{
                                    setN1sCount(2);
                                }} className="btn-with-icon" type="danger" icon={<div className="icon"><Image src="/img/social/telegram_white.svg" width={16} height={16}/></div>}>Telegram</Button>
                                <Button size="large" onClick={()=>{
                                    setN1sCount(2);
                                }} className="btn-with-icon" type="danger" target="_blank" href={'https://discord.com/invite/aj8Q2AS9S2'} icon={<div className="icon"><Image src="/img/social/discord_white.svg" width={16} height={16}/></div>}>Discord</Button>
                            </div>
                        </div>
                        : <div className={n1s_styles.n1s_info}>
                        <h2 className={styles.h2}>share in Twitter and get 10 N1S more</h2>
                        <div className={styles.joinin}>
                            <Button size="large"  className="btn-with-icon" type="danger" icon={<div className="icon"><Image src="/img/social/twitter_white.svg" width={16} height={16}/></div>}>Twitter</Button>
                        </div>
                    </div>
                    }

                    

                </Modal>
            </div>
    </PageWrapper>
    
}

// Home.getInitialProps = ({store, pathname, req, res}) => {
//     console.log('2. Page.getInitialProps uses the store to dispatch things');
//     store.dispatch({type: 'TICK', payload: 'was set in error page ' + pathname});
// };

export default Home;
