---
title: "Electron.js"
date: "2024-04-20"
image: "electron.webp"
excerpt: "Electron is a framework for building desktop applications using JavaScript, HTML, and CSS."
isFeatured: false
---
# Electron.js

## Processes
Electron is divided into 2 processes: main and renderer.

1. The **main** process has access to Node API and Electron Main Modules.
2. The **renderer** process is the browser process, which is further divided into:
   1. the frontend framework
   2. preload.ts script

![main-process-and-frontend-processes](electron-processes.png)

