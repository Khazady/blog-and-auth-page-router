---
title: React.js
excerpt: React is the javascript library for web and native user interfaces
image: react.png
isFeatured: true
date: "2024-04-05"
---

# React

## React vs Vanilla JS:

- React code is more readable (JSX = JS + HTML in 1 file)
- Components
- JS is imperative (буквально даёшь пошаговые инструкции)
- React is declarative (описываешь что именно ты делаешь)

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

- Виртуальный DOM представляет собой упрощенные Javascript объекты по сравнению с настоящим DOM.

## Reconciliation

- Это процесс сверки старой и новой версий (снэпшота) Virtual DOM после изменения данных (например, массива, на основе которого отображаются элементы списка)
- На основе этой сверки, React производит точечные изменения в реальном DOM.
- В результате, пользователь видит обновление только измененного элемента списка, а не перерисовку всех элементов одновременно.

## Basic hooks

### useState

- it's a local state
- сравнивает предыдущее состоянии с новым и при необходимости вызывает ререндер той части UI которая от него зависит (в отличии от обычной переменной, которую мы вывели бы в JSX и изменили в event listener функции)
- correct approach to change state `setState(prev => prev + 1)`
- `useState(compute())` you can pass function to initial state param, if you need to compute initial value once, not on every render

### useRef

- можно юзать как useState, **изменение которого не вызывает rerender**
- можно как ссылку на dom element

### useContext

- Нужен для избежания **“props drilling”**, когда мы вынуждены пробрасывать стейт через пропсы каждого уровня, даже там где этот стейт не нужен
- TODO: React context vs state manager libs (Redux vs Zustand vs React-Query vs React Context)

### useCallback <span id="useCallback"></span>

1. используется в дополнение к [React.memo](#React.memo) для функций передаваемых в дочернюю компоненту,
   чтобы сохранить между ререндарами родителя ту же ссылку

### useMemo <span id="useMemo"></span>

use cases:

1. аналогично useCallback, в дополнение к [React.memo](#React.memo) но для объектов, массивов и т.д.
2. когда одно из состояний сложно вычисляется, а мы меняем другое состояние, при этом при ререндере пересчитывается сложное 1-ое

```javascript
function formatData() {
  return data.map((item) => {
    // difficult calculations (formatting, sorting, filtering)
  });
}
const formattedData = useMemo(formatData, [data]);
```

## Optimisation

### `key` attribute

- Нужен для оптимизации обновления списка элементов, созданного с помощью метода `map`.
- Если мы добавляем новый элемент в начало или середину массива,
  React с использованием `key` сможет корректно сопоставить существующие элементы и обновить **только изменённые**,
  избегая полной перерисовки всех элементов.

### React.lazy

- Нужен, когда хотим чтобы компонента не попадала в начальный бандл (собранный вебпаком файл из всех файлов проекта)
- Начальная загрузка будет быстрее (бандл меньше), но юзер будет ждать, когда воспользуется компонентом в lazy
- Такую компоненту нужно оборачивать в React.Suspect и в fallback указывать loader (бандл поделили на чанки)

### child components rerender optimization

- Без использования PureComponent / shouldComponentUpdate / React.memo, **компоненты перерисовываются каждый раз,
  когда их родитель перерисовывается, независимо от того, изменились ли их пропсы или нет**.

```javascript
// UserName will rerender every time when button clicked
<>
  <button onClick={() => setState((prev) => prev + 1)}>Add</button>
  <UserName name="John Doe" />
</>
```

#### PureComponent

- when we extend from `PureComponent`, it compares new and old props & state, preventing rerender if they are the same

#### shouldComponentUpdate(nextProps, nextState)

- does the same, but in this lifecycle method we can implement a **custom comparison logic** of props & state

#### HOC React.memo

- does the same, but for func components and only for props
- prevents rerender when props are the same

```javascript
// won't rerender when parent rerenders, only when props.name is changed
const UserName = React.memo((props) => {
  return <div>{props.name}</div>;
});
```

- <span id="React.memo" style="color:red;font-size:25px;">!!!</span> React.memo / PureComponent умеет делает **только поверхностную сверку** (примитивы и ссылки)
- Когда в пропс передан не примитивный тип данных, в дополнение к React.memo,
  такие данные нужно их обернуть в [useMemo](#useMemo) / [useCallback](#useCallback)
- Использование этих хуков сохраняет ссылки на функции и объекты между рендерами, что предотвращает ненужные перерисовки компонентов

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

- Когда нужно сделать изменение стилей напрямую DOM дереве (ref.current.style.border = “1px solid black”)
- и хотим чтобы они применились **до рендера - синхронно, а не после рендера - асинхронно, как в обычном useEffect**

### useImperativeHandle

- Когда нужно из родительской компоненты например очистить поля привязанные к локальному стейту дочерней
- Через ссылку в переданную из родителя через `forwardRef` в дочернуюю expose-ятся методы, в которых происходят действия доступные только в дочерней,
  а в родительской мы можем вызвать эти методы через ссылку

### useTransition

- Используем когда есть сложный ререндеринг влияет на отзывчивость страницы.
- С помощью него можно приоритизировать состояние которое влияет на отзывчивость (текст инпут, переключение между табами, таймлайн инпут ).
- И понизить приоритетность изменения блокирующего состояния (результат пользовательского действия: рендеринг результатов фильтрация списка по инпуту, переключение контента в табе )

```javascript
const [input, setInput] = useState("");
const [list, setList] = useState([]);
const [isPending, startTransition] = useTransition();

function handleChange(e) {
  setInput(e.target.value); // setting priority state like usually
  startTransition(() => {
    const filteredValue = data.filter((item) => item); // some difficult filtering calculations
    setList(filteredValue); // setting less priority state in startTransition
  });
}
```

# React-connected important libs

## React-router-dom V6

TODO: Через роутер можно фетчить дату

## Redux

- redux хранит state объектов в едином store
- чтобы изменить state нужно отправить action, action попадает в reducer, reducer описывает как state будет изменен
- изменения только с помощью ЧИСТОЙ функции reducer - иммутабельные, копируем и подменяем
- ACTION - plain object { type, payload }
- методы dispatch(action), getState(), subscribe(listener) принадлежит store (store.dispatch)
- mstp селектит нужный для компоненты стейт и отслеживает изменения в выбранных свойствах
- FLOW - call dispatch(action) -> reducer(current state, action) -> returns new state instance

## Redux-toolkit

- Не используем ActionCreators,
- используем ThunkCreator.fulfilled/rejected успешные/неуспешные случаи выполнения санок
- настраиваем санки не на диспатч нужного AC, а на return нужных данных/rejectedWithValue(error)

## Redux-thunk

- Middleware for the Redux, that allows to dispatch async actions (thunks)
