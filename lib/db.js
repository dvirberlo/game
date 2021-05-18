import MongoDB from 'mongodb'

let MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017'
let MONGODB_DB = process.env.MONGODB_DB || 'magicbamba'
let MONGODB_COLLECTION = process.env.MONGODB_COLLECTION || 'test'
const startedDocument = {
  _id: null,
  username: '',
  password: '',
  xp: 0,
  resources: { lights: 10, gems: 5, flowers: 5 },
  spells: [],
  mission: false
}

// const data = {
//   spells: [{ name: 'fireball', price: { lights: 0, gems: 5, flowers: 5 } }]
// }

let dbCollection = null

export const start = (options, callback) => {
  MONGODB_URI = options.uri || MONGODB_URI
  MONGODB_DB = options.db || MONGODB_DB
  MONGODB_COLLECTION = options.collection || MONGODB_COLLECTION
  if (process.debug) console.log(`connecting to db ${MONGODB_URI}`)

  const client = new MongoDB.MongoClient(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  client.connect(err => {
    if (!err) {
      const collection = client.db(MONGODB_DB).collection(MONGODB_COLLECTION)
      dbCollection = collection

      if (process.debug) console.log(`db connected ${MONGODB_DB}/${MONGODB_COLLECTION}`)
    }
    if (typeof callback === 'function') callback(err)
  })
}

export const loginCheck = (username, password, callback) => {
  if (!dbCollection) throw new Error('dbCollection is not defined')

  dbCollection.findOne({ username: username, password: password }, (err, result) => {
    if (err) throw err
    // result to boolean
    callback(err, !!result)
  })
}
export const newUser = (username, password, callback) => {
  readByUsername(username, (err, result) => {
    if (err) return callback(err)
    else if (result) callback(new Error('username already exists'))
    else {
      const obj = startedDocument
      obj.username = username
      obj.password = password
      obj._id = new MongoDB.ObjectID()

      if (!dbCollection) callback(new Error('dbCollection is not defined'))
      else {
        dbCollection.insertOne(obj, (err, res) => {
          // LOGDEV
          console.log('newUser: ' + JSON.stringify({ username: username, password: password, res: res }))
          callback(err)
        })
      }
    }
  })
}
export const readByUsername = (username, callback) => {
  if (!dbCollection) return callback(new Error('dbCollection is not defined'))

  dbCollection.findOne({ username: username }, { projection: { _id: 0 } }, (err, result) => {
    // LOGDEV
    console.log('readByUsername: ' + JSON.stringify({ username: username, result: result }))
    callback(err, result)
  })
}
export const setByUsername = (username, key, value, callback) => {
  const query = { username: username }
  const update = { $set: { [key]: value } }

  if (!dbCollection) return callback(new Error('dbCollection is not defined'))
  dbCollection.updateOne(query, update, (err, res) => {
    callback(err)
  })
}
export const updateByUsername = (query, update, callback) => {
  if (!dbCollection) return callback(new Error('dbCollection is not defined'))
  dbCollection.updateOne(query, update, (err, res) => {
    callback(err)
  })
}

export const checkAfford = (username, price, callback) => {
  readByUsername(username, (err, result) => {
    if (err) return callback(err)
    const resources = result.resources
    let affordable = true
    for (const key in resources) {
      resources[key] -= price[key]
      affordable = affordable && resources[key] >= 0
    }
    callback(err, affordable, resources)
  })
}
