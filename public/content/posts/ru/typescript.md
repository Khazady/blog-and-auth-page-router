---
title: "TypeScript"
date: "2024-04-18"
image: "typescript.png"
excerpt: "Заметки о TypeScript."
isFeatured: true
---

## Type vs Interface

**Type** может быть примитивом, union или tuple (кортеж). Нельзя изменить после создания.

```typescript
// primitive
type Name = string;

// union
type PartialPoint = PartialPointX | PartialPointY;

// tuple
type Data = [number, string];
```

**Interface** описывает только объект, и **повторные объявления объединяются** ([declaration merging](#declaration-merging))

### Extension & Intersection

#### Intersection

```typescript
type Shape = { color: string };
type Circle = Shape & { role: string };
```

#### Extension

То же самое, только синтаксис ближе к ООП.

```typescript
interface Shape {
  color: string;
}
interface Circle extends Shape {
  radius: number;
}
```

### Implements

В `implements` можно вставить как type, так и interface.

```typescript
interface Point {
  x: number;
  y: number;
}
class SomePoint implements Point {
  x = 1;
  y = 2;
}

// same
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

> Повторные объявления интерфейса объединяются.

В отличие от **type**, он не может быть изменён после создания.

```typescript
// Эти две декларации становятся:
// interface Point { x: number; y: number; }
interface Point {
  x: number;
}
interface Point {
  y: number;
}

const point: Point = { x: 1, y: 2 };
```

## Абстрактные классы

Это смесь interface и class: мы задаём абстрактные свойства и методы, которые должны быть реализованы
в классе-наследнике, как и в интерфейсе,

НО в этой конструкции также позволено писать общую для детей логику.
[link to OOP article](OOP#abstract-class)

## Generic type

Это динамическая <тип-переменная>, что-то вроде параметра функции,
которую можно использовать в декларации типов, повышая его реюзабельность.

```typescript
type ListResponse<T> = {
  count: number;
  next: string;
  previous: string;
  results: T[];
};
```

## Type Guards

1. Операторы `typeof` и `instanceof`:

```typescript
function fn(param: number | string | Date) {
  if (typeof param === "string") {
    param.slice();
  } else if (param instanceof Date) {
    param.getTime();
  }
}
```

2. Предикат `is`:
   Помогает TS лучше определять тип значения, которое проверяется функциями наподобие isString, isUser.

```typescript
const isAxiosError = (error: unknown | AxiosError): error is AxiosError => {
  return axios.isAxiosError(error);
};
```

3. Оператор `in`:
   проверяет, существует ли поле в объекте

```typescript
"house" in { name: "test", house: { parts: "roof" } }; // => true
"house" in { name: "test" }; // => false
```

## Utility Types

Это что-то вроде встроенных «функций» для манипулирования типами.
Например: Partial, Pick, Omit, ReturnType, ReadOnly<PropsType> и т.д.
