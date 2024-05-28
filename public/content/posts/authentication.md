---
title: Authentication
excerpt: This article explores the concepts of authentication and authorization, comparing JWT and session-based authentication methods. Learn how each method works, their advantages, and their potential security risks.
image: authentication.jpeg
isFeatured: false
date: "2024-04-05"
---
## JWT (JSON Web Token)
JWT is a compact, URL-safe means of representing claims to be transferred between two parties.
It is often used for authentication and information exchange.

### Workflow!

1.  api/login > creates JWT
2.  save in localStorage < response with JWT 
3.  request with signed JWT (placed in header) > validate JWT

### SPA

[SPA and JWT.png](jwt.png)

## Session

FE <> DB

1.  /login > store session 
2.  save cookie < response (session id)
3.  request with cookie > check session
4.  < response

Cons:

Vulnerable for CSRF - cross-site-request-forgery

Requires storage
