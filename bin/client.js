exports.error = function (res, error, status){
  if(status) res.status(status)
  if(err) res.json({error})
  else res.send(null)
}