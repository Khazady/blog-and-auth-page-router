---
title: React.js
excerpt: React is a JavaScript library for web and native user interfaces
image: react.png
isFeatured: true
date: "2024-04-05"
---

# React

## React and plain JavaScript

- React code is more readable (JSX = JS + HTML in one file)
- Components
- JS is imperative (you literally give step-by-step instructions)
- React is declarative (you describe what you want to get)

```javascript
// Imperative approach
const element = document.createElement("p");
element.textContent = "example";
element.className = "styles";
element.addEventListener("click", function () {});
// Declarative
<p className="styles" onClick={function () {}}>
  example
</p>;
```

## Virtual DOM

- The virtual DOM is a set of simplified JavaScript objects compared to the real DOM.

## Reconciliation

- The process of comparing old and new versions (snapshots) of the virtual DOM after data changes (for example, an array used to render a list).
- Based on this comparison, React makes targeted changes to the real DOM.
- As a result, the user sees only the updated list item rather than the entire list being re-rendered.

## Basic hooks

### useState

- Local state.
- Compares previous values with new ones and, when necessary, re-renders the parts of the UI that depend on it (unlike a regular variable rendered in JSX and changed in an event handler).
- Correct state update: `setState(prev => prev + 1)`
- `useState(() => compute())` — pass a function as the initial value to compute it once instead of on every render.

### useRef

- Can be used like useState, but **changing it does not trigger a re-render**.
- Can also store a reference to a DOM element.

### useContext

- Needed to avoid **props drilling**, when state has to be passed through props at every level even where it isn’t needed.
- Suitable for small global state; for complex scenarios use state managers (Redux, Zustand, React Query, etc.)

### useCallback <span id="useCallback"></span>

