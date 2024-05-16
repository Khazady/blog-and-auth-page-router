**Autorization**

JWT (JSON Web Token)

FE <> BE

1.  /login > creates JWT
2.  save in localStorage < response (JWT)
3.  request with signed JWT (placed in header) > validate JWT

Session

FE <> DB

1.  /login > store session 
2.  save cookie < response (session id)
3.  request with cookie > check session
4.  < response

Cons:

Vulnerable for CSRF - cross-site-request-forgery

Requires storage

**Common Questions**

1.  После введения URL в адресную строку - DNS > IP > html > css > js > гидрация и т.д.
2.  Как копировать объект

**Security**

CORS
