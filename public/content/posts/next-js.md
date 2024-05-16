---
title: NextJS Key Features
excerpt: Let's list most fundamental features NextJS offers
image: next-js.webp
isFeatured: true
date: "2024-02-22"
---
## NextJS Key Features:

### 1. **Pre-rendering pages on the server side:**
- This feature eliminates the **initial loading** state by rendering pages on the server side.  
    React components load data from the API only after they have been rendered, preventing issues such as flickering loaders.
- Pre-rendering improves SEO, as search engine crawlers can access the page content.   
Since React is built with JavaScript inside a `<div id="root"/>`, crawlers cannot read HTML. Therefore, if you have public pages with a lot of content that need to be found through search engines, NextJS is essential.

### 2. **#File-based Routing:**
    - Unlike React, which lacks a built-in routing solution, NextJS provides a straightforward concept of routing, similar to basic HTML web development.
    - In this approach, each `.html` file represents a page, and the filename serves as its path.
    - NextJS supports features such as nested routes, catch-all routes, and dynamic routes.
    - **Off-topic:** Routing involves changing screen content based on the URL without sending a request to a server, thereby preventing the default browser behavior of page reload when the URL changes (e.g., with `window.location.href = "url"`).

### 3. **Full Stack Capabilities:**
    - NextJS allows for the easy addition of backend (server-side) code to your project through special pre-rendering page functions (e.g., static/serverSide Props).
    - It also facilitates the creation of custom APIs with file-based endpoint addresses, where you can write backend code as needed.
    - As a result, there's no need to build a standalone REST API backend project.
