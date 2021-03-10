import React from 'react';
import {Button} from 'antd';

import { connect } from "react-redux";
import styles from 'styles/components/header/n1s.module.less'
import Image from 'next/image'

class N1SBtn extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
        }
    }   


    render() {

        const {is_loading} = this.state;
        // const {tronlink} = this.props;

        return (
            <div>
                <Button
                    className={styles.n1s_btn}
                >
                    <Image src="/img/logo/white.svg" width={20} height={20}/>
                    <span className={styles.amount}>0</span>
                    <span className={styles.token}>N1S</span>
                </Button>
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