1. Used with [React.memo](#React.memo) for functions passed to a child component so the same reference is kept between parent renders.

### useMemo <span id="useMemo"></span>

Use cases:

1. Similar to useCallback, in addition to [React.memo](#React.memo), but for objects, arrays, etc.
2. When one piece of state is expensive to compute and we change another state, on re-render the expensive state is recomputed again.

```javascript
function formatData() {
  return data.map((item) => {
    // complex computations (formatting, sorting, filtering)
  });
}
const formattedData = useMemo(formatData, [data]);
```

## Optimization

### `key` attribute

- Needed to optimize updating a list of elements created with `map`.
- If we add a new element at the start or middle of the array,
  React with `key` can correctly match existing elements and update **only the changed ones**,
  avoiding a full re-render of all elements.
- It's not recommended to use an array index if the list is dynamic (removing an element from the middle would be seen as removing the last element, and React would treat the rest as changed).

### React.lazy

- Useful when we don't want a component to go into the initial bundle (the file built from all project files).
- The initial load will be faster (smaller bundle), but the user will wait for the component to load.
- Such a component should be wrapped in `React.Suspense` and a loader specified in `fallback` (the bundle is split into chunks).

### Profiler

- Component for measuring render time.
- Wrap part of the tree in `<Profiler id="name" onRender={callback}>`.
- Detailed analysis is available in the **Profiler** tab in React DevTools.

### Optimizing child component re-renders

- Without PureComponent / shouldComponentUpdate / React.memo **components re-render every time the parent re-renders regardless of prop changes.**

```javascript
// UserName will re-render every time the button is clicked
<>
  <button onClick={() => setState((prev) => prev + 1)}>Add</button>
  <UserName name="John Doe" />
</>
```

#### PureComponent

- Extending from `PureComponent` compares new and old props and state, preventing re-renders when they are the same.

#### shouldComponentUpdate(nextProps, nextState)

- Provides the same optimization, but this lifecycle method allows **custom comparison logic** for props and state.

#### HOC React.memo

- Offers the same optimization for functional components and only for props.
- Prevents re-renders when props remain the same.

```javascript
// will not re-render when the parent renders, only when props.name changes
const UserName = React.memo((props) => {
  return <div>{props.name}</div>;
});
```

- <span id="React.memo" style="color:red;font-size:25px;">!!!</span> React.memo / PureComponent do **only a shallow comparison** (primitives and references).
- When a non-primitive type is passed via props, in addition to React.memo
  wrap the data in [useMemo](#useMemo) / [useCallback](#useCallback).
- Using these hooks preserves references to functions and objects between renders, preventing extra re-renders.

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

- Used when you need to directly modify styles in the DOM tree (`ref.current.style.border = "1px solid black"`)
- and you want them applied **before paint—synchronously**, not after render like with regular useEffect.

### useImperativeHandle

- Useful when, from the parent component, you need to clear fields tied to the child's local state, for example.
- Through `forwardRef`, the child exposes methods available only inside it, and the parent can call them via the ref.

### useTransition

- Used when heavy re-rendering impacts page responsiveness.
- It helps prioritize states that affect responsiveness (text input, switching tabs, timeline).
- And lower the priority of state that blocks the UI (rendering filtered list results, switching tab content).

```javascript
const [input, setInput] = useState("");
const [list, setList] = useState([]);
const [isPending, startTransition] = useTransition();

function handleChange(e) {
  setInput(e.target.value); // set high-priority state
  startTransition(() => {
    const filteredValue = data.filter((item) => item); // heavy filtering calculations
    setList(filteredValue); // lower-priority state inside startTransition
  });
}
```

## What React doesn't include out of the box

- Routing (React Router, Next.js)
- Global state (Redux, MobX, Zustand)
- Data fetching and caching (fetch/axios, React Query, SWR)
- Form management (React Hook Form, Formik)
- i18n and localization (react-i18next)

## Techniques in React

### Portals

- Allow rendering a child component outside the parent's DOM hierarchy.
- Used for modals, tooltips, and pop-up menus.
- Works via `ReactDOM.createPortal(children, container)`.

```javascript
const portalTargetElement = document.getElementById("portal-root");
return ReactDOM.createPortal(
  <div className="modal">Hello!</div>,
  portalTargetElement,
);
```

### Error Boundary

- Implemented only with class components (`componentDidCatch` and `getDerivedStateFromError`).

# Important libraries related to React

## React-router-dom v6

- Core components and hooks: `<BrowserRouter>`, `<Routes>` and `<Route>`, `useNavigate`, `useParams`, `useLocation`
- Supports dynamic routes (`/user/:id`).
- In versions 6.4+ the router can load data via `loader` and submit via `action`.

## Redux

- Redux stores the state of objects in a single store
- To change the state, you send an action; the action goes to a reducer, which describes how the state changes
- Changes happen only through a **pure** reducer function—copies are created and swapped
- ACTION — plain object { type, payload }
- Methods `dispatch(action)`, `getState()`, `subscribe(listener)` belong to the store (`store.dispatch`)
- mstp selects the part of the state needed for a component and tracks changes in the selected properties
- FLOW — dispatch(action) -> reducer(current state, action) -> new state instance is returned

## Redux-toolkit

- No ActionCreators
- Use `ThunkCreator.fulfilled/rejected` for successful/unsuccessful thunk cases
- Configure thunks not to dispatch a specific AC but to return data/rejectedWithValue(error)

## Redux-thunk

- Middleware for Redux that allows dispatching asynchronous functions (thunks)
- A thunk is a particular case of an HOF (deferred computation)
- Dispatch can accept not only an action object but also a function `(dispatch, getState) => {}`
- This allows making async requests (fetch/axios) and dispatching the result as a regular action.

## React-query

- Allows caching requests on the client.
- Automatically retries requests on failure or when the network is restored.
- Removes the need to manually write loading/error/success states.

## MobX

- State manager based on `observable` values
- Components react to changes automatically; less boilerplate compared to Redux
- OOP style (observables, store classes, mutable state)
