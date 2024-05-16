---
title: React.js
excerpt: React is the javascript library for web and native user interfaces
image: react.png
isFeatured: true
date: "2024-04-05"
---
# React
## React vs Vanilla JS:

* React code is more readable (JSX = JS + HTML in 1 file)
* Components
* JS is imperative (буквально даёшь пошаговые инструкции)
* React is declarative (описываешь что именно ты делаешь)
```javascript
// Напр. в JS
const element = document.createElement('p');
element.appendText = 'example';
element.className = 'styles';
element.addEventListener('click', function(){} );
// В React.js
<p className='styles' onClick={function(){}}>example</p>
```

## Optimisation
* List here usual ways
  React 18
* List react 18 optimisation features here


## Advanced hooks
### useLayoutEffect
* Когда нужно сделать изменение стилей напрямую DOM дереве (ref.current.style.border = “1px solid black”)
* и хотим чтобы они применились **до рендера - синхронно, а не после рендера - асинхронно, как в обычном useEffect**

### useImperativeHandle
* Когда нужно из родительской компоненты например очистить поля привязанные к локальному стейту дочерней
* Через ссылку в переданную из родителя через `forwardRef` в дочернуюю expose-ятся методы, в которых происходят действия доступные только в дочерней,
а в родительской мы можем вызвать эти методы через ссылку


### useTransition
* Используем когда есть сложный ререндеринг влияет на отзывчивость страницы. 
* С помощью него можно приоритизировать состояние которое влияет на отзывчивость (текст инпут, переключение между табами, таймлайн инпут ).
* И понизить приоритетность изменения блокирующего состояния (результат пользовательского действия: рендеринг результатов фильтрация списка по инпуту, переключение контента в табе )
```javascript
const [input, setInput] = useState('')
const [list, setList] = useState([])
const [isPending, startTransition] = useTransition();

function handleChange (e) {
	setInput(e.target.value) // setting priority state like usually
	startTransition(() => {
        const filteredValue = data.filter(item => item) // some difficult filtering calculations
        setList(filteredValue) // setting less priority state in startTransition
	})
}
```

# React-connected important libs

## React-router-dom V6
Через роутер можно фетчить дату


