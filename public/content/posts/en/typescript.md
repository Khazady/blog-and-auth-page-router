---
title: "TypeScript"
date: "2024-04-18"
image: "typescript.png"
excerpt: "Notes on TypeScript."
isFeatured: true
---

## Type vs Interface

**Type** can be a primitive, a union, or a tuple. It cannot be changed after creation

```typescript
// primitive
type Name = string;

// union
type PartialPoint = PartialPointX | PartialPointY;

// tuple
type Data = [number, string];
```

**Interface** only describes an object, and **repeated declarations are merged** ([declaration merging](#declaration-merging))

### Extension & Intersection

#### Intersection

```typescript
type Shape = { color: string };
type Circle = Shape & { role: string };
```

#### Extension

Same as intersection, but the syntax is closer to OOP

```typescript
interface Shape {
  color: string;
}
interface Circle extends Shape {
  radius: number;
}
```

### Implements

Both type and interface can be used in implements

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

> Repeated interface declarations are merged

Unlike a **type**, it cannot be changed after creation

```typescript
// These two declarations become:
// interface Point { x: number; y: number; }
interface Point {
  x: number;
}
interface Point {
  y: number;
}

const point: Point = { x: 1, y: 2 };
```

## Abstract classes

It's a mixture of interface and class: we declare abstract properties and methods that must be implemented
in the derived class, like in an interface,

BUT this construct also allows writing shared logic for children.
[link to OOP article](OOP#abstract-class)

## Generic type

This is a dynamic <type-variable>, similar to a function parameter,
which can be used in type declarations, increasing reusability

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
  if (typeof param === "string") {
    param.slice();
  } else if (param instanceof Date) {
    param.getTime();
  }
}
```

2. Predicate `is`:
   Helps TypeScript better determine the type of a value that is checked by functions like isString, isUser

```typescript
const isAxiosError = (error: unknown | AxiosError): error is AxiosError => {
  return axios.isAxiosError(error);
};
```

3. `in` operator:
   checks if field exists in object

```typescript
"house" in { name: "test", house: { parts: "roof" } }; // => true
"house" in { name: "test" }; // => false
```

## Utility Types

These are like built-in "functions" for manipulating types.
For example: Partial, Pick, Omit, ReturnType, ReadOnly<PropsType>, etc.
