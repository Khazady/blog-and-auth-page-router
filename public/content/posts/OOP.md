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


## OOP in Javascript

### Prototype inheritance

**prototype** - это объект (наследуется от Object.prototype), содержащий поля,
которые будут переданы экземпляру-наследнику `Array.prototype.map === [].map`
1. <span style="color:red;font-size:25px;">!!!</span> есть только у классов и function
2. нет у стрелочных функций

**__ proto __** 
1. это свойство-ссылка на prototype родительского класса/функции-конструктора
2. <span style="color:red;font-size:25px;">!!!</span>есть у любых типов данных кроме `null` & `undefined`
```javascript
let array = []; // under the hood - new Array()
array.__proto__ === Array.prototype
```
3. boxing transforms primitives to objects
```javascript
let age = 30; // under the hood - new Number(30)
age.__proto__ === Number.prototype
// boxing transforms age from 30 to
// { [[Prototype]]: Number, [[PrimitiveValue]]: 30 }
```
4. prototype тоже является объектом, поэтому его __ proto__ === Object.prototype блять???
```javascript
class Parent {}
class Child extends Parent {}
Child.prototype.__proto__ === Parent.prototype
```
5. движок, если не смог найти искомое свойство у объекта,
он через ссылку __proto __ полезет искать его в prototype родителя,
от которого был создан и далее в родителя родителя, пока не упрется в родителя Object равного `null`
```javascript
Child.hasOwnProperty()
Child.__proto__ === Parent.prototype 
Parent.__proto__ === Function.prototype
Function.__proto__ === Object.prototype // .hasOwnProperty sits here, in protortype of Object
Object.__proto__ === null

```

**super** - слово вызывающее конструктор суперкласса (родительского) или его методы (пример ниже)
