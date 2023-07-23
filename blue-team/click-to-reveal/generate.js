const { webcrypto } = require('node:crypto')
const { subtle } = webcrypto
const { readFile } = require('node:fs/promises')

function bytesToBase64(bytes) {
  const binString = Array.from(bytes, (x) => String.fromCodePoint(x)).join("");
  return btoa(binString);
}


// Derives key from keyMaterial using 100k iterations of PBKDF2
async function deriveKeySlow(keyMaterial, {iterations}) {
  const enc = new TextEncoder();
  const rawMaterial = await subtle.importKey(
    "raw",
    enc.encode(keyMaterial),
    "PBKDF2",
    false,
    ["deriveBits", "deriveKey"],
  )

  const key = await subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: Buffer.alloc(16),
      iterations, 
      hash: "SHA-256",
    },
    rawMaterial,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"],
  );
  return key;
}


void (async () => {
  const argv = require('./minimist')(process.argv.slice(2))

  let content
  if ('-c' in argv) {
    // TODO: read from stdin
  } else {
    const filename = argv['_'][0]
    content = await readFile(filename)
  }

  const iterations = argv['n'] || argv['iterations'] || 100_000;

  const key = webcrypto.randomUUID()
  const iv = webcrypto.getRandomValues(Buffer.alloc(16))
  content = await subtle.encrypt({name: "AES-GCM", iv}, await deriveKeySlow(key, {iterations}), content);

  console.log(iv, content, key, argv)
  content = Buffer.concat([iv, Buffer.from(content)])
  console.log(`===== Generated code =====`)
  console.log(`<click-to-reveal key="${key}" content="${bytesToBase64(content)}" iters="${iterations}" />`)
})()