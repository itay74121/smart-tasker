import mongoose, { connect } from 'mongoose'
import {config} from 'dotenv'

config()

const uri = process.env.MONGO_URI;
const credentials = process.env.MONGO_CERT_FILE
const clientOptions = {
  tlsCertificateKeyFile: credentials,
  serverApi: { version: '1', strict: true, deprecationErrors: true }
};

var connectionPromise = null   

export async function mongooseConnected(req,res,next) {
  try {
    // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
    if (mongoose.connection.readyState !== 1){
        if (connectionPromise === null){
            connectionPromise = mongoose.connect(uri,clientOptions).then((val)=>{
                connectionPromise = null
            }).catch(error=>{
                connectionPromise = null
                throw error
            })
        }
        await connectionPromise
    }
  } catch (error) {
  }
  finally{
    next()
  }
  return 
}
