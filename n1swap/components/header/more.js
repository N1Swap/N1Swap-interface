import React from 'react';
import {Button,Popover} from 'antd';

import styles from 'styles/components/header/more.module.less'
import {DotsHorizontal} from 'heroicons-react'

class More extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
        }
    }   



    render() {

        let content = <div className="dropdown-menu">
            <ul>
                <li><a>Github</a></li>
                <li><a>WhitePaper</a></li>
            </ul>
        </div>

        return (
            <Popover placement="bottomRight" title={null} content={content} trigger="click">

                <Button
                    className={styles.more_btn}
                >
                    <DotsHorizontal size={24}/>
                </Button>

            </Popover>
        );
    }
}
module.exports = More
