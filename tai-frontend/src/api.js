import axios from 'axios';

const BASE_URL = 'http://localhost:8000';  



// Can pass in auth token up here as a param
export const getRequest = async (url) => { 
    try { 
        const response = await axios.get(BASE_URL + url, { 
            headers: {  
                // Auth token here possibly that can be passed down from the DB 
                'Content-Type': 'application/json',
            }
        }); 
        return response;
    } 
    catch (e) { 
        console.log(e);
    }
} 


// const export get = async (url, headers) => { 
//     const response = await fetch(baseUrl + url, { 
//         headers, 
//         credentials: "include" }); 
//         return await handleResponse(response)
// }  

// const post = async (url, headers, data) => {  
//     const response = await fetch(baseURL + url, { 
//        headers: { 
//            ...headers, 
//            "Content-Type": "application/json", 
           
//        }, 
//        method: "POST", 
//        body: JSON.srringify(data), 
//        credentials: "include", 
//     }); 
//     return await handleResponse(response);
// }