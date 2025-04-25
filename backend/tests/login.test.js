const axios = require('axios')
require('dotenv').config(); // Load environment variables from .env

const deployUrl = process.env.TESTING === "true" ? process.env.TEST_BASE_URL : process.env.DEPLOY_URL;
axios.defaults.baseURL = deployUrl; // Set the base URL for all requests

describe("login Testing",()=>{
    test("test the login endpoint working",async ()=>{
        await axios.post(`/api/login`,{
            username:"itay74121",
            passwordhash:"123456",
        },{timeout:10000})
        .then(res=>{
            expect(res.status).toEqual(202);   
            console.log(res.headers['set-cookie'])
        })
        .catch(reason=>{
            console.log(reason)
        })  
    },10*1000)
})
