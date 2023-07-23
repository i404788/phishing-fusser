/*
  This module functions as both a webscraping obfuscation technique as well as a PoW method by incuring a time/compute cost to reveal
*/

void (() => {
  function base64ToBytes(base64) {
    const binString = atob(base64);
    return Uint8Array.from(binString, (m) => m.codePointAt(0));
  }

  // Derives key from keyMaterial using 100k iterations of PBKDF2
  async function deriveKeySlow(keyMaterial, {iterations}) {
    const enc = new TextEncoder();
    const rawMaterial = await window.crypto.subtle.importKey(
      "raw",
      enc.encode(keyMaterial),
      "PBKDF2",
      false,
      ["deriveBits", "deriveKey"],
    )

    const key = await window.crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: new Uint8Array(16),
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

  customElements.define('click-to-reveal', 
    class extends HTMLElement {
      constructor() {
        super()

        // const shadow = this.attachShadow({ mode: 'open' });
        this.addEventListener("click", async () => {
          const get_content = async () => {
            const bytes = base64ToBytes(this.content)
            const rawKey = await deriveKeySlow(this.key, { iterations: this.iterations })
            return window.crypto.subtle.decrypt({name: "AES-GCM", iv: bytes.slice(0,16)}, rawKey, bytes.slice(16));
          }

          const dec = new TextDecoder()
          this.innerHTML = dec.decode(await get_content())
        })
      }

      get iterations() {
        return this.getAttribute('iters') || 100_000;
      }
      
      get content() {
        return this.getAttribute('content');
      }

      get key() {
        return this.getAttribute('key');
      }
    }
  )
})();