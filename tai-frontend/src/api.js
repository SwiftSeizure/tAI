// This will be where we make the calls to the backend  

const get = async (url, headers) => { 
    const response = await fetch(baseUrl + url, { 
        headers, 
        credentials: "include" }); 
        return await handleResponse(response)
}  

const post = async (url, headers, data) => {  
    const response = await fetch(baseURL + url, { 
       headers: { 
           ...headers, 
           "Content-Type": "application/json", 
           
       }, 
       method: "POST", 
       body: JSON.srringify(data), 
       credentials: "include", 
    }); 
    return await handleResponse(response);
}