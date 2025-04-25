/**
 * 
 * @param {String} usernameOrEmail 
 * @param {String} password 
 */
import axios from 'axios'
const apiUrl = process.env.REACT_APP_API_URL;

export async function login(username,password){
    // const hashversion = 1
    console.log(apiUrl)
    axios.post(`${apiUrl}\\api\\login`,{
        username:username,
        passwordhash:password
    },{
    withCredentials: true
    }).then((value)=>{
        console.log(value.headers.getAuthorization())
    }).catch(reason=>{
        console.log(reason)
    })
}


