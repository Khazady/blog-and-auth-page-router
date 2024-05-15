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
    super()
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
    super()
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

### Common:
**Function-constructor** - `new Promise()`это отдельный вид функции
1. имя должно начинаться с большой буквы,
2. **должна вызываться при помощи оператора "new"**.
3. такой вызов **создаёт пустой this**

**Function-constructor (class)** - Определяет характеристики объекта. Класс это шаблон по которому в дальнейшем создаются объекты (экземпляры).

**Объект** - Экземпляр класса создается с помощью функции оператора new - new constructor (arguments)

### Class and instance creation:
```javascript
function Car(model, year) {  // class
    // constructor
    this.model = model;
    this.year = year;
}

// same in ES6+
class Car {
    constructor(model, year) {
        this.model = model;
        this.year = year;
    }
}

// call function-constructor (class)
let laguna = new Car("laguna", 2002) // {model: "laguna", year: 2002}
```

### Prototype inheritance

**prototype** - это объект, содержащий поля,
которые будут переданы экземпляру-наследнику `Array.prototype.map === [].map` 
и экземплярам дочерних классов `Object.prototype.hasOwnProperty === [].hasOwnProperty`
1. <span style="color:red;font-size:25px;">!!!</span> есть только у классов и function
2. <span style="color:red;font-size:25px;">!!!</span> нет у стрелочных функций

**`__proto__`** 
1. <span style="color:red;font-size:25px;">!!!</span> это свойство-ссылка на prototype родительского класса/функции-конструктора
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
4. Движок, если не смог найти искомое свойство у объекта,
он через ссылку `__proto__` последует искать его в prototype родителя,
от которого был создан и далее в родителя родителя, пока не достигнет объекта-родителя Object, который имеет прототип равный `null`
```javascript
Child.hasOwnProperty()
Child.prototype.__proto__ === Parent.prototype 
Parent.prototype.__proto__ === Object.prototype // .hasOwnProperty sits here, in protortype of Object
Object.__proto__ === null
```
5. <span style="color:red;font-size:18px;">!</span> Не нужно путать ссылку `__proto__` у прототипа и самого класса (функции)
```javascript
Child.bind()
Child.__proto__ === Parent.prototype
Parent.__proto__ === Function.prototype // .bind sits here, in prototype of Function
```

**super** - слово вызывающее конструктор суперкласса (родительского) или его методы (пример ниже)


### Getter & Setter:

У объекта помимо свойств и методов, есть **свойства-аксеcсоры** - `get` и `set`.
>По своей сути **это функции**, которые используются **для присвоения и получения значения**,
но во внешнем коде они **выглядят как обычные** свойства объекта.

```js
let user = {
    name:  "John",
    surname: "Smith",
    get fullName() {
        return `${this.name} ${this.surname}`;
    }, //getter example
    set fullName(value) {
        [this.name, this.surname] = value.split(" ");
    }, //setter example
};

// getter usage
alert(user.fullName); // John Smith

// setter usage
user.fullName = "Alice Cooper";
alert(user.name);  // Alice
alert(user.surname);  // Cooper
```

### Context:
**THIS** - слово this ссылается на текущий контекст,
>**это ссылка на объект в котором выполняется функция**
>
>позволяет вам работать со свойствами/методами класса

global scope:
**no use strict** - this === `window`(Web) or `global` (Node.js)
**use strict**  - `this == undefined`;

1.  Контекст(this) для стрелочных функци определяется **в момент их создания**.
    ```js
    const helloArrow = () => console.log('hello', this) // создана в глоб. области
    Car.sayHello = helloArrow;
    Car.sayHello() // выведет класс Window, т.к. была создана в глобальной области и **замкнулась** на класс Window
    ```
2.  Контекст(this) для `function(){}` определяется в **момент их вызова** и равен объекту перед точкой.\
    ```js
    function helloFunc () { console.log('hello', this )}
    Car.sayHello = helloFunc; // (статический метод, присвоен классу)
    Car.sayHello() // выведет конструктор класса Car (класс перед точкой)
    laguna.sayHello = hello
    ```

#### Переопределение контекста, а также методы класса Function:

**bind** - let новаяФункция = стараяФункция.bind(новыйКонтекст, остальные Аргументы нужные старойФункции)  **передает новый контекст(но не вызывает функцию!)**

**call** - тоже самое, только **сразу же вызывает** функцию

**apply** - тоже самое, но **остальные аргументы в массиве** -- стараяФункция.bind(новыйКонтекст, [остальные Аргументы, нужные старойФункции])

!!!**Нельзя перепресвоить** контекст для новойФункции **повторно**! повторно вызвав один из методов


### Chaining
Нужно **просто возвращать** `this` в каждом методе и сохранять в другое поле результат
Можно реализовать и в функции, и в объекте, и в классе
>Удобно когда нужно сделать множество последовательных операций (с одной сущностью).
```js
const main = {
  data: {
    i: 0,
  },
  initiate: function (num = 0) {
    this.data.i = num;
    return this;
  },
  add: function (num) {
    this.data.i += num;
    return this;
  },
  subtract: function (num) {
    this.data.i -= num;
    return this;
  },
  multiple: function (num) {
    this.data.i *= num;
    return this;
  },
  divide: function (num) {
    this.data.i /= num;
    return this;
  },
  print: function () {
    return this.data.i;
  },
};
const value = main.initiate(10).add(6).subtract(4).divide(3).multiple(2).print(); //8
```                                                                                                           
