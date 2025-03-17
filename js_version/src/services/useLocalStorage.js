import { LocalStorage } from "node-localstorage"

export const useLocalStorage = () => {
  const localStorage = new LocalStorage('./db')

  const setString = (key, value) => {
    localStorage.setItem(key, value)
  }

  const setObject = (key, obj) => {
    const objString = JSON.stringify(obj)

    localStorage.setItem(key, objString)
  }

  const getString = (key) => {
    return localStorage.getItem(key)
  } 

  const getObject = (key) => {
    const json = localStorage.getItem(key)

    if (json) {
      return JSON.parse(json)
    }

    return null
  }

  return {
    setString,
    setObject,
    getString,
    getObject
  }
}
