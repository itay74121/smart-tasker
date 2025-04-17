import {Schema, model} from 'mongoose'

const UserSchema = new Schema({
    username:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: String
    },
    name: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true

    },
    role: {
        type: String,
        enum:["Admin","User"],
        required:true,
        default:"User"
    },
},{collection:"Users"})


const UsersModel = model("Users",UserSchema)

export default UsersModel



