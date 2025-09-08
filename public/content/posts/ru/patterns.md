---
title: "Паттерны проектирования"
date: "2024-04-25"
image: "patterns.png"
excerpt: "В разработке программного обеспечения паттерн проектирования — это общее решение повторяющейся проблемы в дизайне программ."
isFeatured: false
---

### Одиночка

```typescript
class Database {
  url: string;
  static #_instance: Database;

  constructor() {
    if (Database.#_instance) {
      return Database.#_instance;
    } else {
      this.url = Math.random();
      Database.#_instance = this;
    }
  }
}
```

## Поведенческие
