'use strict'
import WebSocket from 'ws'
import express from 'express'
import path from 'path'

const port = 5000
const dir = '../public/'
const app = express()
app.use(express.static(path.join(dir, 'static')))
app.set('views', dir)
app.set('view engine', 'ejs')
app.get('/', (req, res) => res.render('index'))
app.get('/game', (req, res) => res.render('game'))
app.listen(port, () => console.log(`Liseting on ${port}`))

const wss = new WebSocket.Server({ server: app })
wss.on('connection', ws => {
})
