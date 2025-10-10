---
title: "Паттерны проектирования"
date: "2024-04-25"
image: "patterns.png"
excerpt: "В разработке программного обеспечения паттерн проектирования — это общее решение повторяющейся проблемы в дизайне программ."
isFeatured: false
---
## Порождающие паттерны
### Одиночка
Следит за тем, чтобы в приложении существовал только один экземпляр объекта. Достаточно хранить общий экземпляр в области модуля и возвращать его через функцию.
```typescript
class Database {
  static #_instance: Database;
  
  private constructor() {
    // делаем конструктор приватным, чтобы запретить вызов через new 
  }
  
  //делаем логику в статическом методе, а не в конструкторе, чтобы не вводить в заблуждение,
  //что создание нового инстанса new Database() может возвращать старый объект
  static getInstance() {
    if (!Database.#_instance) {
      Database.#_instance = new Database();
    }
    return Database.#_instance
  }
}
```
Еще проще в случае с ES-модулями - просто экспортировать готовый инстанс из модуля.
В данном примере:
```typescript
export default Database.getInstance();
```

### Фабрика
Помогает создавать объекты, не раскрывая детали их устройства. Функция-фабрика сама решает, какой объект вернуть.
```ts
function createNotifier(type: "email" | "sms") {
  if (type === "email") {
    return {
      send: (message) => console.log(`Письмо: ${message}`),
    };
  }

  return {
    send: (message) => console.log(`SMS: ${message}`),
  };
}

const notifier = createNotifier("sms");
notifier.send("Order is ready");
```
## Структурные паттерны
### Декоратор
Добавляет объекту новое поведение, не изменяя его исходный код. Мы оборачиваем функцию и расширяем ее возможности.
```ts
function withLog<T extends (...args: unknown[]) => unknown>(fn: T): T {
  return ((...args: unknown[]) => {
    console.log("Вызов с аргументами:", args);
    const result = fn(...args);
    console.log("Результат:", result);
    return result;
  }) as T;
}

const multiply = (a: number, b: number) => a * b;
const multiplyWithLog = withLog(multiply);

multiplyWithLog(2, 3);
// Вызов с аргументами: [2, 3]
// Результат: 6
```
В React декоратор часто реализуют через HOC (Higher-Order Component), который принимает компонент и возвращает новый с добавленным поведением.
```tsx
type WithLoaderProps = { isLoading: boolean };

function withLoader<P>(Component: React.ComponentType<P>) {
  return function WithLoader(props: P & WithLoaderProps) {
    if (props.isLoading) {
      return <div>Загрузка...</div>;
    }

    const { isLoading, ...restProps } = props;
    return <Component {...(restProps as P)} />;
  };
}

function UsersList({ users }: { users: string[] }) {
  return (
    <ul>
      {users.map((user) => (
        <li key={user}>{user}</li>
      ))}
    </ul>
  );
}

const UsersListWithLoader = withLoader(UsersList);

// <UsersListWithLoader users={["Аня", "Петр"]} isLoading={false} />
```
## Поведенческие паттерны
### Наблюдатель
Описывает зависимость "один ко многим": когда источник события изменяется, все подписчики получают уведомление.
```ts
type Listener = () => void;

const listeners: Listener[] = [];

export function subscribe(listener: Listener) {
  listeners.push(listener);
}

export function notify() {
  listeners.forEach((listener) => listener());
}

subscribe(() => console.log("Пользователь получил уведомление"));
subscribe(() => console.log("Логгер записал событие"));

notify();
// Пользователь получил уведомление
// Логгер записал событие
```
### Стратегия
Определяет семейство алгоритмов, инкапсулирует каждый из них и позволяет взаимозаменять. Мы можем выбирать стратегию в зависимости от ситуации.
```ts
type PriceStrategy = (value: number) => string;

const short: PriceStrategy = (value) => `$${value}`;
const detailed: PriceStrategy = (value) => `${value.toFixed(2)} USD`;

function formatPrice(value: number, strategy: PriceStrategy) {
  return strategy(value);
}

const products = [199, 49.9, 12];
const strategy = detailed;

products.map((price) => console.log(formatPrice(price, strategy)));
// 199.00 USD
// 49.90 USD
// 12.00 USD
```
