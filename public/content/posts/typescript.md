---
title: "TypeScript"
date: "2024-04-18"
image: "typescript.png"
excerpt: "Let's say that these are my notes about Typescript."
isFeatured: false
---

## Type VS Interface
**Type** может быть примитивом, union и tuple (кортеж), нельзя изменить после создания

```typescript
// primitive
type Name = string;

// union
type PartialPoint = PartialPointX | PartialPointY;

// tuple
type Data = [number, string];
```

**Interface** только объектом, его **повторные декларации объединяются** ([declaration merging](#declaration-merging))

### Extension & Intersection
#### Intersection
```typescript
type Shape = { color: string }
type Circle = Shape & {role: string}
```

#### Extension
Тоже самое, только синтаксис ближе к ООП
```typescript
interface Shape { 
  color: string;
}
interface Circle extends Shape { 
  radius: number;
}
```

### Implements
В implements можно вставить как type так и interface
```typescript
interface Point {
  x: number;
  y: number;
}
class SomePoint implements Point {
  x = 1;
  y = 2;
}

//same
type Point2 = {
  x: number;
  y: number;
};

class SomePoint2 implements Point2 {
  x = 1;
  y = 2;
}
```

### Declaration merging <span id="declaration-merging"/>
>Повторные декларации interface объединяются

В отличие от **type, он не может** быть изменён после создания
```typescript
// These two declarations become:
// interface Point { x: number; y: number; }
interface Point { x: number; }
interface Point { y: number; }

const point: Point = { x: 1, y: 2 };
```

## Abstract classes
Это смесь interface и class: мы задаём абстрактные свойства и методы, которые должны быть реализованы
в классе наследнике, как и в интерфейс,

НО в этой конструкции также позволено писать и общую для детей логику.
[link to OOP article](OOP#abstract-class)

## Generic type
Это динамическая <тип-переменная>, что-то вроде параметра функции,
который можно использовать в декларации типов, повышая его реюзабельность
```typescript
type ListResponse<T> = {
  count: number;
  next: string;
  previous: string;
  results: T[];
};
```

## Type Guards

1. `typeof` & `instanceof` operators:
```typescript
function fn(param: number | string | Date) {
  if (typeof param === 'string') {
    param.slice()
  } else if (param instanceof Date) {
    param.getTime()
  }
}
```
2. Predicate `is`:
Помогает TS-у лучше определять тип значения, которое проверяется функциями наподобие - isString, isUser
```typescript
const isAxiosError = (error: unknown | AxiosError): error is AxiosError => {
  return axios.isAxiosError(error);
}
```
3. `in` operator:
checks if field exists in object
```typescript
"house" in { name: "test", house: { parts: "roof" } }; // => true
"house" in { name: "test" }; // => false
```

## Utility Types
Это что-то вроде встроенных 'функций' для манипулирования типами
Напр. Partial, Pick, Omit, ReturnType, ReadOnly<PropsType> и т.д.

