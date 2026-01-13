---
title: "SOLID во фронтенд-разработке"
date: "2024-05-01"
image: "patterns.png"
excerpt: "Как применять принципы SOLID в React и фронтенд-архитектуре."
isFeatured: false
---

# SOLID во фронтенд-разработке

SOLID — это набор принципов проектирования, который помогает строить масштабируемые и понятные системы. Они не описывают конкретные паттерны, но подсказывают, каким требованиям должна удовлетворять архитектура фронтенда и отдельные React-компоненты.

## Single Responsibility Principle

Компонент или модуль отвечает за одну причину изменения — за конкретный аспект поведения (например, за представление UI). Логику работы с данными и доменные правила удобно выносить в кастомные хуки или сервисы, а UI оставлять максимально «чистым».

```tsx
type User = { id: string; name: string };

function UserCard({ user }: { user: User }) {
  return <h2>{user.name}</h2>;
}

function UserCardContainer({ id }: { id: string }) {
  const user = useUser(id); // кастомный хук инкапсулирует запрос
  if (!user) return null;
  return <UserCard user={user} />;
}
```

Так компонент `UserCard` легко тестировать, а контейнер можно переиспользовать вместе с другими UI-компонентами.

## Open/Closed Principle

Поведение расширяем через композицию, пропсы и рендер-пропы, которые заранее предусмотрены как точки расширения. Например, `Button` может поддерживать `icon` или `renderContent`; если этого нет, добавляйте обертку или адаптер вместо правки базового компонента.

## Liskov Substitution Principle

Вариант или обертка ведут себя так же, как базовый компонент. Если `PrimaryButton` можно подставить вместо `Button`, он обязан поддерживать `onClick`, `disabled` и их семантику. Иначе заменяемость нарушится и вызовет баги у потребителей.

## Interface Segregation Principle

Дайте потребителю только то, что ему нужно. Если API раздувается, разделите его: вместо одного `useAuth` с десятками методов сделайте `useAuthForm` и `useAuthApi`, или вынесите состояние и действия в отдельные контексты. Тогда компонент не тащит лишние зависимости.

## Dependency Inversion Principle

Компоненты не зависят от конкретного источника данных. Они знают только контракт (например, `MarketDataService`), а реализацию получают через пропсы или контекст. Источник можно поменять без правок UI (REST, WebSocket, мок для тестов) — UI не должен знать, кто именно отдает котировки.

```tsx
type Quote = { symbol: string; price: number };

type MarketDataService = {
  getQuote: (symbol: string) => Promise<Quote>;
};

const MarketDataContext = createContext<MarketDataService | null>(null);

export function useMarketData() {
  const service = useContext(MarketDataContext);
  if (!service) {
    throw new Error("MarketDataContext is missing");
  }
  return service;
}

export function MarketDataProvider({
  service,
  children,
}: {
  service: MarketDataService;
  children: React.ReactNode;
}) {
  return (
    <MarketDataContext.Provider value={service}>
      {children}
    </MarketDataContext.Provider>
  );
}
```

Теперь компонент использует `const marketData = useMarketData();` и ему все равно, откуда приходят котировки.

## Когда применять

- Проект растет и требует модульности.
- Несколько команд развивают один и тот же UI-kit.
- Нужно часто писать интеграционные и компонентные тесты.

SOLID служит фильтром для технических решений: если новое API плохо вписывается в эти принципы, стоит пересмотреть архитектуру или выделить дополнительный слой абстракции.
