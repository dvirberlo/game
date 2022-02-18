const path = require('path')
const express = require('express')
const createError = require('http-errors')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const debug = require('debug')

const mongoose = require('mongoose')

const indexRouter = require('./routes/index')
const enterRouter = require('./routes/enter')
const protectedRouter = require('./routes/protected')

const app = express()

// mongoose connection setup
mongoose.set('useCreateIndex', true)
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.connection.on('error', debug('app:db'))

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)
app.use('/enter', enterRouter)
app.use('/protected', protectedRouter)

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404))
})

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = process.env.MODE === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
