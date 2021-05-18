export const inputsValid = (username, password) => {
  return usernameValid(username) && passwordValid(password)
}
export const usernameValid = username => {
  return username.length > 0 && username.length < 50
}
export const passwordValid = password => {
  return password.length > 0 && password.length < 50
}
