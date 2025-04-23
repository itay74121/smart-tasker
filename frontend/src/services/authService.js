/**
 * 
 * @param {String} usernameOrEmail 
 * @param {String} password 
 */
import axios from 'axios'
const apiUrl = process.env.REACT_APP_API_URL;

export async function login(username,password,callback){
    const hashversion = 1
    console.log(apiUrl)
    axios.post(`${apiUrl}\\api\\login`,{
        username:username,
        passwordhash:password
    }).then(callback).catch(reason=>{
        console.log(reason)
    })
}


