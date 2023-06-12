const mongoose = require ("mongoose")

const connect =() =>{

    return  mongoose.connect("mongodb+srv://mohitsolanki:mongodb@cluster0.clrq7sh.mongodb.net/?retryWrites=true&w=majority")
}

module.exports = connect;