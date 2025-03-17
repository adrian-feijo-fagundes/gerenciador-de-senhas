import crypto from "crypto";

/*
aes-256-gcm significa que estamos usando AES (Advanced Encryption Standard) com uma chave de 256 bits no modo Galois/Counter Mode (GCM).

O modo GCM fornece autenticação dos dados, impedindo que sejam alterados sem que percebamos.
*/
const ALGORITHM = "aes-256-gcm"; 

// Como o AES-256 precisa de uma chave de exatamente 256 bits (32 bytes), usamos um hash SHA-256 para transformar a chave mestra em um formato apropriado.
const deriveKey = masterKey => crypto.createHash("sha256").update(masterKey).digest();

export const encrypt = (text, masterKey) => {
    // valor aleátorio que garante que o mesmo texto possa ser criptografado para valores diferentes
    const iv = crypto.randomBytes(16); 
    const key = deriveKey(masterKey);

    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

    // cconverte o texto original para 
    let encrypted = Buffer.concat([cipher.update(text, "utf8"), cipher.final()]);
    

    const authTag = cipher.getAuthTag();

    return JSON.stringify({
        iv: iv.toString("hex"),
        authTag: authTag.toString("hex"),
        encrypted: encrypted.toString("hex"),
      });

}

export const decrypt = (encryptedText, masterKey) => {
    const { iv, authTag, encrypted } = JSON.parse(encryptedText);  
 
    const key = deriveKey(masterKey)
        
    // Cria objeto para descriptografar
    const decipher = crypto.createDecipheriv(ALGORITHM, key, Buffer.from(iv, "hex"));

    decipher.setAuthTag(Buffer.from(authTag, "hex"))

        
    let decrypted =  Buffer.concat([
        decipher.update(Buffer.from(encrypted, "hex")),
        decipher.final(),
    ]);
        
    return decrypted.toString("utf-8");
}