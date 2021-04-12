import React, { useState } from 'react';


import classNames from 'classnames';
import PageWrapper from '../components/pagewrapper_light'
import Image from 'next/image'
import Recaptcha from '../components/common/recaptcha'
import {ArrowNarrowLeftIcon,XIcon} from '@heroicons/react/solid';
import {ArrowCircleRightIcon} from '@heroicons/react/outline';
import Head from 'next/head'
import Row from 'components/common/row'
import {Button,message,Input,Modal} from 'antd'
const {TextArea} = Input;
import {getTronWeb,Base58ToHex} from 'helper/tron'
import {fetchData,postData} from 'helper/http'

import {CheckIcon,CheckCircleIcon} from '@heroicons/react/solid';

import styles from '../styles/pages/comming.module.less'
import n1s_styles from 'styles/components/header/n1s.module.less'

import {  Col,Divider } from 'antd';

import {t} from 'helper/translate';

import {isTronAddress} from 'helper/tron_util';
import {getSource} from 'helper/cookie'
import {CopyToClipboard} from 'react-copy-to-clipboard';

import getConfig from 'next/config'
const { publicRuntimeConfig } = getConfig()

const Home = () => {


    let [address,setAddress] = useState('TWuMXxVXsHMSovtPXky4cdd1JE4oeKZeyQ');
    let [modal,setModal] = useState(true);
    let [n1s_count,setN1sCount] = useState(1);
    let [recaptcha,setRecaptcha] = useState('');
    let [isSave,setIsSave] = useState(false);


    let [isShare,setIsShare] = useState(0);
    let [isJoinClub,setisJoinClub] = useState(0);


    const getShareUrl = (addr) => {
        let website_url = publicRuntimeConfig['env']['WEBSITE'];
        return website_url+ "/?f="+addr;
    }

    const base_share_text = "Have you heard of Pixelschain? It's an NFT project on TRX. Everyone can participate and buy pixel points to form a crowdsourced pixel painting, and the early participants get the income of the later participants.";

    const getShareText = (addr) => {
        return base_share_text + getShareUrl(addr);
    }

    let dealResult = (result) => {
        console.log('dealResult',result);

        let is_share = !!Number(result.is_share) ? 1 : 0;
        let is_join_club = !!Number(result.is_join_club) ? 1 : 0;

        console.log('is_share',is_share);
        console.log('is_join_club',is_join_club);

        setIsShare(is_share);
        setisJoinClub(is_join_club);

        setIsSave(true);

    }

    let setAction = async (act,platform) =>{

        console.log('执行了setAction',act,platform,address);

        if (!address) {
            return;
        }

        if (!isTronAddress(address)) {
            return;
        }

        try {

            // isTronAddress(address);
            let result = await postData("/v1/airdrop/act",{
                'address'  : address,
                'action'   : act,
                'platform' : platform
            });

            console.log('请求API的结果是',result)

            if (result.status == 'success') {
                dealResult(result.data);
            }

            ///执行下一步
            // setModal(true)


        }catch(e) {
            message.error(e.message);
        }
    }


    let submitAddress = async () =>{
        console.log('address',address);
        console.log('recaptcha',recaptcha);

        if (!address) {
            message.error('address is not empty');
            return;
        }

        if (!isTronAddress(address)) {
            message.error('address is not Trx wallet address,please check it');
            return;
        }

        if (!recaptcha) {
            message.error('please waiting for recaptcha validation');
            return;
        }

        try {

            // isTronAddress(address);
            let result = await postData("/v1/airdrop/save",{
                'address'           : address,
                'recaptcha_token'   : recaptcha,
                'ref_address'       : getSource()
            });

            console.log('请求API的结果是',result)

            if (result.status == 'success') {
                dealResult(result.data);
            }


            ///执行下一步
            setModal(true)


        }catch(e) {
            message.error(e.message);
        }

    }


    const handleShare = (website) => {

        ///验证当前的add是否准确
        try {
            isTronAddress(addr)
        }catch(e) {
            message.error(e.message);
            return;
        }

        let text = base_share_text;
        let website_url = getShareUrl(addr);
        let share_url;

        switch(website) {
            case 'twitter':
                share_url = "https://twitter.com/intent/tweet?text=" + encodeURIComponent(text) + "&url=" + encodeURIComponent(website_url);
                break;
            case 'facebook':
                let title = "PixelsChain:"
                let description = "Pixel NFT on TRX"
                share_url = "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(website_url) +  "title="+encodeURIComponent(title) +  "description="+encodeURIComponent(description) +" &quote=" + encodeURIComponent(text);
        }

        let width = 500;
        let height = 400;

        window.open(share_url,"","toolbar=0, status=0, width=" + width + ", height=" + height);
        return;
    }

    let total_nst = 1;
    if (isShare) {
        total_nst += 10;
    }
    if (isJoinClub) {
        total_nst += 1;
    }

    let telegram_url = 'https://t.me/joinchat/xK_wg9e8Oz5lMmZl'
    let discord_url = 'https://discord.gg/XGXMy2sqwY'

    let btn_icon_size = 24;

    return <PageWrapper>
            <Head>
                <title>Home</title>
            </Head>
            <div>
                <div className={styles.block1}>
                <div className="max-width">

                <Row>
                    <Col span="24">
                        
                            <h1>{t('N1Swap,next TRX decentralized exchange worth investing in')}</h1>

                            <div className={styles.icon_wapper}>
                                <Image
                                    src="/img/logo/logo.svg"
                                    alt="N1Swap Logo"
                                    width={90}
                                    height={90}
                                    className="logo"
                                  />
                            </div>

                    </Col>
                </Row>

                <div className={styles.points}>

                <Row>
                    <Col span={24} lg={8}>
                        <div className={styles.one}>
                            <div className={styles.t}><span className={styles.icon}><ArrowCircleRightIcon className="icon-16"/></span>{t('Base on TRX network')}</div>
                            <div className={styles.i}>{t('low transaction GAS')}</div>
                        </div>
                    </Col>
                    <Col span={24} lg={8}>
                        <div className={styles.one}>
                            <div className={styles.t}><span className={styles.icon}><ArrowCircleRightIcon className="icon-16"/></span>{t('NST holder')}</div>
                            <div className={styles.i}>{t('Liquidity providers will receive a 0.25% transaction fee rate,NST holders receive a 0.05% transaction fee rate')}</div>
                        </div>
                    </Col>
                    <Col span={24} lg={8}>
                        <div className={styles.one}>
                            <div className={styles.t}><span className={styles.icon}><ArrowCircleRightIcon className="icon-16"/></span>{t('Lower Stablecoin trading slippage')}</div>
                            <div className={styles.i}>{t('Stablecoin trading pairs use a lower slippage algorithm (similar to Curve.fi)')}</div>
                        </div>
                    </Col>
                </Row>

                </div>

                </div>
                </div>

                <div className="white-bg">
                <div className="max-width">
                <Row>
                    <Col span="24">
                        <div className={styles.block2}>
                            <h1><span className={styles.title_icon}><Image
                                    src="/img/coming/cal.svg"
                                    width={40}
                                    height={40}
                                  /></span>{t('Coming in End of April, Get NST Airdop now')}</h1>
                           
                            <div className={styles.step}>
                                <div className={styles.step_l}>
                                    <div className={classNames(styles.step_n,styles.step_n1)}>
                                        Step 1
                                    </div>
                                    <h2>{t('Submit your Trx address')}</h2>
                                    <div className={styles.airdophelp}>
                                        <p>{t('We will be issuing airdrops of NST after N1Swap goes live')}</p>
                                        <p>{t('you can submit your address and get NST airdrops for free')}</p>
                                    </div>
                                </div>
                                <div className={styles.step_r}>
                                    {
                                        (isSave)
                                        ? <div className={styles.airdop_saved}>
                                            <div className={styles.icon}>
                                            <CheckCircleIcon className="icon-48 green" />
                                            </div>
                                            <div className={styles.address}>{address}</div>
                                            <div className={styles.nst}>{total_nst} NST</div>
                                            <div className={styles.info}>{t('will receive NST in May,2021')}</div>
                                        </div>
                                        : <div className={styles.box}>
                                            <Input size="large" className={styles.address} placeholder={'your Trx Wallet Address'} value={address} onChange={(e)=>setAddress(e.target.value)}/>
                                            <div className={styles.recaptcha}><Recaptcha onChange={setRecaptcha}/></div>
                                            <Button size="large" type="primary" block className="btn-round btn-big" onClick={submitAddress}>{t('Submit')}</Button>
                                        </div>
                                    }
                                </div>
                            </div>

                            <div className={styles.step}>
                                <div className={styles.step_l}>
                                    <div className={classNames(styles.step_n,styles.step_n2)}>
                                        Step 2
                                    </div>
                                    <h2>{t('Join in our community')}</h2>
                                    <div className={styles.airdophelp}>
                                        <p>{t('To ensure that the drops are made by real people and not bots')}</p>
                                        <p>{t('You will need to join our telegram or Discord community and we will verify your identity in the group.')}</p>
                                    </div>
                                </div>
                                <div className={styles.step_r}><div className={classNames(styles.box,styles.box2)}>
                                    <Button size="large" href={telegram_url} block className="btn-round btn-big btn-with-icon btn-social btn-telegram"  target="_blank" onClick={()=>setAction('join','telegram')}  type="primary" icon={
                                        <div className="icon"><Image src="/img/social/telegram_white.svg" width={btn_icon_size} height={btn_icon_size}/></div>
                                    }>Telegram</Button>
                                    <Button size="large" href={discord_url} block className="btn-round btn-big btn-with-icon btn-social btn-discord"  target="_blank" onClick={()=>setAction('join','discord')} type="primary" icon={
                                        <div className="icon"><Image src="/img/social/discord_white.svg" width={btn_icon_size} height={btn_icon_size}/></div>
                                    }>Discord</Button>
                                </div></div>
                            </div>

                            <div className={styles.step}>
                                <div className={styles.step_l}>
                                    <div className={classNames(styles.step_n,styles.step_n2)}>
                                        Step 3
                                    </div>
                                    <h2>{t('Share in Twitter or FB')}</h2>
                                    <div className={styles.airdophelp}>
                                        <p>{t('if someone fill the airdop with your share url, you will get 10X airdop.')}</p>
                                    </div>
                                </div>
                                <div className={styles.step_r}>
                                    <div className={styles.box}>


                                    <div className={styles.text_box}>
                                        <TextArea autoSize={{ minRows: 7, maxRows: 10 }} value={getShareText(address)}>
                                        </TextArea>
                                    </div>

                                    <div className={styles.buttons}>
                                        
                                        <div className={styles.row_2}>
                                            <CopyToClipboard text={getShareText(address)}
                                                onCopy={() => message.success('copy success')}>
                                            <Button block className="btn-round btn-big btn-with-icon  btn-social btn-normal">COPY TEXT</Button>
                                            </CopyToClipboard>
                                        </div>
                                        <div className={styles.row_1}>
                                            <Button size="large" onClick={()=>handleShare.bind({},'twitter')} block className="btn-round btn-big btn-with-icon  btn-social btn-twitter" type="primary" icon={
                                                <div className="icon"><Image src="/img/social/twitter_white.svg" width={btn_icon_size} height={btn_icon_size}/></div>
                                            }>Twitter</Button>

                                            <Button size="large" onClick={()=>handleShare.bind({},'facebook')} block className="btn-round btn-big btn-with-icon  btn-social btn-fb" type="primary" icon={
                                                <div className="icon"><Image src="/img/social/fb_white.svg" width={btn_icon_size} height={btn_icon_size}/></div>
                                            }>Facebook</Button>
                                        </div>
                                    </div>

                                    

                                    </div>
                                </div>
                            </div>

                            <div className={styles.notice}>
                            <h2>{t('Notice')}</h2>
                            <div className={styles.airdophelp}>
                                <p>{t('1 ip address, 1 device only 1 airdop trx address per day, that means if one user send more then 1 address, the others will be ignore.')}</p>
                            </div>
                            </div>

                        </div>
                    </Col>
                </Row>
                </div>
                </div>
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
                        <div className={n1s_styles.title}>{total_nst} NST</div>
                        <div className={styles.center_notice2}>{address}</div>
                        <div className={styles.center_notice}>NST will be send in May,2021</div>
                    </div>

                    <div className={n1s_styles.n1s_info}>
                        <div className={styles.modal_extra_title}>{t('Extra Reward')} ①</div>
                        <h2 className={styles.h2}>join our community get 1 NST more</h2>
                        {
                            (isJoinClub)
                            ? <div className={styles.finished}><div className={styles.inner}>
                                <CheckIcon className="icon-24" /> 
                                <span>{t('Already obtained')}</span>
                            </div></div>
                            : <div className={styles.joinin}>
                                <Button href={telegram_url} target="_blank" 
                                    onClick={()=>setAction('join','telegram')}  className="btn-with-icon btn-round" 
                                    ghost 
                                    icon={<div className="icon"><Image src="/img/social/telegram_white.svg" width={btn_icon_size} height={btn_icon_size}/></div>}
                                    >Telegram</Button>
                                <Button href={discord_url} target="_blank" 
                                    onClick={()=>setAction('join','discord')} 
                                    className="btn-with-icon  btn-round" ghost 
                                    icon={<div className="icon"><Image src="/img/social/discord_white.svg" width={btn_icon_size} height={btn_icon_size}/></div>}
                                    >Discord</Button>
                            </div>
                        }
                    </div>
                    <Divider className="white" />
                    <div className={n1s_styles.n1s_info}>
                        <div className={styles.modal_extra_title}>{t('Extra Reward')} ②</div>
                        <h2 className={styles.h2}>share in Twitter and get 10 NST more</h2>
                        {
                            (isShare)
                            ?  <div className={styles.finished}><div className={styles.inner}>
                                    <CheckIcon className="icon-24" /> 
                                    <span>{t('Already obtained')}</span>
                            </div></div>
                            :   <div className={styles.joinin}>

                                <Button onClick={()=>setAction('share','twitter')} className="btn-with-icon btn-round" ghost icon={<div className="icon"><Image src="/img/social/twitter_white.svg" width={btn_icon_size} height={btn_icon_size}/></div>}>Twitter</Button>
                            </div>
                        }
                    </div>

                </Modal>

            </div>
    </PageWrapper>
    
}

// Home.getInitialProps = ({store, pathname, req, res}) => {
//     console.log('2. Page.getInitialProps uses the store to dispatch things');
//     store.dispatch({type: 'TICK', payload: 'was set in error page ' + pathname});
// };

export default Home;
