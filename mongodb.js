const mongoose=require('mongoose');
require('dotenv').config();

const establishConnectionToDB=()=>{
    mongoose.connect(process.env.MONGODB_CONNECTION_URI)
    .then(()=>console.log('Connected to Database Successfully.'))
    .catch(error=>console.log(error));
}

module.exports=establishConnectionToDB;