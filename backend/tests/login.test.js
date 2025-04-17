const axios = require('axios')


describe("Register Testing",()=>{
    test("test the register endpoint working",async ()=>{
        const response = await axios.post('http://localhost:3000/api/login',{
            username:"itay74121",
            passwordhash:"6545665564156516516156516",
        })
        .then(res=>{
            expect(res.status).toEqual(202);   
            console.log(res.headers )
        })
        .catch(reason=>{
            console.log(reason)
        })  
    })
})
