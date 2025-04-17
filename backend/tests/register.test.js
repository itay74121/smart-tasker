const axios = require('axios')


describe("Register Testing",()=>{
    test("test the register endpoint working",async ()=>{
        const response = await axios.post('http://localhost:3000/api/register',{
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
