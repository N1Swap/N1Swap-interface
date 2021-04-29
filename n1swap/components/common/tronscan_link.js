import PropTypes from 'prop-types'
import React from 'react'
import {getTronscanUrl} from 'helper/config'

const TronscanLink = ({ tx_id , text }) => {

    let tronscan_url = getTronscanUrl();
    if (!text) {
        text = 'view in tronscan'
    }
    return (
        <a className={'tronscan-a'} href={tronscan_url+'#/transaction/'+tx_id} target="_blank">
            {text}
        </a>
    )
}

TronscanLink.propTypes = {
  // activeClassName: PropTypes.string.isRequired,
  tx_id: PropTypes.string.isRequired,
}

export default TronscanLink