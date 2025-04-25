const axios = require('axios')
require('dotenv').config(); // Load environment variables from .env

const deployUrl = process.env.TESTING === true ? process.env.TEST_BASE_URL : process.env.DEPLOY_URL;
axios.defaults.baseURL = deployUrl; // Set the base URL for all requests
describe("Register Testing",()=>{
    test("test the register endpoint working",async ()=>{
        const response = await axios.post(`/api/register`,{
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
