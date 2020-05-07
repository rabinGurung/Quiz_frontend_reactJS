import React from 'react'
import {Route, Switch} from 'react-router-dom'
import Setting from '../Setting/Setting'
import Question from '../Question/Questions'
// two page path routing 
export default class App extends React.Component{
    render(){
        return(
            <Switch> 
                <Route exact path="/" render={()=>{
                    return <Setting/>
                }}/>
                <Route exact path="/question" render={()=>{
                    return <Question/>
                }}/>

                </Switch>
        )
}
}