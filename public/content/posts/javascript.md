---
title: "JavaScript"
date: "2024-04-18"
image: "javascript.jpeg"
excerpt: "My notes about Javascript, i'll split this page later"
isFeatured: false
---

## Common:

### Hoisting - поднятие
Декларация __функции и var__ поднимается в начало кода со значением `undefined`

**do hoist**:
1. `function declaration(){}`
2. `var`

**don't hoist**:
1. `let functionExpression = () => {}`
2. `let functionExpression = function (){}`
3.  `let/const`

It's correct code;
```js
a = 1;
var a; // compilator will hoist this line upper
```

### Замыкание closure
Когда функция запоминает своё лексическое окружение в скрытом свойстве `[[Environment]]`

Напр. дочерняя функция запомнит параметр родительской функции

```js
const maxLengthCreator = (maxLength) => {
    return (value) => {
        return value.length > maxLength ? `Max length is ${maxLength} symbols` : undefined
    }
};
const max10 = maxLengthCreator(10); //max10 функция замкнула значение maxLength == 10
max10('This is string more than 10 letters')
````

### Boxing/Unboxing                                                                             
                                                                                                
Вызывая `.length` у строки, движок js **оборачивает** примитив `"str"` в `new String("str")`    
и у этого объекта вызывает поле `.length`, 
после чего **удаляет** объект, чтобы мы не могли присвоить ему своих полей.                     

## Asynchrony

### Event loop

#### Ответ на заучить:
1. Компилятор в колл стеке выполняет синхронный код 
   - И регистрирует асинхронные задачи в одной из очередей 
   - И попутно при необходимости выполняя web API (**!!! Напр.** 10 сек таймера или обработчик события будет висеть и его ждать)
2. Колл стек свободен - Далее выполняются асинхронные задачи
   - начиная с очереди микрозадач, выполняются ВСЕ **микрозадачи** в очереди
     - начиная с **самой старой**
    - ТУТ РЕРЕНДЕР
3. Колл стек и очередь микро свободна - Далее выполняется ОДНА самая старая макрозадача
   - после этого цикл повторяется


#### Theory:
1. **Call Stack** - Это синхронный код. 
    - **стэк, стопка** - выполняются **сначала новые**

2. **Callback (Microtask) queue** - После освобождения стека в очереди выполняются микрозадачи
   - микрозадачи могут возвращать другие микрозадачи, создавая **очередь** микрозадач - chain of `.then` & `.catch`)
   - **очередь** - выполняются **сначала старые**
   - помимо промисов есть `queueMicrotask`(Web) & `process.nextTick`(Node)

3. **Macro(task) queue** - После освобождения стека и очереди микрозадач, event loop проверяет наличие макрозадач.
Самая старая макрозадача помещается в стек, выполняется и затем выполняются **все** новые микрозадачи, добавленные в очередь. Далее выполняется следующая макрозадача и т.д.
   - Это Web APIs (fetch, setTimeout, слушатели событий).

![event-loop.png](event-loop.png)

   
#### Common cases:

Regular: `Sync code > Async code (micro - high prio) > Browser API code (macro - low prio)`

Macro in Micro (SetTimeout in Promise): `sync code > setTimeout > .then`
```javascript
const promise = new Promise((resolve, reject) => {
    console.log(1);
    setTimeout(() => {
        console.log("timerStart");
        resolve("success");
        console.log("timerEnd");
    }, 0);
    console.log(2);
});

promise.then((res) => {
    console.log(res);
});
```

Micro in Macro (Promise in SetTimeout): `sync code > micro > macro`
```javascript
const timer1 = setTimeout(() => {
    console.log('timer1');
    const promise1 = Promise.resolve().then(() => {
        console.log('promise1');
    });
}, 0);

const timer2 = setTimeout(() => {
    console.log('timer2');
}, 0);
```

#### Example:

<https://www.jsv9000.app>

```javascript
function logA() { console.log('A'); }
function logB() { console.log('B'); }
function logC() { console.log('C'); }
function logD() { console.log('D'); }
function logE() { console.log('E'); }

function timeoutWithPromise() { Promise.resolve().then(logE); }

