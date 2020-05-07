import React from "react"
import axios from 'axios'
export default class Questions extends React.Component{
    constructor(){
        super()
        this.state={
            data:[],
            run:1,
            question:"",
            answer:[],
            correct:0,
        }
        this.fetchDataFromServer = this.fetchDataFromServer.bind(this)
        this.onClickNext = this.onClickNext.bind(this)
        this.onClickAnswer = this.onClickAnswer.bind(this)
    }
    render(){
        return(
            <div className="container text-center mt-5">
                <h1>{this.state.question}</h1>
                {
                    this.state.answer.map(data=>(
                        <button key={data} className="form-control" id={data} onClick={this.onClickAnswer}>{data}</button>
                    ))
                }
                <br/>
                <br/>
                <button id="next" onClick={this.onClickNext}>next</button>
                </div>
        )
    }
    onClickAnswer(e){
        e.preventDefault()
        var id = e.target.id
        var array = this.state.data
        // finding correct index and checking if the obtained answer's index is the correct answer's index
        for(var x = 0; x<array.length; x++){
                if(array[x].name === this.state.question){
                    var array1 = array[x].answer
                for(var y = 0; y<array1.length; y++){
                if(array1[y] === id) {
                    console.log(this.state.data)
                if(y === this.state.data[x].correct){   
                    alert("Correct Answer")
                }
                }
                }
            }
            
        }
    }
    componentDidMount(){
        this.fetchDataFromServer()
    }
    fetchDataFromServer(){  // fetching data from the server
        axios.get("/question/getques")
        .then((result)=>{
            var data = []
            for(var y in result.data){
                var isFound = false
                if(data.length === 0){
                    var correct1 = result.data[y].isReal
                    data = [{
                        name:result.data[y].Ques,
                        answer:[result.data[y].Ans],
                        correct: correct1
                    }]
                }else{
                    for (var z in data ){
                        if(data[z].name === result.data[y].Ques){
                            data[z].answer= data[z].answer.concat(result.data[y].Ans)
                            var correct2 = result.data[y].isReal
                            data[z].correct = correct2
                            isFound = true
                            break
                        }
                    }
                    if(isFound === false){
                        var correct = result.data[y].isReal
                        data = data.concat({
                            name:result.data[y].Ques,
                            answer:[result.data[y].Ans],
                            correct: correct
                        })
                    }
                    
                }
                this.setState({
                    data : data,
                })
            }
            this.setState({
                question:this.state.data[0].name,
                answer:this.state.data[0].answer,
                correct:this.state.data[0].correct
            })
        })
        .catch((err)=>{

        })
        
    }
    onClickNext(e){  // every click will change the index
        e.preventDefault()
        if(this.state.run < this.state.data.length){
                this.setState({
                    run : this.state.run + 1 ,
                    question:this.state.data[this.state.run].name,
                        answer:this.state.data[this.state.run].answer,
                        correct:this.state.data[this.state.run].correct,
                        next:true
                })
        }
    }          
}