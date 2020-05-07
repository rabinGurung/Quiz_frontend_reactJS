import React from 'react'
export default class Set extends React.Component{
    constructor(prop){
        super(prop)
        this.AddMoreAnswer = this.AddMoreAnswer.bind(this)
    }
    render(){
        return(
            <div>
                <h1>{this.props.question}</h1>
                {
                    this.props.answer.map(data=>(
                    <p key={data}>{data}</p>
                    ))
                }
                <button id="addMoreOption" onClick={this.AddMoreAnswer}>Add Item</button>
            </div>
        )
    }
    componentDidMount(){
     
    }

    AddMoreAnswer(e){
        e.preventDefault()
        this.props.onCheckLimit(this.props.question) 
    }

}