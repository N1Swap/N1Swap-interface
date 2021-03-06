import React from 'react';
import {Button,Tag,Typography} from 'antd';
// const { Paragraph, Text } = Typography;

// import { initStore } from '../redux/store';
// import {tronlink_installed,tronlink_logined,tronlink_set_account} from '../redux/reducer/setting';
import { connect } from "react-redux";
import styles from 'styles/n1s_btn.module.css'

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
                    className="account-btn"
                >
                    <span className={'amount'}>0</span>
                    <span className={'name'}>N1S</span>
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
