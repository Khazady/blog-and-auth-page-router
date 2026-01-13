---
title: "SOLID in Frontend Development"
date: "2024-05-01"
image: "patterns.png"
excerpt: "How to apply the SOLID principles to React components and frontend architecture."
isFeatured: false
---

# SOLID in Frontend Development

SOLID is a set of design principles that helps build scalable, understandable systems. They are not design patterns; instead, they describe what good architecture should look like and how React components should interact.

## Single Responsibility Principle

Each component or module should have a single reason to change, usually tied to a specific behavior slice (for example, UI presentation). Move data-fetching logic and domain rules into custom hooks or services to keep presentational components lean.

```tsx
type User = { id: string; name: string };

function UserCard({ user }: { user: User }) {
  return <h2>{user.name}</h2>;
}

function UserCardContainer({ id }: { id: string }) {
  const user = useUser(id); // custom hook encapsulates the request
  if (!user) return null;
  return <UserCard user={user} />;
}
```

`UserCard` becomes easy to test while the container stays reusable with different UI elements.

## Open/Closed Principle

Extend behavior through composition, props, or render props that are designed as extension points. For example, a `Button` may already support `icon` or `renderContent`; if it doesn't, prefer a wrapper or adapter instead of editing the base component.

## Liskov Substitution Principle

Variants or wrappers must behave like the base component. If `PrimaryButton` is a drop-in replacement for `Button`, it must preserve `onClick`, `disabled`, and their semantics; otherwise, consumers will break when swapping components.

## Interface Segregation Principle

Avoid forcing consumers to depend on unrelated props or methods. Split interfaces by intent (`<AuthForm />`, `<PasswordResetLink />`) and ship focused hooks (`useAuthForm`, `useAuthApi`) or separate contexts for state and actions instead of a single “kitchen sink” hook.

## Dependency Inversion Principle

High-level modules depend on abstractions, not concrete implementations. Provide services through context or props so tests and alternative environments can swap them easily.

```tsx
type AuthService = {
  login: (email: string, password: string) => Promise<void>;
};

const AuthContext = createContext<AuthService | null>(null);

export function useAuthService() {
  const auth = useContext(AuthContext);
  if (!auth) {
    throw new Error("AuthContext is missing");
  }
  return auth;
}

export function AuthProvider({
  service,
  children,
}: {
  service: AuthService;
  children: React.ReactNode;
}) {
  return (
    <AuthContext.Provider value={service}>{children}</AuthContext.Provider>
  );
}
```

Components can now call `const auth = useAuthService();` and work with either the real service or a test double.

## When to apply

- The project is growing and needs modular architecture.
- Multiple teams maintain the same design system or component library.
- You rely heavily on integration and component tests.

Use SOLID as a decision-making checklist: if a proposed API breaks one of the principles, reconsider the architecture or introduce an adapter layer.
