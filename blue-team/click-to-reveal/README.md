# Click-To-Reveal
This is a [WebComponent](https://developer.mozilla.org/en-US/docs/Web/API/Web_Components) & generation script which allows you to generate scrape-resistant public sensitive information. 

The primary purpose for this is (email) addresses for websites.

It uses a PoW-style prevention mechanism by encrypting the content using a key derived with PBKDF2 from a UUID, the amount iterations ensures some minimal amount of computation is spent to reveal the content.

## Usage
```
-n | --iterations: Change the amount of compute/time it takes to reveal information (1_000_000 takes about 1s on desktop PCs)
```

```
node ./generate.js <options> <html_or_text_content_file>
```

### Example
```sh
node ./generate.js ./sample.txt -n 1000000
```

See `./example.html` for an example usage of the generate html, you can use `python3 -m http.server` and go to `http://localhost:8080/example.html` to see the result in the browser.