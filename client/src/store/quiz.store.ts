import { create } from 'zustand'
import axios from 'axios'

export interface QuizRequest {
    level: string;
    type: string;
    count: string;
    examName:string;
    description: string;
}

export interface QuizResponse {
    question: string;
    option1: string;
    option2: string;
    option3: string;
    option4: string
    correctOption: string;
}


export interface Questions {
  question: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  correctOption: string;
  selectedOption: string;
}
interface IFeedBack {
  right: Questions[]
  wrong: Questions[]
}
interface QuizStoreInfo {
    quiz: QuizResponse[] | [];
    isLoading:boolean;
    feedBack:string|""
    createQuestion: (data: QuizRequest) => Promise<void>
    clearQuiz:()=>void
    clearFeedBack:()=>void;
    getFeedBack:(data:IFeedBack)=>Promise<void>
}

export const useQuizStore = create<QuizStoreInfo>((set)=>({
    quiz:[],
    isLoading:false,
    feedBack:"",
    createQuestion:async(data)=>{
        try {
            set({isLoading:true})
            const response = await axios.post("http://localhost:3000",data)
            if(response.status>300){
                console.log(response.data)
                return
            }
            
            set({quiz:response.data?.questions as QuizResponse[]})
        } catch (error) {
           console.log(error) 
        }finally{
            set({isLoading:false})
        }
    },
    getFeedBack:async(data)=>{
        try {
            const response = await axios.post("http://localhost:3000/feedback",data)
            if(response.status>300)return;
            
            set({feedBack:response.data.result})
        } catch (error) {
            console.log(error)
        }
    },
    clearQuiz:()=>{
        set({quiz:[]})
    },
    clearFeedBack:()=>{
        set({feedBack:""})
    }
}))