const mongoose = require("mongoose")
const config = require("config")
const db = config.get("mongoURI")

const connect = async() => {
    try {
        await mongoose.connect(db, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true })
    } catch (err) {
        console.log(err.message)
            //exit process with faliure
        process.exit(1)
    }
}

module.exports = connect