setTimeout(timeoutWithPromise, 0); // 5
logA(); // 1
setTimeout(logB, 5000); // 6
Promise.resolve().then(logC).then(logA); // 3 - 4
logD(); // 2
```

**Step 1.** **Evaluate Script**

<span style='background-color: yellow'>Synchronously execute the script as though it were a function body. Run until the Call Stack is empty.</span>

1. logA > console.log(A) // call stack
2. logB // task queue
3. logC // microtask queue
4. logD > console.log(D) // call stack

**Step 2. Run all Microtasks**

<span style='background-color: yellow'>Select the oldest Microtask from the Microtask Queue. Run it until the Call Stack is empty. Repeat until the Microtask Queue is empty.</span>

5. logC// from micro to call stack > > console.log(C) // call stack
6. logA // microtask queue (.then chain)
7. logA// from micro to call stack > > console.log(A) // call stack

**Step 3. Rerender**

<span style='background-color: yellow'>Rerender the UI (This step only applies to browsers, not NodeJS).</span>

**Step 4. Run a Task**

<span style='background-color: yellow'>Select the oldest Task from the Task Queue. Run it until the Call Stack is empty.</span>

8. timeoutWithPromise // call stack

**Step 2. Run all Microtasks**

9. log E // microtask queue
10. log E // from micro to call stack >> > console.log(E) // call stack
11. log F // microtask queue
12 log F // from micro to call stack >> console.log(F) // call stack

**Step 3. Rerender**

**Step 4. Run a Task**

13. logB > console.log(B) // call stack

### Promise

**Создание** - конструктор new Promise с аргументом в виде cb, в которую передаются аргументами передаются функции resolve & reject.

```javascript
const myPromise = new Promise ( (resolve, reject) => { } )
```

**Cостояние** - pending | fulfilled | rejected. Хранится в скрытом свойстве экземпляра `[[PromiseState]]`

**Подписка** - у экземпляра есть функции then, catch, finally для подписки на изменения состояния промиса

**Результат** - хранится в скрытом свойстве экземпляра `[[PromiseResult]]`. Передаётся в функции подписки:

`.then(data => { })`

`.catch(error => { })`

#### Статические методы:

**all**:
-  возвращает другой promise, который зарезолвится когда ЗАРЕЗОЛВЯТСЯ ВСЕ промисы из его массива.
-  если хотя бы один из [] rejected, то promise из all тоже rejected
-  .then all сидит массив результатов всех промисов

**race**:
- отработает, когда первый promise из массива выполнится

**allSettled**:
- возвращает promise, который зарезолвится, когда все промисы из его массива уйдут из состояния pending (попадем в then, даже если некоторые зареджектятся)

#### Chains:
каждый then и catch возвращают новый промис. Catch как и then может вернуть fulfilled или rejected промис. 

`.then(data => Promise.reject() ).then().then()` - 2 и 3 промисы не будут испольнены

`.then(data => Promise.resolve() ).catch().then()` - catch не будет исполнен

`.then(data => Promise.reject() ).catch().then()` - все функции-подписчики будут исполнены

## OOP - objected oriented programming

### Общие определения:
**Класс/Функция конструктор** - Определяет характеристики объекта. Класс является описанием шаблона свойств и методов объекта. По-простому класс это шаблон по которому в дальнейшем создаются объекты (экземпляры).

**Функция-конструктор** - это отдельный вид функции - имя функции-конструктора должно начинаться с большой буквы, функция-конструктор **должна вызываться при помощи оператора "new"**. Такой вызов **создаёт пустой this** в начале выполнения и возвращает заполненный в конце (в виде самого объекта).

**Объект** - Экземпляр класса создается с помощью функции оператора new - new constructor (arguments)

### Cоздание классов и экземпляров:

```javascript
function Car(model, year) {  // это класс
    //это конструктор
    this.model = model;
    this.year = year;
}

// **тоже самое в es6** синтаксисе
class Car {
    constructor(model, year) {
        this.model = model;
        this.year = year;
    }
}

