---
title: React.js
excerpt: React is a JavaScript library for building web and native user interfaces.
image: react.png
isFeatured: true
date: "2024-04-05"
---

# React

## React vs. Vanilla JS:

- React code is more readable (JSX = JS + HTML in one file)
- Components
- JS is imperative (you literally give step-by-step instructions)
- React is declarative (you describe what you want to achieve)

```javascript
// Imperative
const element = document.createElement("p");
element.appendText = "example";
element.className = "styles";
element.addEventListener("click", function () {});
// Declarative
<p className="styles" onClick={function () {}}>
  example
</p>;
```

## Virtual DOM

- The virtual DOM represents simplified JavaScript objects compared to the real DOM.

## Reconciliation

- This is the process of comparing the old and new versions (snapshot) of the Virtual DOM after data changes (for example, an array used to render a list)
- Based on this comparison, React performs targeted updates to the real DOM.
- As a result, the user sees only the updated list item rather than all elements being re-rendered.

## Basic hooks

### useState

- Represents local component state.
- Compares the previous and new values and, when needed, re-renders the UI parts that depend on it (unlike a regular variable changed inside an event listener).
- Correct way to update state: `setState(prev => prev + 1)`.
- `useState(compute())` lets you pass a function as the initial state so the value is computed only once.

### useRef

- Can be used like useState, but **changing it does not trigger a re-render**.
- Can also store a reference to a DOM element.

### useContext

- Helps avoid **props drilling**, when you would otherwise pass state through every level of the component tree.
- TODO: React context vs state management libraries (Redux vs Zustand vs React Query vs React Context)

### useCallback <span id="useCallback"></span>

1. Used with [React.memo](#React.memo) for functions passed to child components to retain the same reference between parent re-renders.

### useMemo <span id="useMemo"></span>

Use cases:

1. Similar to useCallback but for objects, arrays, etc., used alongside [React.memo](#React.memo).
2. When one state is expensive to compute and another state changes, the expensive state is still recomputed on every render.

```javascript
function formatData() {
  return data.map((item) => {
    // difficult calculations (formatting, sorting, filtering)
  });
}
const formattedData = useMemo(formatData, [data]);
```

## Optimization

### `key` attribute

- Helps optimize updating a list of elements created with `map`.
- If we add a new element at the beginning or middle of the array,
  React with `key` can match existing elements and update **only the changed** ones,
  avoiding a full re-render.

### React.lazy

- Useful when you don't want a component in the initial bundle (the compiled file with all project modules).
- Initial loading becomes faster because the bundle is smaller, but the user waits when the lazy component loads.
- Wrap such components in `React.Suspense` and provide a loader in `fallback` (the bundle is split into chunks).

### Optimizing child component re-renders

- Without PureComponent / shouldComponentUpdate / React.memo, **components re-render every time their parent re-renders, regardless of prop changes**.

```javascript
// UserName will re-render every time the button is clicked
<>
  <button onClick={() => setState((prev) => prev + 1)}>Add</button>
  <UserName name="John Doe" />
</>
```

#### PureComponent

- Extending from `PureComponent` compares new and old props and state, preventing re-renders when they match.

#### shouldComponentUpdate(nextProps, nextState)

- Provides the same optimization, but this lifecycle method allows **custom comparison logic** of props and state.

#### HOC React.memo

- Offers the same optimization for functional components and only for props.
- Prevents re-renders when props are the same.

```javascript
// won't re-render when the parent re-renders, only when props.name changes
const UserName = React.memo((props) => {
  return <div>{props.name}</div>;
});
```

- <span id="React.memo" style="color:red;font-size:25px;">!!!</span> React.memo / PureComponent perform **only a shallow comparison** (primitives and references).
- When a prop is non-primitive, wrap the data in [useMemo](#useMemo) / [useCallback](#useCallback) in addition to React.memo.
- Using these hooks preserves references to functions and objects between renders, preventing unnecessary re-renders.

```javascript
const user = useMemo(() => ({ name: "John Doe" }), []);
const handleClick = useCallback(() => setState((prev) => prev + 1), []);
return (
  <>
    <UserName user={user} />
    <button onClick={handleClick}>Add</button>
  </>
);
```

## Advanced hooks

### useLayoutEffect

- Used when you need to change styles directly in the DOM tree (`ref.current.style.border = "1px solid black"`)
- and want them applied **before paint—synchronously**, not after render as with regular useEffect

### useImperativeHandle

- Useful when a parent component needs to clear fields tied to a child's local state, for example
- Methods defined in the child are exposed via `forwardRef`, and the parent can call these methods using the reference

### useTransition

- Used when heavy re-rendering affects page responsiveness.
- It allows prioritizing state updates that affect responsiveness (text input, switching tabs, timeline input).
- And lowering priority for blocking updates (rendering filtered list results, switching tab content).

```javascript
const [input, setInput] = useState("");
const [list, setList] = useState([]);
const [isPending, startTransition] = useTransition();

function handleChange(e) {
  setInput(e.target.value); // setting priority state like usual
  startTransition(() => {
    const filteredValue = data.filter((item) => item); // some heavy filtering calculations
    setList(filteredValue); // setting less priority state inside startTransition
  });
}
```

# Important libraries related to React

## React-router-dom v6

TODO: Use the router to fetch data

## Redux

- Redux stores the state of objects in a single store
- To change the state, you dispatch an action; the action goes to a reducer, and the reducer describes how the state changes
- Changes happen only through a **pure** reducer function—immutable copies and replacements
- ACTION — plain object { type, payload }
- Methods `dispatch(action)`, `getState()`, `subscribe(listener)` belong to the store (`store.dispatch`)
- mstp selects the part of the state needed for the component and tracks changes in selected properties
- FLOW — call dispatch(action) -> reducer(current state, action) -> returns new state instance

## Redux-toolkit

- Do not use ActionCreators
- Use `ThunkCreator.fulfilled/rejected` for successful/unsuccessful cases of thunks
- Configure thunks not to dispatch the necessary AC, but to return data/rejectedWithValue(error)

## Redux-thunk

- Middleware for Redux that allows dispatching async actions (thunks)
