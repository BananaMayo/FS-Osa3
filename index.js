const express = require('express')
const app = express()
app.use(express.json())
const cors = require('cors')
app.use(cors())
app.use(express.static('build'))
var morgan = require('morgan')
morgan.token('person', function (req, res) { return JSON.stringify(req.body)})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :person'))

const Person = require("./models/person")
const mongoose = require('mongoose')


const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

// tämä tulee kaikkien muiden middlewarejen rekisteröinnin jälkeen!
app.use(errorHandler)


/* GET-Osio
 */

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/info', (req, res) => {
  res.send(`Phonebook has info for ${persons.length} people <br> <p> ${Date()} </p>`)

})

app.get('/api/persons', (req, res) => {
  Person.find({}).then(variable => {
    res.json(variable)
  })
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  response.json(person)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})


/*  POST-Osio
 */

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({ 
      error: 'name missing' 
    })
  }

  if (!body.number) {
    return response.status(400).json({ 
      error: 'number missing' 
    })
  }

  const person = new Person({
      name: body.name,
      number: body.number
  })

  person.save().then(result => {
    console.log("Phonenumber saved")
  })

  response.json(person)

  // if(persons.filter(person => person.name.toLowerCase() === body.name.toLowerCase()).length>0){
  //   return response.status(400).json({ 
  //     error: 'name must be unique'
  //   })
  // }


  // const person = {
  //   id: Math.floor(Math.random() * 10000),
  //   name: body.name,
  //   number: body.number
  // }

  // persons = persons.concat(person)
})

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)