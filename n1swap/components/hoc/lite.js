import React, { Component } from 'react'

export default class CommonLite extends Component {
    
    constructor(props) {
        super(props)
        
        this.handleEventValueChange = ::this.handleEventValueChange
        this.handleValueChange = ::this.handleValueChange
        this.handleCheckboxValueChange = ::this.handleCheckboxValueChange
    }

    handleValueChange(key_name,value) {
        var new_state = {}
        new_state[key_name] = value
        console.log('handleValueChange',key_name,value)
        this.setState(new_state)
    }

    handleEventValueChange(key_name,event){
        // var value = event.target.value;
        var new_state = {}
        new_state[key_name] = event.target.value;
        this.setState(new_state);
    }

    handleCheckboxValueChange(key_name,event){
        var new_state = {}
        new_state[key_name] = event.target.checked;
        this.setState(new_state);
    }

}