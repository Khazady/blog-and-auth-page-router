---
title: "Design Patterns"
date: "2024-04-25"
image: "patterns.png"
excerpt: "In software engineering, a design pattern is a general repeatable solution to a commonly occurring problem in software design."
isFeatured: false
---

### Singleton

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

## поведенческие
