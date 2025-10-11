---
title: "Authentication"
excerpt: "This article explores authentication and authorization, comparing JWT and session-based authentication. Learn how each approach works, their advantages, and potential security risks."
image: authentication.jpeg
isFeatured: false
date: "2024-04-05"
---

# Fundamentals

- **Authentication** answers "Who is this?" and verifies the user's identity (password, token, WebAuthn).
- **Authorization** answers "What is allowed?" and checks the permissions of a known user.
- **Accounting/Auditing** records user actions: when they logged in, what they did, which data they changed.

### Login Flow

1. The client sends proof of identity (login/password, OTP, signature, etc.).
2. The server verifies it and issues "proof of login" (session, access token).
3. The client attaches that proof to every request until it expires or is revoked.

# Below are the main ways to store that proof.

## Session-Based Authentication

1. `/login`: the server creates a record in storage (Redis, database) with the session ID and user data.
2. The browser receives a cookie with the `sessionId`.
3. The client sends the cookie with each request; the server looks up the session and reconstructs the user.

Pros:
- Easy to revoke (delete the record in storage), which is useful for logging out from all devices.
- You can store extra data (role, timeouts, CSRF tokens).

Cons:
- Requires dedicated storage (for example, a database table or Redis) that you have to maintain.
- The browser sends cookies automatically, so you are vulnerable to [CSRF](/posts/network#CSRF) unless you add extra protections.

**Mandatory cookie flags:** `HttpOnly`, `SameSite`, `Secure`. See the [Network](/posts/network) notes for details.

## JWT (JSON Web Token)

A JWT is a compact, URL-safe token with three parts `header.payload.signature`, signed with a secret or key pair. The signed payload includes session data such as `sub`, `exp`, `role`, `aud`, and others.

### How It Works

1. `/api/login`: the server verifies the user and signs a JWT with a short TTL (15-60 minutes).
2. The client stores the token (usually in `localStorage` or an `HttpOnly` cookie).
3. Each request includes the token in the `Authorization: Bearer <jwt>` header.
4. The server verifies the signature and expiration; on success it restores the user context.

Pros:
- Stateless, so there is no central storage (the server does not keep the session).
- Works with multiple services: any service that knows the secret can verify the token. That helps when you have several backends without a shared session store or a dedicated auth service.

Cons:
- Hard to revoke early, so you need a token blacklist or very short TTLs.
- The token grows as you add fields to the payload, which increases header size.
- Storing tokens in `localStorage` is vulnerable to XSS, so prefer cookies (see [XSS](/posts/network/#XSS)).

### Refresh Tokens and Rotation

- Keep the access token short-lived and store the long-lived refresh token only in an `HttpOnly` cookie.
- On `401` the client calls `/refresh`, the server validates the refresh token, issues a new pair, and optionally revokes the old one.
- Store refresh tokens server-side (whitelist) and rotate them (replace both access and refresh tokens on each refresh).

## OAuth 2.0 and OpenID Connect

Use these when you need sign-in via a third-party provider (Google, GitHub) or access to an API on behalf of a user.

- **OAuth 2.0** is a protocol for delegated access.
- **Authorization Code Flow** (with PKCE for SPAs) is a secure way to obtain an access token via redirect and a one-time code.
- **Scopes** describe what can be done: `read:user`, `repo`, `openid email`.
- **OpenID Connect** is a layer on top of OAuth 2.0 that issues an `id_token` (JWT) with user data. It is useful for SSO (single sign-on across products such as YouTube and Google).

Validate the `redirect_uri`, `state`, and `nonce`, keep the client secret on the server, and rotate keys regularly.

# Authorization and Access Control

### RBAC (role-based)

Bind permission sets to roles (`admin`, `editor`, `viewer`).
Store the role in the `users` collection or table.
This is the simplest implementation but also the least flexible.

### ABAC (attribute-based)

When RBAC is not enough and you add extra conditions, for example `if (user.role === 'admin' && user.id === comment.authorId)`, move those checks into a centralized helper function.

```js
// policy.js
export function can(user, action, resource) {
  switch (action) {
    case "addComment":
      return user.role === 'admin';
    case "editComment":
      return user.role === "admin" && user.id === comment.authorId;
    default:
      return false;
  }
}
```

### PBAC / Policy-based

Describe rules declaratively (for example JSON) and use an engine (a library such as Casbin) to interpret them on the frontend and backend.

`// policies/post.json`

```json
{
  "version": 1,
  "policies": [
    { "effect": "allow", "role": "editor", "action": "posts.edit", "resource": "post" },
    { "effect": "allow", "role": "author", "action": "posts.edit", "resource": "post", "condition": "resource.authorId == user.id" },
    { "effect": "deny", "role": "*", "action": "posts.delete", "resource": "post" }
  ]
}
```

**You can change policies without a deploy, just update the file or configuration.**

### Scope-based

A classic approach for OAuth and APIs.
The JWT token contains a list of permissions (scopes) defining what the user can do.
The backend uses those scopes to decide whether the client may call a given endpoint.
The frontend can decode the token and apply the same permissions to the UI, such as hiding unavailable buttons or pages.

```json
{
  "sub": "123",
  "exp": 1736342261,
  "scope": "users:read orders:write"
}
```

### Practices

- Store rules and roles in the database or configuration, cache them, and invalidate when they change.
- Return the minimum set of permissions to the frontend (`['posts.edit']`) so the UI can hide unavailable actions.
- Always enforce checks on the backend and never trust the frontend alone.
- In microservices, share a common library or dedicated authorization service so every service evaluates permissions consistently.

## Secret Storage and Validation

- Hash passwords (bcrypt, argon2, scrypt) with salt and configurable work factors.
- Add rate limiting and CAPTCHA or deliberate delays to registration and password-change flows.
- Verify email or phone to reduce disposable accounts.
- Log login attempts and store audit trails in immutable storage.

## Multi-Factor Authentication (MFA)

The second factor is something the user has (phone, hardware key), is (biometrics), or knows (PIN).

- **TOTP** (Google Authenticator): the server stores a secret, issues a QR code, and validates with `code = totp(secret, timestamp)`.
- **FIDO2/WebAuthn**: key-based cryptography that can be passwordless (passkeys). Often implemented through `navigator.credentials`.
- **Backup codes** are one-time codes for recovery.

On the frontend, ensure the UX explains that access is impossible without the second factor and provide recovery flows.

## Common Threats and Defenses

- **CSRF**: protect with `SameSite` cookies plus CSRF tokens; see [Network](/posts/network/#CSRF) for details.
- **XSS**: keep tokens in memory or `HttpOnly` cookies and validate inputs; see [XSS](/posts/network/XSS).
- **MITM and traffic interception**: use HTTPS/HSTS and secure channels; see [Network](/posts/network#MITM).
- **Brute-force** (an attack that keeps trying login/password combinations): rate limiting, IP blocking, reCAPTCHA.
- **Credential stuffing**: monitor breaches and add anomaly-based defenses (impossible travel, new devices).
- **Session fixation**: regenerate session IDs, for example after privilege or role changes.

If the app is an SPA:
- avoid storing access tokens in `localStorage`; prefer an `HttpOnly` cookie with `SameSite=strict`.
- when you must send cookies with unsafe requests, use `fetch` with `credentials: 'include'` and configure CORS appropriately (see [CORS](/posts/network#CORS)).
