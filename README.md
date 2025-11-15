# Habit Tracker & Reward System

## Running the code

Run `npm i` to install the dependencies.

Run `npm run dev` to start the development server.

1.integrate active habits api - done
2.integrate view habit api - done
3.integrate log habit api - done
4.make UI elements responsive
5.Adding favicon and title 6. View rewards page 7. Local component loader 8. Guard at routing 9. placeholders

---

Remained task -

1. check flow of authentication
2. Custom days feature
3. Showing errors in create habit form
4. removing placeholder from create reward

---

## 🧩 1. What is `JSX.Element`?

### 🧠 Simple definition:

`JSX.Element` is the **TypeScript type** that represents something you can _render_ in React —
basically, the return type of a React component that uses JSX.

So whenever you write:

```tsx
return <div>Hello</div>;
```

TypeScript treats that `<div>` as a **`JSX.Element`**.

---

### ✅ Example:

```tsx
function Dashboard(): JSX.Element {
  return <h1>Welcome to Dashboard</h1>;
}
```

Here:

- `Dashboard` returns a **JSX element** (something React can render to the DOM).
- TypeScript uses `JSX.Element` to ensure the function returns valid JSX, not just plain data or string.

---

### ✅ Typical usage:

We use it in **auth redirects**, **logout redirects**, or any scenario where the user shouldn’t go back to the previous route.

```tsx
if (!isAuth) {
  return <Navigate to="/login" replace />;
}
```

---

## 🧩 Summary Table

| Concept                | Meaning                                                   | Example                            |
| ---------------------- | --------------------------------------------------------- | ---------------------------------- |
| `JSX.Element`          | TypeScript type for a React element                       | `children: JSX.Element`            |
| Why use it             | Ensures only valid React components/elements are passed   | Prevents wrong prop types          |
| `<Navigate replace />` | Replaces current history entry (prevents back navigation) | `<Navigate to="/login" replace />` |
| Without `replace`      | Adds new history entry (user can go back)                 | Not good for auth redirects        |

---

## ✅ TL;DR

- **`JSX.Element`** → A renderable React element (type-safe way to represent components in TS).
- **`replace` in `<Navigate>`** → Prevents users from going back to the previous route after redirection (common in login/logout flows).

---
