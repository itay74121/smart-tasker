const axios = require('axios')
const deployUrl = "https://smart-tasker-2ntd.onrender.com"
axios.defaults.baseURL = deployUrl; // Set the base URL for all requests

describe("Register Testing",()=>{
    test("test the register endpoint working",async ()=>{
        const response = await axios.post(`${deployUrl}/api/register`,{
            email:"itay74121@gmail.com",
            username:"itay7412",
            name:"itay",
            lastname:"yosef",
            passwordhash:"6545665564156516516156516",
            role:"User"
        }).catch(reason=>{
            expect(reason.status).toEqual(400);    
        })
        
    })
})
