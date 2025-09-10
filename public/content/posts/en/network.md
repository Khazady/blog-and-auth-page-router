---
title: Network
excerpt: "Basics of network communication: REST API, CDN, DNS and key security concepts."
image: network.webp
isFeatured: false
date: "2024-05-17"
---

## Rest(ful) API

A REST API is an architectural style for client-server interaction. It uses standard HTTP methods to work with resources:

- **GET** – retrieve data (for example, a list of users).
- **POST** – create a new resource.
- **PUT** – completely replace an existing resource.
- **PATCH** – partially update a resource.
- **DELETE** – remove a resource.

### Difference between PUT and PATCH

Suppose we want to edit a user:

```json
{
  "id": 1,
  "name": "Alice",
  "email": "alice@example.com",
  "age": 25
}
```

With PUT—even if only `name` changes—you must send the full object with every field.
With PATCH you can send only the fields you want to update.

## CDN

A Content Delivery Network is a set of servers distributed around the world that cache and serve static content (images, styles, JS, video, etc.).

## DNS

DNS converts human-readable domain names into IP addresses.  
Example: `openai.com` → `104.18.12.123`

## Security

### CORS (Cross-Origin Resource Sharing)

- A browser security policy that restricts requests to another domain.
- If the server does not allow the client's domain in headers, the browser blocks the response.
- For example, when developing locally, a request from `localhost` will be blocked unless the backend adds `Access-Control-Allow-Origin: http://localhost:3000`.
- Alternatively, use a reverse proxy: the dev server (Next/CRA/Vite) receives requests on its own `localhost`, makes the request to the real URL, and returns the response as if from `localhost`.

### Preflight request

- For non-simple methods (e.g. POST with `Content-Type: application/json`) the browser first sends an `OPTIONS` request to check if such access is allowed.
- A preflight is sent if the request is not a “simple request”.

#### A simple request is:

- method: GET, POST, or HEAD;
- `Content-Type`: `application/x-www-form-urlencoded`, `multipart/form-data`, or `text/plain`;
- no custom headers (e.g. `Authorization`, `X-My-Header`).

### CSRF (XSRF) (Cross-Site Request Forgery)

Attack: an attacker forces a browser to send a request to a trusted site with your **cookies**.

Example:

- in tab 1 you are logged in to `bank.com`
- in tab 2 you open `evil.com`
- it has a hidden form sending a request to `bank.com`
- the browser attaches cookies automatically → the server thinks it was you.

**Protection:**

1. **SameSite for cookies**

   - The `SameSite=Lax` or `Strict` flag tells the browser: _do not send cookies if the request comes from another site_.
   - So when navigating from `evil.com`, `bank.com` cookies are not attached.

2. **CSRF tokens**

   - The server generates a random token and embeds it in a form or provides it via API.
   - The client must send it with each request.
   - The attacker doesn't know the token → the request is rejected.

3. **Checking headers**
   - The server inspects `Origin` or `Referer`.
   - If the request didn't come from `bank.com`, it is blocked.

#### XSS (Cross-Site Scripting)

- Injecting malicious scripts into a site via inputs or URL parameters.

**Protection**

1. Escaping HTML (React does this automatically unless you disable it with the `dangerouslySetInnerHTML` prop)
   - replacing special characters like `<` and `>` with `&lt;` and `&gt;`
2. HttpOnly cookies
   - The HttpOnly flag makes cookies inaccessible to JavaScript
   - Example (Express)
   ```javascript
   app.post("/login", (req, res) => {
     // suppose the user successfully authenticated
     res.cookie("session", "abc123", {
       httpOnly: true, // ❗ JS on the front end cannot read it
       secure: true, // only via HTTPS
       sameSite: "Lax", // basic CSRF protection
       maxAge: 1000 * 60 * 60, // 1 hour
     });
     res.send("Logged in");
   });
   ```
3. CSP (Content Security Policy) <span id="content-security-policy"/>
   - an HTTP header that tells the browser "which scripts, styles, images and other resources can be loaded and executed on this site"
   - configured on the static file server (e.g. Nginx); in Next.js—in `next.config.js`

### HTTP(S)

- HTTP is the protocol by which the browser and server exchange data.
- HTTPS is the same HTTP but with TLS encryption on top.

**What this provides:**

- No one can spy on the data being sent (for example, a password).
- No one can silently modify server responses.
- The browser checks that the site is legitimate (via a certificate).

### MITM – “Man in the middle” attack

An attacker inserts themselves between the browser and server, reading or modifying data. Common on open Wi‑Fi or with HTTP (or `ws://`).

**Protection**

1. Redirect from HTTP to HTTPS (configured in Nginx)
2. Use `wss://` for WebSocket
3. [CSP](#content-security-policy)
4. HSTS (HTTP Strict Transport Security)
   - another header like CSP
   - also configured on the static file server (e.g. Nginx); in Next.js—in `next.config.js`

## After entering a URL in the address bar

1. The browser uses DNS to obtain the domain’s IP address.
2. If HTTPS → TLS handshake (negotiate encryption, verify certificate).
3. Request to the server → HTML is returned.
4. CSS, JS, and images are loaded.
5. DOM and CSSOM are built → layout → paint.
6. JS makes the page interactive (hydration).
