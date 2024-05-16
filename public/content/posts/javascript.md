---
title: "JavaScript"
date: "2024-04-18"
image: "javascript.jpeg"
excerpt: "My notes about Javascript, i'll split this page later"
isFeatured: false
---

## Common
### Complex types of data
#### Map - ассоциативный массив / словарь
>Это объект, где ключом может помимо строки быть любой тип данных
 
Пример оптимизации Мапом 
```js
// было
const getAssets = async () => [ //pseudo-GET req
    {symbol: 'APPL', price: 100},
    {symbol: 'GOOG', price: 50},
    {symbol: 'MSFT', price: 25}
]
const resp = await getAssets()
// iterates every time in Biseness Logic Layer
resp.find(asset => asset.symbol === 'MSFT')
// стало
const transformAssetsArrayToMap = async () => {
    const respArray = await getAssets()
    const respMap = new Map()
    // iterates 1 time in Data Acess Layer
    respArray.forEach(asset => {
        const {symbol, ...rest} = asset
        respMap.set(symbol, {...rest});
    });
    return respMap
}
const resp = await transformAssetsArrayToMap()
// instant in BLL
resp.get('MSFT') 
```
#### Set - массив, только с уникальными значениями
Можно отфильтровать дубликаты с массива
`const uniqArr = [...new Set(arr)];`
#### WeakMap - словарь со слабыми ссылками
Нужен для того, чтобы помочь **garbage collector** удалить неиспользуемые объекты
т.к. в Map они хранятся даже когда все ссылки в коде на них были перезаписаны
>Ключом могут быть только объекты.
>Не поддерживает методы, которыми можно взять все ключи сразу _(keys(), values(), entries()
> т.к. мы не знаем в какой момент происходит удаление объектов сборщиком мусора)_

Напр. Map
```js
let john = { name: "John" };

let map = new Map();
map.set(john, "...");

john = null; // overwrite the reference

// объект john сохранён внутри объекта `Map`
// и будет занимать место в памяти, хотя уже не используется в коде,
// и доступен только через map.keys()
```
Same code with WeakMap:
```js
let john = { name: "John" };

let weakMap = new WeakMap();
weakMap.set(john, "...");

john = null; // перезаписываем ссылку на объект

// объект john !будет удалён из памяти сборщиком!
```
[memoization example with WeakMap](#weakmap-cache)
#### WeakSet
Тоже самое, только Set-подобная структура
> тоже ключи только объекты и тоже удаляет из памяти
> неиспользуемые в иных местах объекты

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

### Boxing/Unboxing                                                                             
                                                                                                
Вызывая `.length` у строки, движок js **оборачивает** примитив `"str"` в `new String("str")`    
и у этого объекта вызывает поле `.length`, 
после чего **удаляет** объект, чтобы мы не могли присвоить ему своих полей.                     

## Objects

### Object creating:
```javascript
//inherite user object as prototype
const admin = Object.create(user)
let admin = { __proto__: user }
let admin = new Object({ __proto__: user })
```
### Object copying:
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

## Functions
### Замыкание closure
Когда функция запоминает своё лексическое окружение в скрытом свойстве `[[Environment]]`

Напр. дочерняя функция запомнит параметр родительской функции

<span id="closure"></span>

```js
const maxLengthCreator = (maxLength) => {
    return (value) => {
        return value.length > maxLength ? `Max length is ${maxLength} symbols` : undefined
    }
};
const max10 = maxLengthCreator(10); //max10 функция замкнула значение maxLength == 10
max10('This is string more than 10 letters')
````

### Псевдомассив `arguments`
* даже если мы объявили функцию без аргументов, мы всё равно можем передать в неё параметры, 
они попадут в специальный псевдомассив(нет методов массива) и к ним можно будет обратиться по индексам –

* В `use strict` arguments ведет себя по другому, с пересваиванием параметров
* У стрелочных нету псевдомассива arguments
### Современная замена - …rest оператор
`function(first, second, …restArgs){}` – остальные аргументы сложаться в настоящий массив

![spread, rest, destructuring operators](3-dots-syntax.png)



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

## Browser Javascript

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

### Делегирование событий(event delegation):
**Пример:**
допустим у нас 800к комментов и на каждый придется вешать свой обработчик события для лайка/дизлайка.

Вместо этого используется прием делегирования -
вешаем обработчик на родителя элементов и с помощью `if (event.target.tagName)` указываем где именно должен произойти клик, таким образом мы сэкономили кучу памяти.

## FP - Functional Programming
### КАРРИРОВАНИЕ (carrying)
    
[Example from closure](#closure):
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

## Popular tasks
### Мемоизация (кэширование)
```javascript
const add = (a, b) => a + b
    
// HOF-мемоизатор
function memoize(func) {
    const cache = {}
    return function(...args) {
        // Формируем уникальный ключ для комбинации аргументов
        let keyForThisCall = JSON.stringify(args)
        if (cache[keyForThisCall]) { // Если результат уже в памяти
            return cache[keyForThisCall] // возвращаем его
        } else {
            const result = func(args[0], args[1])  // Иначе считаем
            cache[keyForThisCall] = result // и сохраняем в память
            return result
        }
    }
}

const memoizedAdd = memoize(add)

console.log(memoizedAdd(2, 3)); // Складываем 2 и 3, результат 5
console.log(memoizedAdd(2, 3)); // Берем из памяти 2,3, результат 5
```

### Advanced, мемоизация с WeakMap/WeakSet <span id="weakmap-cache"/>
```js
const difficultCalculationsWithObject = (obj) => {
    return {...obj}
};
// HOF-мемоизатор
function memoize(func) {
    const cache = new WeakMap();
    return function(...args) {
        // Уникальным ключом будет ссылка на объект переданный в аргументах
        const keyForThisCall = args[0];
        if (cache.has(keyForThisCall)) {
            const cachedResult = cache.get(keyForThisCall) // Если результат уже в памяти
            return cachedResult // возвращаем его
        } else {
            let result = func(keyForThisCall); // Иначе считаем
            cache.set(keyForThisCall, result);  // и сохраняем в память
            return result;
        }
    }
}

const memoizedFunc = memoize(difficultCalculationsWithObject);

let obj1 = { a: 1, b: 2 };

console.log(memoizedFunc(obj1)); // calculates 1st call
console.log(memoizedFunc(obj1)); // takes from cache 2nd
obj1 = {} // overwrite the reference
// позже { a: 1, b: 2 } будет удалён из WeakMap cache и из памяти
```
