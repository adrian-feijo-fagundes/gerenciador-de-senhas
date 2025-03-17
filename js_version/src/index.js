import yargs from "yargs";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { hideBin } from "yargs/helpers";
import { decrypt, encrypt } from "./services/encryption.js";

// Verifica se o arquivo de senhas já existe
const passwordFile = 'senhas.json';
let passwords = [];

if (existsSync(passwordFile)) {
  passwords = JSON.parse(readFileSync(passwordFile, 'utf8'));
}

// Define o comando yargs
const argv = yargs(hideBin(process.argv))
  .option('k', {
    alias: 'key',
    type: 'string',
    describe: 'Chave para criptografar/descriptografar',
  })
  .option('p', {
    alias: 'password',
    type: 'string',
    describe: 'Senha para criptografar',
  })
  .option('l', {
    alias: 'list',
    type: 'boolean',
    describe: 'Listar senhas',
  })
  .help()
  .argv;

// Se o usuário passar uma chave e uma senha para criptografar
if (argv.k && argv.p) {
  const encryptedPassword = encrypt(argv.p, argv.k);
  passwords.push(encryptedPassword); // Armazenando a senha criptografada
  writeFileSync(passwordFile, JSON.stringify(passwords, null, 2));
  console.log(`Senha '${argv.p}' foi criptografada e salva.`);
}

// Se o usuário pedir para listar as senhas
if (argv.l) {
    if (argv.k) {
      // Listar sem criptografia, usando a chave fornecida para descriptografar
      Object.entries(passwords).forEach(([plainPassword, encrypted]) => {
        try {
          const decryptedPassword = decrypt(encrypted, argv.k);
          console.log(`Senha: ${decryptedPassword}`);
        } catch (error) {
          console.log(`Erro ao descriptografar a senha '${plainPassword}': Chave incorreta.`);
        }
      });
    } else {
      // Listar com criptografia
      Object.entries(passwords).forEach(([plainPassword, encrypted]) => {
        console.log(`Senha criptografada: ${encrypted}`);
      });
    }
  }