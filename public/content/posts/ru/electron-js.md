---
title: "Electron.js"
date: "2024-04-20"
image: "electron.webp"
excerpt: "Electron — это фреймворк для создания настольных приложений с использованием JavaScript, HTML и CSS."
isFeatured: false
---

# Electron.js

## Процессы

Electron делится на 2 процесса: основной (main) и рендерер (renderer).

1. **Main** имеет доступ к Node API и модулям Electron.
2. **Renderer** — это браузерный процесс, который делится на:
   1. фронтенд-фреймворк;
   2. скрипт preload.ts.

![main-process-and-frontend-processes](electron-processes.png)
