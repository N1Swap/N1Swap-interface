import PropTypes from 'prop-types'
import React from 'react'
import Image from 'next/image'

const TokenIcon = ({ token , size  }) => {

    return (
        <Image
            src={"/img/token/"+token.icon}
            width={size}
            height={size}
            layout="fixed"
        />
    )
}

TokenIcon.propTypes = {
  tx_id: PropTypes.string.isRequired,
  size : PropTypes.number.isRequired,
}

export default TokenIcon