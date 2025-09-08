---
title: "Object-Oriented Programming and OOP in JavaScript"
date: "2024-04-20"
image: "OOP.jpg"
excerpt: "OOP concepts and their implementation in JavaScript."
isFeatured: true
---

## Concepts

1. Abstraction
2. Encapsulation
3. Inheritance
4. Polymorphism

### Abstraction

Abstraction allows us to focus on **what** an object does rather than **how** it does it.

#### In TypeScript, **abstract classes** are implemented with the `abstract` keyword. <span id="abstract-class"/>

You cannot create an instance from an abstract class.
In Revuud, for example, `User` is an abstract class, while `Talent` and `Admin` are concrete implementations.

The goal is to avoid duplicating code.

[link to abstract class example](#abstract-class-example)

### Encapsulation

This is the separation of interfaces into internal and external ones—private and public properties/methods.

The goal is to prevent external users from changing the internal interface so nothing breaks from the outside.

There is a convention to prefix private properties with `_`.
At the language level, privacy is implemented with the `#` symbol:

```js
class Person {
    #_privateField: 'value'
    #_privateMethod () {}
}
new Person()._privateField// undefined
```

### Inheritance

Class inheritance extends one class with another.

The goal is to avoid duplicating code and save memory by building on existing functionality.

### Polymorphism

It is the ability to call the same method on different objects, and each object responds differently.
To achieve this, polymorphism relies on inheritance.

### Example demonstrating all 4 concepts <span id="abstract-class-example"/>

```typescript
abstract class User {
  abstract firstName: string;
  abstract lastName: string;
  abstract sendInvite(): void; //! 1. abstraction principle (declaration without implementation)

  get fullName() {
    // non-abstract method with logic
    return this.firstName + this.lastName; // unlike an interface, logic can be written here
  }
}

new User(); // Error, can't create an instance from an abstract class

class Admin extends User {
  //! 3. inheritance principle (extending a concrete class from an abstract base)
  firstName;
  lastName;

  constructor(firstName: string, lastName: string) {
    super();
    this.firstName = firstName;
    this.lastName = lastName;
  }

  get fullName() {
    //! 4. polymorphism principle (override parent `fullName` getter so it behaves differently)
    return this.firstName + " last name is NDA for admins";
  }
  sendInvite() {
    //! 4. polymorphism principle (implement the abstract method differently in two child classes)
    const author = this.fullName;
    alert({ type: "admin", author }); // fake send function
  }
}

class Talent extends User {
  //! 3. inheritance principle (extending a concrete class from an abstract base)
  firstName;
  lastName;

  #age: number; //2. encapsulation (private field)

  constructor(firstName: string, lastName: string, age: number) {
    super();
    this.firstName = firstName;
    this.lastName = lastName;

    this.#age = age;
  }
  sendInvite() {
    //! 4. polymorphism principle (implement the abstract method differently in two child classes)
    const author = super.fullName; //! 3. inheritance, calling the parent class getter
    alert({ type: "talent", author }); // fake send function
  }
}

const john = new Talent("John", "Smith", 30);
//! 2. encapsulation (the private field isn't accessible outside the Talent class)
john.#age; // SyntaxError
```
