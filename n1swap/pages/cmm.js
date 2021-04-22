import React, { useState,useContext} from 'react';

import classNames from 'classnames';
import PageWrapper from '../components/pagewrapper_light'
import Image from 'next/image'
import Recaptcha from '../components/common/recaptcha'
import {ArrowNarrowLeftIcon,XIcon} from '@heroicons/react/solid';
import {ArrowCircleRightIcon} from '@heroicons/react/outline';
import Head from 'next/head'
import Row from 'components/common/row'
import {Button,message,Input,Modal,Popover} from 'antd'
const {TextArea} = Input;
import {getTronWeb,Base58ToHex} from 'helper/tron'
import {fetchData,postData} from 'helper/http'

import {CheckIcon,CheckCircleIcon} from '@heroicons/react/solid';

import styles from '../styles/pages/cmm.module.less'

import {  Col,Divider } from 'antd';

import {t,tpure,strFormat} from 'helper/translate';
import translateContext from 'helper/translate/context'

import {isTronAddress} from 'helper/tron_util';
import {getSource} from 'helper/cookie'
import {CopyToClipboard} from 'react-copy-to-clipboard';

import getConfig from 'next/config'
const { publicRuntimeConfig } = getConfig()


const Cmm = () => {


    return <PageWrapper>
            <Head>
                <title>CMM Token Plan</title>
            </Head>
            <div className="color-bg">
            <div className="max-width">
                <div className={styles.cmm_page}>
                    <h1 className={styles.h1}>
                        <div className={styles.icon}><Image width={48} height={48} src="/img/chia/cmm.png" /></div>
                        CMM Token Plan
                    </h1>

                    <div className={styles.main}>

                        <div className={styles.banner}><img src="/img/chia/banner.png" className={styles.banner_image}/></div>

                        <p>{t('CMM (Chia Mining Machine) is the token of TRC20 on Tron. At the beginning, we expect to issue 1 million CMM tokens, 1 CMM = 1 USDT')}</p>
                        <p>{t('When the offering is completed, we will purchase the Chia Mining Machine corresponding to 1 million USDT and start to access the Chia network for mining, which is equivalent to you purchasing the CMM tokens, you will purchase the Chia Mining Machine with the corresponding price and can get the corresponding Chia mining revenue.')}</p>

                        <h2>{t('About the purchaser')}</h2>

                        <p>{t('We will purchase Chia mining machines from Dragon Gate Technology Co.Ltd.')}</p>
                        <p>{t('Compared to other companies, Dragon Gate has already provided a large number of Fil miners and has good mining revenue in the industry, so we will directly purchase Chia miners developed by them for mining and strive to quickly merge into the Chia network to get more revenue.')}</p>

                        <h2>{t('About Chia\'s share.')}</h2>

                        <p>{t('The portion of Chia revenue will be offset against the base cost of electricity + hosting fees. The remaining Chia tokens are distributed as revenue to all users who hold CMM tokens.')}')}</p>
                        <p>{t('We will simultaneously issue a 1:1 Chia corresponding TRC20 token in the Tron network, tentatively named TCHIA, and you will receive a regular share of the TCHIA token when you hold a CMM token. You can destroy TCHIA through a smart contract provided by us and receive the corresponding Chia tokens on Chia\'s network.')}</p>
                        <p>{t('Later we will provide a system for retrieving, collecting and exchanging your Chia tokens.')}</p>

                        <h2>{t('About audit and financial disclosure.')}</h2>

                        <ul>
                            <li>{t('We will disclose the purchase price, purchase cost, fees, etc. through a regular release method, mainly the purchase cost of the miner, installation cost and hosting cost and hosting quantity, the expected number of mining, etc.')}</li>
                            <li>{t('The disclosure method is expected to be once a month, if there are no additional purchases in the month, then there is no need to disclose.')}</li>
                        </ul>
                        <h2>{t('Project timeline.')}</h2>

                        <ul>
                            <li>{t('fund raising phase. 22 April 2021 - 27 April 2021.')}</li>
                            <li>{t('mining machine procurement installation and commissioning phase. Expected to last 1-3 months, we will regularly disclose the installation of mining machines.')}</li>
                            <li>{t('The miner\'s ledger system is expected to be online no later than mid-May 2021, when you can directly view the corresponding revenue of your account through the ledger system, receive TCHIA tokens, or destroy TCHIA to receive CHIA tokens.')}</li>
                        </ul>

                        <h2>{t('the advantages of buying CMM tokens instead of directly buying miners')}</h2>
                        <ul>
                            <li>{t('Eliminate the workload of installation, maintenance and debugging, which is equivalent to outsourcing all the services of the miner.')}</li>
                            <li>{t('CMM tokens will be traded on the exchange, and you can sell them at any time to exchange for the corresponding cash. It is very difficult to realize the operation by holding the mining machine.')}</li>
                        </ul>

                        <h2>{t('purchase and distribution of tokens')}</h2>

                        <ul>
                            <li>{t('You can exchange CMM tokens by depositing USDT (TRC20) or TRX. If you deposit TRX, the number of tokens will be calculated according to the end of the project (2021-4-27) price and the UDST price when we exchange USDT.')}</li>
                            <li>{t('The first 24 hours of deposit will result in an additional 2% of CMM tokens.')}</li>
                            <li>{t('The CMM development team will receive an additional 10% of the CMM tokens for necessary team expenses. the CMM development team tokens will be locked forever and will not be traded.')}</li>
                        </ul>
                        

                        <h2>{t('How to get CMM?')}</h2>
                        <div className={styles.quote}>
                            <p className={styles.p1}>{t('Deposit USDT(TRC20) or TRX to the address: TCMM35fUxqrBBBqBj82P66qHNw4M5sgWtz')}</p>
                            <p className={styles.p2}>{t('You will receive CMM token in April 27th,2021')}</p>
                        </div>
                        <ul>
                            <li>{t('When will the CMM tokens be distributed after purchase? It is expected to be April 27th')}</li>
                            <li>{t('When will you get your first Chia earnings after purchase? It is expected that we will distribute Chia token earnings once a week in the future, you can check your Chia tokens in the system and perform the collection operation.')}</li>
                            <li>{t('Because we are also unable to purchase too large amount of miners, in case we receive more than 1 million USDT equivalent of digital currency, we will give refunds to more than this part of users.')}</li>
                            <li>{t('If we dont raise 1 million USD , we will send refunds to all, and the CMM token will not be send anymore.')}</li>
                        </ul>

                        <h2>{t('Risks and Security Issues')}</h2>

                        <ul>
                            <li>{t('There is a risk that the miner may be delayed online, depending on the speed of hardware procurement and P-disk speed, and the time of accessing the network may be delayed.')}</li>
                            <li>{t('There are some force majeure risks for the mining project, including but not limited to legal and regulatory requirements, natural disasters, such as earthquakes, fires, etc. (We will regularly disclose the location and number of mining machines hosted)')}</li>
                            <li>{t('Hard drives have a life time. When a mining machine is used for mining. Inevitably there will be wear and tear, such as damage, so the amount of mining and the total power of the mining machine to access the network may have small fluctuations.')}</li>
                        </ul>


                    </div>
                </div>
            </div>
            </div>
    </PageWrapper>
    
}


export default Cmm;
