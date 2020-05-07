import React from "react";
import Axios from "axios";
import Set from './Set'
export default class Setting extends React.Component{
    constructor(){
        super()
        this.state = {
            data : null,
            loading:false,
            isadd:false,
            question : "",
            answers:[],
            num_of_ans:2,
            mainAnswer:{},
            Sets:[],
        }
        this.onAddButtonClick = this.onAddButtonClick.bind(this)
        this.onMoreInputClick = this.onMoreInputClick.bind(this)
        this.onchangeInput = this.onchangeInput.bind(this)
        this.onPostquestion = this.onPostquestion.bind(this)
        this.onNullCheck = this.onNullCheck.bind(this)
        this.postAnswer = this.postAnswer.bind(this)
        this.get_Question_Answer_data = this.get_Question_Answer_data.bind(this)
        this.onCheckLimit = this.onCheckLimit.bind(this)
        this.addMoreAns = this.addMoreAns.bind(this)
    }
    render(){
        var see = null
        var answer1 = []
        var num = this.state.num_of_ans
        for(var i = 0;i<num;i++){
                answer1.push(<input type="text" className="form-control" key={this.state.answers[i]} id={i} onChange={this.onchangeInput} placeholder="Answer"/>)
            }
        
        if(this.state.isadd){
            see = (
                <div className="container">
                    <h1 className="text-center">Enter your Question</h1>
                    <div> 
                    <input type="text" className="form-control" id="question" onChange={this.onchangeInput} placeholder="Question"/>
                        {answer1} </div>
                    <div>
                    <button className="form-control btn btn-light" onClick={this.onMoreInputClick}>More Answer</button>
                    <button className="form-control btn btn-light" onClick={this.onPostquestion}>Post Question</button>
                    </div>
                    </div>
            )
        }else{
         see = null   
        }
        return(
            <div>
                <div className="d-flex justify-content-center mt-5">
                <button className="addButton btn btn-light form-control" onClick={this.onAddButtonClick}>
                    Add Question
                </button>
                </div>
                {see}
                {
                    this.state.Sets.map(data=>(
                        <div className="text-center pt-5" key={data.name}>
                        <Set  question={data.name} onCheckLimit={this.onCheckLimit} answer={data.answer} correct={data.correct}/>
                        </div>
                        ))
                }
                </div>
        )
    }
    onCheckLimit(question,ans){
        Axios.get("/answer/getCountAns/"+question)
        .then((result)=>{
            var count = result.data.count[0].cnt
            if(count === -1){
                alert("Error trying to authorize answer posting")
                return
            }
            if(count >= 5){
                alert("Cannot Add More than five answer")
                return
            }
            this.addMoreAns(question)

        })
        .catch((error)=>{
            return -1
        })
    }
    addMoreAns(question){
        var ans = prompt("Please type your answer")
        if(ans == null){
            return
        }
        while(ans === "" || ans === undefined){
            alert("please provide answer.")
            ans = prompt("Please type your answer")
        }
        Axios.post("/answer/postans",{
            question : question,
            answer : ans,
            isRealAns : 0
        }
        )
        .then((result)=>{
            if(result.status === 201){
                alert("Answer successfully added")
            }
        })
        .catch((error)=>{
            if(error){
                alert("Error Adding more Answer")
            }
        })
    }
    componentDidMount(){
        var seconds = new Date().getTime() / 1000;
        var keys =  Array.from({length: 5}, () => Math.floor(Math.random() * seconds));
        var data = {}
        keys.forEach((Element)=>{
            data[Element] = ""
        })
        this.setState({
            answers : keys,
            mainAnswer:data
        })
        this.get_Question_Answer_data()
    }
    get_Question_Answer_data(){
        Axios.get("/question/getques")
        .then((result)=>{
            var data = []
            for(var y in result.data){
                var isFound = false
                if(data.length === 0){
                    data = [{
                        name:result.data[y].Ques,
                        answer:[result.data[y].Ans],
                        correct: result.data[y].isReal === 1 ? 1:0
                    }]
                }else{
                    for (var z in data ){
                        if(data[z].name === result.data[y].Ques){
                            data[z].answer= data[z].answer.concat(result.data[y].Ans)
                            if(result.data[y].isReal === 1){
                                data[z].correct = z
                            }
                            isFound = true
                            break
                        }
                    }
                    if(isFound === false)
                    data = data.concat({
                            name:result.data[y].Ques,
                            answer:[result.data[y].Ans],
                            correct: (result.data[y].isReal > 0) ? 1:0
                        })
                }
                this.setState({
                    Sets : data
                })
            }
            console.log(data)

        })
        .catch((error)=>{
            console.log("error getting data")
        })
    }
    onchangeInput(e){
        if(e.target.id === "question"){
            this.setState({
                question : e.target.value
            })
            return
        }
        var key = this.state.answers[e.target.id]
        var ans = e.target.value
        this.setState( prev=> {
            let mainAnswer = Object.assign({}, prev.mainAnswer);
            mainAnswer[key] = ans
            return {mainAnswer};
        }
        )
    }
    onAddButtonClick(e){
        e.preventDefault()
                this.setState({
                    isadd:true
     })    
    }

    onMoreInputClick(e){
        e.preventDefault()
        if(this.state.num_of_ans < 5){
            this.setState({                
                num_of_ans : this.state.num_of_ans + 1  
            })
        }
        
    }
    onPostquestion(e){
        e.preventDefault()
        let question = ""
        if(this.onNullCheck(this.state.question)){
            alert("Please proide Question")
            return
        }
            question = this.state.question

            for(let i = 0; i<this.state.num_of_ans;i++){
                let ans = this.state.mainAnswer[this.state.answers[i]]
                if(this.onNullCheck(ans)){
                    alert("Please proide answer on all fields")
                    return
                }
            }
            
            var correct_answer = prompt("Now, provide your correct answer")
            while(correct_answer === null || correct_answer === undefined || correct_answer === null){
                correct_answer = prompt("Now, provide your correct answer")
            }
            var correct = -1
            for(let j = 0; j<this.state.num_of_ans;j++){
                let ansY = this.state.mainAnswer[this.state.answers[j]]
                if(ansY === correct_answer){
                    correct = j
                }
            }
            if(correct === -1){
                alert("The answer you provided is not in the option given")
                return
            }
            Axios.post("/question/postnew",{
                "question":question,
            })
            .then((result)=>{
                console.log(result.status)
                if(result.status === 201){
                    this.postAnswer(question,correct)
                    alert("all question are posted")
                }               
            })
            .catch((err)=>{
                console.log("error",err)
            })
    }

    postAnswer(question,correct){
        for(let i = 0; i<this.state.num_of_ans;i++){
            let ans = this.state.mainAnswer[this.state.answers[i]]
            Axios.post("/answer/postans",{
                "answer":ans,
                "isRealAns":correct,
                "question":question
            })
            .then((result)=>{
                alert("all answer are posted")
            })
            .catch((err)=>{
            })
        }
        
    }

    onNullCheck(elm){
        if(elm === "" || elm === undefined)
            return true
        return false
    }
}