//это вызов функции-конструктора
let laguna = new Car("laguna", 2002) 
// результат {model: "laguna", year: 2002}
```

### Наследование:

**Prototype** - объект, который присутствует у всех функций и вызывается по цепочке сверху вниз

**__proto__** -- ссылка на объект prototype класса родителя

```javascript
[].__proto__ === Array.prototype
```

**super** - слово вызывающее конструктор суперкласса (родительского) или его методы (пример ниже)

### Методы:

-   Уникальные:
```javascript
function NameOfClass() {
    this.info = () => console.log('info')
}
   ```
-   Общие:
```javascript
NameOfClass.prototype.age = () => console.log('age')
   ```
-   Статические:
```js
NameOfClass.sayHello = () => console.log('hello')
```
Ниже примеры для es6:

```js
class  Rabbit  extends  Animal  {
    constructor (name) {
        super(name) //вызывает конструктор Animal
        this.fuck = function () { //уникальный метод для каждого экземпляра
            console.log('rabbits are fast')
        }
    }
    hide() {
        alert(`${this.name} прячется!`); //общий (в prototype)
    }
    stop() {
        super.stop(); // вызов метода из Animal
        this.hide(); // и затем hide
    }
    static run() { //статический метод, не требует дату экземпляра
        alert('Rabbit can run')
    }
}
```

### Создание объекта:
```js
const admin = Object.create(user, {
    isAdmin: {value: true}
})
//это тоже самое, что и (наследуем объект user как класс)
let admin = {
    __proto__: user,
    isAdmin: true
};
// и тоже самое
let admin = new Object({
    __proto__: user,
    isAdmin: true
})
```
### Копирование объекта:

#### Reference copying
```js
let admin = user;
( {} === {} ) // false, objects are never equal, only references
```
#### Shallow copying
1. Object.assign
```js
let user = {
    name: "John",
    age: 30
};
let anotherObject = { role: 'admin' }

let shallowClone = Object.assign({}, user, anotherObject);
```
2. Spread operator
```js
let shallowClone = {...user, ...anotherObject};
```
#### Deep copying
1. JSON.parse(JSON.stringify(originalObj))
```js
const originalObj = { a: 1, b: { c: 2 } };
const clone = JSON.parse(JSON.stringify(originalObj))
```
> - <span style="color:red;font-size:25px;">!!!</span> JSON format doesn't support methods, so you can't copy methods in such way.
> - It's also expensive in computational costs
2. Recursive copying implementation
3. `lodash.deepClone`
4. `window.structuredClonse` (modern browsers only)
> - <span style="color:red;font-size:25px;">!!!</span> structuredClone can't copy methods

### Контекст:
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

     
### CHAINING
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

## БРАУЗЕРНЫЙ JS

### Terms

`removeEventListener("click", название функции)` -- нам нужно назвать функцию внутри, если мы хотим удалить

`event.target` - элемент, на котором событие возникло изначально

`event.currentTarget` - элемент, на котором обработчик события был назначен

**Фазы события: Погружение -- Цель - Всплытие**

### Всплытие (bubbling) 

Когда кликаем на button внутри div, событие сработает сначала в button потом в div потом в body

Остановить можно `event.stopPropagation` в `addEventListener`

`event.stopImmediatePropagation` останавливает всплытие даже на соседние элементы (в одном родителе)

### Погружение (immersion)
```js
element.addEventListener ( "click", e => { 
    e.preventDefault()
}, {capture: true}
)
```
3-ий аргумент опциональный(либо просто true). Полезно, **если нужно выполнить событие сначала на родительском элементе**

### Делегирование(delegation) событий:
**Пример:**
допустим у нас 800к комментов и на каждый придется вешать свой обработчик события для лайка/дизлайка.

Вместо этого используется прием делегирования -
вешаем обработчик на родителя элементов и с помощью `if (event.target.tagName)` указываем где именно должен произойти клик, таким образом мы сэкономили кучу памяти.
               
## FP - Functional Programming
### КАРРИРОВАНИЕ (carrying)
    
Example from [closure](#замыкание-closure):
```js
 maxLengthCreator(10)('This is string from some input')
 ```
Это трансформация функций таким образом, чтобы они принимали аргументы не как `fun(a, b, c)`, а как `fun(a)(b)(c)`.
 ```js
const sum = (n) => b => b + n
sum(1)(2) // 3
```
>sum is a HOF (High order function)
> 
>similar conception exists in React - HOC (High order component)




**Autorization**

JWT (JSON Web Token)

FE <> BE

1.  /login > creates JWT
2.  save in localStorage < response (JWT)
3.  request with signed JWT (placed in header) > validate JWT

Session

FE <> DB

1.  /login > store session 
2.  save cookie < response (session id)
3.  request with cookie > check session
4.  < response

Cons:

Vulnerable for CSRF - cross-site-request-forgery

Requires storage

**Common Questions**

1.  После введения URL в адресную строку - DNS > IP > html > css > js > гидрация и т.д.
2.  Как копировать объект

**Security**

CORS


Patters: singleton (Windows class e.g.)
