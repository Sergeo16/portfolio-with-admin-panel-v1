// Script pour générer un NEXTAUTH_SECRET aléatoire
const crypto = require('crypto');
console.log(crypto.randomBytes(32).toString('base64'));

