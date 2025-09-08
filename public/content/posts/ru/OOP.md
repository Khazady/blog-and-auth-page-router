---
title: "Объектно-ориентированное программирование и OOP в JavaScript"
date: "2024-04-20"
image: "OOP.jpg"
excerpt: "Концепции ООП и их реализация в JavaScript."
isFeatured: true
---

## Концепции

1. Абстракция
2. Инкапсуляция
3. Наследование
4. Полиморфизм

### Абстракция

Абстракция позволяет нам сосредоточиться на том, **что** делает объект, а не на том, **как** он это делает.

#### В TypeScript реализованы **абстрактные классы** ключевым словом `abstract`. <span id="abstract-class"/>

От абстрактного класса нельзя создать экземпляр.
Пример из Revuud: абстрактный класс — User, конкретные классы — Talent и Admin.

Цель — не дублировать код

[ссылка на пример с абстрактным классом](#abstract-class-example)

### Инкапсуляция

Это разделение интерфейсов на внутренний и внешний — приватные и публичные свойства/методы.

Цель — ограничить внешних пользователей от изменений внутреннего интерфейса, чтобы ничего не сломали внутри извне.

Есть конвенция называть приватные свойства начиная с `_`.
На уровне языка реализуется символом `#`:

```js
class Person {
    #_privateField: 'value'
    #_privateMethod () {}
}
new Person()._privateField// undefined
```

### Наследование

Наследование классов – это способ расширения одного класса другим классом.

Цель — не дублировать код и экономить память, расширять уже существующий функционал.

### Полиморфизм

Это способность вызывать один и тот же метод для разных объектов, и при этом каждый объект реагирует по-своему.
Чтобы это произошло, полиморфизм использует наследование.

### Пример, демонстрирующий все 4 концепции <span id="abstract-class-example"/>

```typescript
abstract class User {
  abstract firstName: string;
  abstract lastName: string;
  abstract sendInvite(): void; //! 1. принцип абстракции (нет реализации, только объявление)

  get fullName() {
    // неабстрактный метод с логикой
    return this.firstName + this.lastName; // в отличие от интерфейса здесь можно писать логику
  }
}

new User(); // Ошибка, нельзя создать экземпляр абстрактного класса

class Admin extends User {
  //! 3. принцип наследования (расширяем конкретный класс от абстрактного)
  firstName;
  lastName;

  constructor(firstName: string, lastName: string) {
    super();
    this.firstName = firstName;
    this.lastName = lastName;
  }

  get fullName() {
    //! 4. принцип полиморфизма (переопределяем геттер родителя, чтобы он работал по-другому)
    return this.firstName + " last name is NDA for admins";
  }
  sendInvite() {
    //! 4. принцип полиморфизма (реализуем абстрактный метод по-разному в 2 дочерних классах)
    const author = this.fullName;
    alert({ type: "admin", author }); //фиктивная функция отправки
  }
}

class Talent extends User {
  //! 3. принцип наследования (расширяем конкретный класс от абстрактного)
  firstName;
  lastName;

  #age: number; //2. инкапсуляция (приватное поле)

  constructor(firstName: string, lastName: string, age: number) {
    super();
    this.firstName = firstName;
    this.lastName = lastName;

    this.#age = age;
  }
  sendInvite() {
    //! 4. принцип полиморфизма (реализуем абстрактный метод по-разному в 2 дочерних классах
    const author = super.fullName; //! 3. наследование, вызываем геттер родительского класса
    alert({ type: "talent", author }); //фиктивная функция отправки
  }
}

const john = new Talent("John", "Smith", 30);
//! 2. инкапсуляция (приватное поле недоступно вне класса Talent)
john.#age; // undefined
```
