---
title: "Design Patterns"
date: "2024-04-25"
image: "patterns.png"
excerpt: "In software development, a design pattern is a general solution to a recurring problem in program design."
isFeatured: false
---
## Creational Patterns
### Singleton
Ensures that just one instance of an object exists in the application. You can store the shared instance at the module level and return it from a function.
```typescript
class Database {
  static #_instance: Database;
  
  private constructor() {
    // Make the constructor private so nobody can call new directly.
  }
  
  // Keep the logic inside the static method so it is clear that new Database()
  // never returns an existing object.
  static getInstance() {
    if (!Database.#_instance) {
      Database.#_instance = new Database();
    }
    return Database.#_instance;
  }
}
```
With ES modules it is even simpler: just export the ready-made instance from the module.
```typescript
export default Database.getInstance();
```

### Factory
Helps create objects without exposing how they are built. A factory function selects which object to return.
```ts
function createNotifier(type: "email" | "sms") {
  if (type === "email") {
    return {
      send: (message) => console.log(`Email: ${message}`),
    };
  }

  return {
    send: (message) => console.log(`SMS: ${message}`),
  };
}

const notifier = createNotifier("sms");
notifier.send("Order is ready");
```
## Structural Patterns
### Decorator
Adds new behavior to an object without modifying its source code. We wrap a function and extend what it can do.
```ts
function withLog<T extends (...args: unknown[]) => unknown>(fn: T): T {
  return ((...args: unknown[]) => {
    console.log("Call with arguments:", args);
    const result = fn(...args);
    console.log("Result:", result);
    return result;
  }) as T;
}

const multiply = (a: number, b: number) => a * b;
const multiplyWithLog = withLog(multiply);

multiplyWithLog(2, 3);
// Call with arguments: [2, 3]
// Result: 6
```
In React a decorator is often implemented through a HOC (Higher-Order Component) that takes a component and returns a new one with added behavior.
```tsx
type WithLoaderProps = { isLoading: boolean };

function withLoader<P>(Component: React.ComponentType<P>) {
  return function WithLoader(props: P & WithLoaderProps) {
    if (props.isLoading) {
      return <div>Loading...</div>;
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

// <UsersListWithLoader users={["Ann", "Peter"]} isLoading={false} />
```
## Behavioral Patterns
### Observer
Describes a one-to-many dependency: when a source changes, every subscriber is notified.
```ts
type Listener = () => void;

const listeners: Listener[] = [];

export function subscribe(listener: Listener) {
  listeners.push(listener);
}

export function notify() {
  listeners.forEach((listener) => listener());
}

subscribe(() => console.log("User received a notification"));
subscribe(() => console.log("Logger recorded the event"));

notify();
// User received a notification
// Logger recorded the event
```
### Strategy
Defines a family of algorithms, encapsulates each one, and lets them be interchangeable. You can choose a strategy based on the situation.
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
