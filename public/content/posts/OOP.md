---
title: "Object Oriented Programming and OOP in Javascript"
date: "2024-04-20"
image: "OOP.jpg"
excerpt: "OOP concepts and it's implementation in Javascript."
isFeatured: false
---

## Concepts
1. Abstraction
2. Encapsulation
3. Inheritance
4. Polymorphism

### Abstraction
Абстракция позволяет нам сосредоточиться на том, **что** объект делает, а не на том, **как** он это делает.

#### В Typescript реализованы **абстрактные классы** ключевым словом `abstract`. <span id="abstract-class"/>
От абстрактного класса нельзя создать экземпляр.
Пример с _Revuud_ абстрактного класса - User, в том время как класс - Talent, Admin.

Цель - не дублируем код 

[link to abstract class example](#abstract-class-example)

### Encapsulation
Это разделение интерфейсов на внутренний и внешний - приватные и публичные свойства/методы. 

Цель - ограничить внешних пользователей от изменений внутреннего интерфейса, чтобы ничего не сломали внутри извне.

Есть конвенция называть приватные свойства начиная с `_`
На уровне языка реализуется символом `#`: 
```js
class Person {
    #_privateField: 'value'
    #_privateMethod () {}
}
new Person()._privateField// undefined
```

### Inheritance
Наследование классов – это способ расширения одного класса другим классом.

Цель - не дублировать код и экономить память, расширять уже существующий функционал.

В javascript реализовано через прототипы:

**prototype** - объект, который присутствует у всех функций и вызывается по цепочке сверху вниз

**__proto__** -- ссылка на объект prototype класса родителя

```javascript
[].__proto__ === Array.prototype

Child.prototype.__proto__ === Parent.prototype
```

**super** - слово вызывающее конструктор суперкласса (родительского) или его методы (пример ниже)

### Polymorphism
Это способность вызывать один и тот же метод для разных объектов, и при этом каждый объект реагирует по-своему.
Чтобы это произошло полиморфизм использует наследование.


### Example demonstrating all 4 concepts <span id="abstract-class-example"/>
```typescript
abstract class User {
  abstract firstName: string;
  abstract lastName: string;
  abstract sendInvite(): void; //! 1. abstraction principle (no concrete implementation, only declaration)

  get fullName () { // non-abstract method with logic 
    return this.firstName + this.lastName; // that's difference with interface, that you can write logic here
  };

}

new User(); // Error, can't create instance from abstract class

class Admin extends User { //! 3. inheritance principle (extending concrecte class from abstract)
  firstName;
  lastName;
  
  constructor(firstName: string, lastName: string) {
    this.firstName = firstName;
    this.lastName = lastName;
  }

  get fullName (){ //! 4. polymorphysm principle (overwrite parent fullName getter, so it works differently now)
    return this.firstName + ' last name is NDA for admins'
  }
  sendInvite() { //! 4. polymorphysm principle (implementing abstract method differently in 2 children classes)
    const author = this.fullName 
    alert({type: 'admin', author}) //fake send function
  }
}

class Talent extends User { //! 3. inheritance principle (extending concrecte class from abstract)
  firstName;
  lastName;

  #age: number; //2. encapsulation (private field)

  constructor(firstName: string, lastName: string, age: number) {
    this.firstName = firstName;
    this.lastName = lastName;

    this.#age = age;
  }
  sendInvite() { //! 4. polymorphysm principle (implementing abstract method differently in 2 children classes
    const author = super.fullName //! 3. inheritance, call the parent-class getter
    alert({type: 'talent', author}) //fake send function
  }
}

const john = new Talent('John', 'Smith', 30);
//! 2. encapsulation (private field is not available from outside of the Talent class)
john.#age // undefined 
```
