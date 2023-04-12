const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
    `mongodb+srv://fullstack:${password}@clusterfs.nuaw4kv.mongodb.net/?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)


const peronSchema = new mongoose.Schema({
    name: String,
    number: String,
  })

const Peron = mongoose.model('Person', peronSchema)

if (process.argv.length==5) {
    const person = new Peron({
        name: process.argv[3],
        number: process.argv[4],
    })
    person.save().then(result => {
        console.log('phonenumber saved!')
        mongoose.connection.close()
    })
}

if (process.argv.length==3){
    Peron.find({}).then(result => {
        console.log("Phonebook")
        result.forEach(variable => {
          console.log(variable.name, variable.number)
        })
        mongoose.connection.close()
      })
}