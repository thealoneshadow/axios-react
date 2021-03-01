import React,{useState} from 'react'
import axios from "axios";
import ShowOutput from './ShowOutput';
axios.defaults.headers.common['X-Auth-Token'] ='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
function App() {
    
    const [response,setResponse]=useState({});
   const getTodos = () => {
       axios.get('https://jsonplaceholder.typicode.com/todos',
       {
           params: {_limit: 5},
           timeout: 1500,
       }).then(response => {
        setResponse(response);
           console.log(response);
       }).catch(err => console.log(err) );
    }
    const postTodos =() => {
        axios.post('https://jsonplaceholder.typicode.com/todos',{
            data: {
                title: "New Tod",
                completed: false,
            }
        }).then(response => {
        setResponse(response);
           console.log(response);
       }).catch(err => console.log(err) );
    }
    const putTodos= ()=>{
        axios.put('https://jsonplaceholder.typicode.com/todos/1',{
        title:"Updated Todo App",

        }).then(response => {
        setResponse(response);
           console.log(response);
       }).catch(err => console.log(err) );
    }
    const deleteTodos = () => {
        axios.delete('https://jsonplaceholder.typicode.com/todos/1',{

        }).then(response =>{
            setResponse(response);
        }).catch(err => {
            console.log(err);
        })
    }
    const allTodos=()=>{
        axios.all([
            axios.get('https://jsonplaceholder.typicode.com/todos'),
            axios.get('https://jsonplaceholder.typicode.com/posts'),

        ]).then(
            axios.spread((todos,posts) => setResponse(posts))
        ).catch(err => {
            console.log(err);
        })
    }

    const customHeader = () => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'sometoken'
            }
        }

        axios.post('https://jsonplaceholder.typicode.com/todos',{
            title:"New todo",
            completed: false,
        }, config)
        .then(response => {
            console.log(response);   
        }).catch(err => {
            console.log(err);
        });
    }

    const transformResponse=()=> {
       const options ={
        method: 'post',
        url: 'https://jsonplaceholder.typicode.com/todos',
        data: {
            title:"Hello World",  
        },
        transformResponse: axios.defaults.transformResponse.concat(data => {
            data.title= data.title.toUpperCase();
            return data;
        })
       } 
       axios(options).then(res => console.log(res))
    }

    const errorHandling = () => {
        axios.get('https://jsonplaceholder.typicode.com/todoss',{
            validateStatus: function(status) {
                return status <500; 
            }
        }).then(res=>{
            ShowOutput(res);
            console.log(res);
        }).catch(err=>{
            if(err.response)
            {
                console.log(err.response.data);
                console.log(err.response.status);
            }
            if(err.response.status===404)
            {
                alert("Error Page Not Found");
            }
            else if(err.request)
            {
                console.log(err.request);
            }
            else{
                console.log(err.message);
            }
        })
    }
    const cancelTodos = () => {
        const source = axios.CancelToken.source();

         axios.get('https://jsonplaceholder.typicode.com/todos',{
             cancelToken: source.token
         })
         .then(response => {
             console.log(response);
         }).catch(thrown => {
            if(axios.isCancel(thrown))
            {
                console.log("Request Cancelled", thrown.message);
            }
         })
         if(true){
            source.cancel("Request Cancelled");
         }
    }

    axios.interceptors.request.use(config => {
        console.log(`${config.method.toUpperCase()} request send to ${config.url} at ${new Date().getTime()}`);
        return config;
    },err=>{
        return Promise.reject(err)
    });

    // AXIOS Instances
    const axiosInstance= axios.create({
        baseURL:'https://jsonplaceholder.typicode.com',
    })    
// axiosInstance.get('/comments').then(res=>console.log(res));

    return (
        <div>
             <div className="container my-5">
      <div className="text-center">
        <h1 className="display-4 text-center mb-3">Axios Crash Course</h1>
        <button className="btn btn-primary my-3" id="get" onClick={getTodos}>GET</button>
        <button className="btn btn-info" id="post" onClick={postTodos}>POST</button>
        <button className="btn btn-warning" id="update" onClick={putTodos}>PUT/PATCH</button>
        <button className="btn btn-danger" id="delete" onClick={deleteTodos}>DELETE</button>
        <button className="btn btn-secondary" id="sim" onClick={allTodos}>Sim Requests</button>
        <button className="btn btn-secondary" id="headers" onClick={customHeader}>
          Custom Headers
        </button>
        <button className="btn btn-secondary" id="transform" onClick={transformResponse} >
          Transform
        </button>
        <button className="btn btn-secondary" id="error" onClick={errorHandling}>
          Error Handling
        </button>
        <button className="btn btn-secondary" id="cancel" onClick={cancelTodos}>
          Cancel
        </button>
      </div>
      <hr />
      <div id="res"></div>
    </div>
    <ShowOutput res={response}/>
        </div>
    )
}

export default App
