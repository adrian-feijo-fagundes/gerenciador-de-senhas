import readline from 'readline'

export const useQuestion = (str) => new Promise(
  resolve => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: false
    })
    
    rl.question(`${str}`, (result) => {
      rl.close()
      resolve(result)
    })
  }
)