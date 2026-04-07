const fs = require('fs');
const path = require('path');
const p = path.resolve(__dirname, './src/data/jokes.ts');
let c = fs.readFileSync(p, 'utf8');

c = c.replace(/id:\s*number\s*;/g, 'id: string;');
c = c.replace(/\{\s*id:\s*(\d+)\s*,/g, '{ id: "$1",');

fs.writeFileSync(p, c, 'utf8');
console.log('Script finished. Replaced string? ', c.includes('id: string;'));
