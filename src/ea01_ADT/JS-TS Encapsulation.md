# Encapsulation in JavaScript and TypeScript: Best Practices and Implementation

## Introduction

Encapsulation—the bundling of data and methods that operate on that data while hiding implementation details—is a cornerstone of object-oriented design. In JavaScript and TypeScript, encapsulation presents unique challenges and opportunities. JavaScript's dynamic nature and lack of traditional access modifiers required developers to rely on closures and naming conventions for decades. TypeScript introduces compile-time visibility controls and interfaces, elevating encapsulation to a more structured practice.

This guide explores encapsulation techniques across both languages, from foundational principles to advanced patterns used in production systems.

---

## Core Principles of Good Encapsulation

### 1. Minimize Visibility (Information Hiding)

In JavaScript and TypeScript, the goal is to expose only what clients *need*, hiding internal representation details.

#### JavaScript Approaches

**Closures and Module Pattern (Pre-ES6)**
```javascript
function createCounter() {
  let count = 0; // Private variable enclosed in closure
  
  return {
    increment() {
      count++;
    },
    getCount() {
      return count;
    }
  };
}

const counter = createCounter();
counter.increment();
console.log(counter.getCount()); // 1
// counter.count is undefined—the variable is truly private
```

**Private Fields (ES2022+)**
```javascript
class BankAccount {
  #balance = 0; // Private field with # notation
  
  deposit(amount) {
    if (amount <= 0) throw new Error("Invalid amount");
    this.#balance += amount;
  }
  
  getBalance() {
    return this.#balance;
  }
}

const account = new BankAccount();
account.deposit(100);
// account.#balance // SyntaxError: private field '#balance' must be declared
```

#### TypeScript Approaches

**Access Modifiers**
```typescript
class User {
  private id: string;           // Only accessible within the class
  protected name: string;       // Accessible in subclasses
  public email: string;         // Publicly accessible
  
  constructor(id: string, name: string, email: string) {
    this.id = id;
    this.name = name;
    this.email = email;
  }
  
  private generateToken(): string {
    return `token-${this.id}`;
  }
  
  protected getFullName(): string {
    return this.name.toUpperCase();
  }
}

const user = new User("1", "John", "john@example.com");
// user.id // Error: Property 'id' is private
// user.generateToken() // Error: Property 'generateToken' is private
```

**Private Fields with TypeScript**
```typescript
class SecureData {
  #secret: string;
  
  constructor(secret: string) {
    this.#secret = secret;
  }
  
  reveal(): string {
    return this.#secret;
  }
}

const data = new SecureData("password123");
// data.#secret // Compile error + Runtime error
```

**Rationale:** Reducing visibility limits coupling between classes and prevents external code from depending on internal representation details. This allows you to refactor the internal implementation without breaking client code.

---

### 2. Maintain Class Invariants at All Times

An invariant is a condition that must always be true for an object to be in a valid state. Encapsulation ensures that these invariants are preserved through all operations.

```typescript
class Rectangle {
  private width: number;
  private height: number;
  
  constructor(width: number, height: number) {
    if (width <= 0 || height <= 0) {
      throw new Error("Width and height must be positive");
    }
    this.width = width;
    this.height = height;
  }
  
  // Invariant: width and height are always positive
  setWidth(newWidth: number) {
    if (newWidth <= 0) {
      throw new Error("Width must be positive");
    }
    this.width = newWidth;
  }
  
  setHeight(newHeight: number) {
    if (newHeight <= 0) {
      throw new Error("Height must be positive");
    }
    this.height = newHeight;
  }
  
  getArea(): number {
    return this.width * this.height; // Invariant guarantees valid result
  }
}
```

**Rationale:** By validating in constructors and all mutating methods, the object is always usable and predictable. Invariants form the contract that the class makes with its clients.

---

### 3. Prefer Immutability When Feasible

Immutable objects are inherently encapsulated: once created, they cannot be violated. They are thread-safe, cacheable, and easier to reason about.

#### TypeScript Approach with `readonly`

```typescript
class Point {
  readonly x: number;
  readonly y: number;
  
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  
  // Methods return new instances instead of mutating
  translate(dx: number, dy: number): Point {
    return new Point(this.x + dx, this.y + dy);
  }
}

const p1 = new Point(0, 0);
const p2 = p1.translate(5, 5);
// p1.x = 10; // Error: Cannot assign to 'x' because it is a read-only property
```

#### Using `as const` for Immutable Objects

```typescript
const CONFIG = {
  apiUrl: "https://api.example.com",
  timeout: 5000,
  retries: 3
} as const; // Entire object is readonly

// CONFIG.apiUrl = "new url"; // Error: Cannot assign to 'apiUrl'
```

#### Record Types (TypeScript)

```typescript
interface ImmutableUser {
  readonly id: string;
  readonly name: string;
  readonly email: string;
}

const user: ImmutableUser = {
  id: "1",
  name: "Alice",
  email: "alice@example.com"
};

// user.name = "Bob"; // Error: Cannot assign to readonly property
```

**Rationale:** Immutable objects eliminate entire classes of bugs related to unexpected state changes. They are also inherently thread-safe in concurrent environments.

---

## Practical Design Guidelines

### 4. Avoid "Anemic" Getters and Setters

Do not blindly expose internal data through getters and setters. Instead, expose *behavior* that reflects your domain.

#### ❌ Poor Design

```typescript
class Account {
  private balance: number = 0;
  
  getBalance(): number {
    return this.balance;
  }
  
  setBalance(amount: number): void {
    this.balance = amount; // No validation or business logic
  }
}

// Client code becomes responsible for business logic
const account = new Account();
account.setBalance(-100); // Object in invalid state!
```

#### ✅ Good Design

```typescript
class Account {
  private balance: number = 0;
  private transactionHistory: string[] = [];
  
  deposit(amount: number): void {
    if (amount <= 0) {
      throw new Error("Deposit amount must be positive");
    }
    this.balance += amount;
    this.transactionHistory.push(`Deposit: +${amount}`);
  }
  
  withdraw(amount: number): void {
    if (amount <= 0) {
      throw new Error("Withdrawal amount must be positive");
    }
    if (amount > this.balance) {
      throw new Error("Insufficient funds");
    }
    this.balance -= amount;
    this.transactionHistory.push(`Withdrawal: -${amount}`);
  }
  
  getBalance(): number {
    return this.balance;
  }
  
  getTransactionHistory(): ReadonlyArray<string> {
    return [...this.transactionHistory]; // Return copy to prevent mutation
  }
}

// Invariants are maintained by domain methods
const account = new Account();
account.deposit(100);
account.withdraw(50);
// account.setBalance(-100); // This method doesn't exist
```

**Rationale:** Domain-specific methods encode business logic and protect invariants. They make the code self-documenting and prevent invalid states.

---

### 5. Validate Inputs at the Boundary

Always validate parameters *before* mutating state. Fail fast with meaningful error messages.

```typescript
class Email {
  private value: string;
  
  constructor(email: string) {
    const trimmed = email.trim();
    
    if (!this.isValidEmail(trimmed)) {
      throw new Error(`Invalid email format: "${email}"`);
    }
    
    this.value = trimmed.toLowerCase();
  }
  
  private isValidEmail(email: string): boolean {
    // Simple validation; in production, use a robust pattern or library
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
  
  getValue(): string {
    return this.value;
  }
}

try {
  const email = new Email("  invalid-email  ");
} catch (error) {
  console.error(error.message); // "Invalid email format: ..."
}
```

**Rationale:** Validation at entry points (constructors, public methods) prevents the object from entering invalid states. This is the first line of defense for encapsulation.

---

### 6. Control Mutability of Exposed State

Never return direct references to mutable internal objects. Use defensive copies or read-only views.

#### ❌ Leaking Mutable State

```typescript
class TodoList {
  private todos: Todo[] = [];
  
  getTodos(): Todo[] {
    return this.todos; // Mistake: direct reference!
  }
}

const list = new TodoList();
const todos = list.getTodos();
todos.push(new Todo("hack the code")); // Modifies internal state!
```

#### ✅ Protecting Internal State

```typescript
class TodoList {
  private todos: Todo[] = [];
  
  // Return a copy
  getTodos(): Todo[] {
    return [...this.todos];
  }
  
  // Or return a readonly view (TypeScript)
  getTodosReadonly(): ReadonlyArray<Todo> {
    return this.todos;
  }
  
  // Or use Object.freeze (JavaScript)
  getTodosFrozen(): Todo[] {
    return Object.freeze([...this.todos]);
  }
  
  // Provide controlled mutation methods
  addTodo(todo: Todo): void {
    if (!todo) throw new Error("Todo cannot be null");
    this.todos.push(todo);
  }
  
  removeTodo(id: string): boolean {
    const index = this.todos.findIndex(t => t.id === id);
    if (index >= 0) {
      this.todos.splice(index, 1);
      return true;
    }
    return false;
  }
}
```

**Rationale:** Returning direct references to mutable objects breaks encapsulation. The caller can modify the internal state without the object's knowledge, violating invariants.

---

### 7. Separate Internal Representation from Public API

The public interface should not reveal data structures, storage formats, or optimization choices. Internal implementation should be changeable without breaking clients.

```typescript
// Internal representation hidden
class UserRepository {
  // Could be switched to a database, cache, or API without affecting clients
  private users: Map<string, User> = new Map();
  
  findById(id: string): User | null {
    return this.users.get(id) ?? null;
  }
  
  save(user: User): void {
    this.users.set(user.id, user);
  }
  
  getAll(): User[] {
    return Array.from(this.users.values());
  }
}

// Clients depend on the stable interface, not the implementation
const repo = new UserRepository();
const user = repo.findById("123");
```

**Rationale:** By hiding internal representation, you can refactor and optimize without affecting client code. This is essential for maintainability in large systems.

---

### 8. Use Constructors and Factories Intentionally

Prefer constructors or factory methods that enforce invariants. Avoid "empty" constructors followed by setters.

#### ❌ Weak Initialization

```typescript
class Order {
  items: OrderItem[] = [];
  customerId: string = "";
  total: number = 0;
}

// Client can create an invalid order
const order = new Order();
// order is in an incomplete state
```

#### ✅ Strong Initialization

```typescript
class Order {
  private customerId: string;
  private items: OrderItem[];
  private total: number;
  
  constructor(customerId: string, items: OrderItem[]) {
    if (!customerId) throw new Error("Customer ID required");
    if (!items || items.length === 0) throw new Error("Order must have items");
    
    this.customerId = customerId;
    this.items = [...items];
    this.total = this.calculateTotal();
  }
  
  private calculateTotal(): number {
    return this.items.reduce((sum, item) => sum + item.price, 0);
  }
  
  static fromJSON(json: any): Order {
    // Named factory method clarifies creation path
    return new Order(json.customerId, json.items);
  }
}

// Object is always valid
const order = new Order("cust-123", [item1, item2]);
// const invalid = new Order("", []); // Throws immediately
```

**Rationale:** Strong constructors and factory methods prevent partially-initialized objects. The object is either fully constructed or an exception is thrown.

---

### 9. Encapsulate Variation and Change

Isolate code that is likely to change behind stable interfaces. Hide conditional logic and configuration inside the class.

```typescript
// Strategy pattern: encapsulate variation
interface PaymentProcessor {
  process(amount: number): Promise<boolean>;
}

class CreditCardProcessor implements PaymentProcessor {
  async process(amount: number): Promise<boolean> {
    // Implementation details hidden
    return true;
  }
}

class PayPalProcessor implements PaymentProcessor {
  async process(amount: number): Promise<boolean> {
    // Different implementation, same interface
    return true;
  }
}

class Checkout {
  private processor: PaymentProcessor;
  
  constructor(processor: PaymentProcessor) {
    this.processor = processor;
  }
  
  async pay(amount: number): Promise<boolean> {
    // Doesn't know or care how payment is processed
    return this.processor.process(amount);
  }
}

// Easy to change payment methods without modifying Checkout
const checkout = new Checkout(new CreditCardProcessor());
// Or later: new Checkout(new PayPalProcessor())
```

**Rationale:** Encapsulating variation makes the code flexible and maintainable. Changes to one implementation don't ripple through the rest of the system.

---

### 10. Respect Encapsulation Across Module Boundaries

Encapsulation is not just per-class; it extends to modules and packages. Expose only a minimal public API at the module level.

#### ❌ Over-Exposed Module

```typescript
// math-utils.ts
export class InternalCalculator {
  private cache = new Map();
  
  compute(x: number): number {
    // Implementation
    return x * 2;
  }
}

export function basicAdd(a: number, b: number): number {
  return a + b;
}

// client.ts
import { InternalCalculator, basicAdd } from "./math-utils";
// Clients can access internal details
```

#### ✅ Well-Encapsulated Module

```typescript
// math-utils.ts (internal implementation)
class InternalCalculator {
  private cache = new Map();
  
  compute(x: number): number {
    return x * 2;
  }
}

const calculator = new InternalCalculator();

// Only export the public interface
export function compute(x: number): number {
  return calculator.compute(x);
}

export function add(a: number, b: number): number {
  return a + b;
}

// client.ts
import { compute, add } from "./math-utils";
// Clients can only see the public API; InternalCalculator is hidden
```

**Rationale:** Module-level encapsulation prevents clients from depending on implementation details, making the module safe to refactor.

---

### 11. Follow the Law of Demeter (Tell, Don't Ask)

An object should only communicate with its *immediate collaborators*, not reach through them to access internal state.

#### ❌ Violating Law of Demeter

```typescript
class Order {
  customer: Customer; // Public access (bad)
}

class Customer {
  address: Address; // Public access (bad)
}

class Address {
  city: string; // Public access (bad)
}

// Client reaches through multiple objects
function printShippingCity(order: Order): string {
  return order.customer.address.city; // Deep coupling!
}

// If Address structure changes, this breaks
```

#### ✅ Following Law of Demeter

```typescript
class Address {
  private city: string;
  
  getCity(): string {
    return this.city;
  }
}

class Customer {
  private address: Address;
  
  getShippingCity(): string {
    return this.address.getCity();
  }
}

class Order {
  private customer: Customer;
  
  getShippingCity(): string {
    return this.customer.getShippingCity();
  }
}

// Client asks the order, not through its dependencies
function printShippingCity(order: Order): string {
  return order.getShippingCity();
}
```

**Rationale:** The Law of Demeter reduces coupling between objects. If `Address` changes, only `Customer` needs to adapt; the client is unaffected.

---

### 12. Favor Composition Over Inheritance for Reuse

Inheritance exposes the parent's implementation details to subclasses (through `protected` members), weakening encapsulation. Composition keeps objects self-contained.

#### ❌ Inheritance Breaks Encapsulation

```typescript
class Animal {
  protected energy: number = 100;
  
  protected sleep(): void {
    this.energy = 100;
  }
}

class Dog extends Animal {
  bark(): void {
    this.energy -= 10; // Directly accesses parent's protected field
    console.log("Woof!");
  }
  
  // If parent changes 'energy' to 'vitality', this breaks silently
}
```

#### ✅ Composition Maintains Encapsulation

```typescript
interface EnergyManager {
  deplete(amount: number): void;
  restore(): void;
  getLevel(): number;
}

class AnimalEnergyManager implements EnergyManager {
  private energy: number = 100;
  
  deplete(amount: number): void {
    this.energy = Math.max(0, this.energy - amount);
  }
  
  restore(): void {
    this.energy = 100;
  }
  
  getLevel(): number {
    return this.energy;
  }
}

class Dog {
  private energyManager: EnergyManager;
  
  constructor(energyManager: EnergyManager) {
    this.energyManager = energyManager;
  }
  
  bark(): void {
    this.energyManager.deplete(10);
    console.log("Woof!");
  }
}

// Composition: Dog delegates to EnergyManager
const dog = new Dog(new AnimalEnergyManager());
```

**Rationale:** Composition maintains encapsulation boundaries between classes. Changes to one class don't silently break another through inherited state.

---

## Advanced Considerations

### 13. Avoid Exposing Internal State for "Convenience"

Debugging, logging, or testing should not justify breaking encapsulation.

#### ❌ Over-Exposed for Debugging

```typescript
class Database {
  // Exposed "for debugging"
  public internalConnections: any[] = [];
  
  query(sql: string): any {
    // ...
  }
}

// Testing code might tempt accessing internals
const db = new Database();
db.internalConnections.length; // BAD
```

#### ✅ Proper Inspection APIs

```typescript
class Database {
  private internalConnections: any[] = [];
  
  query(sql: string): any {
    // ...
  }
  
  // Provide controlled inspection methods
  getConnectionCount(): number {
    return this.internalConnections.length;
  }
  
  getConnectionStatus(index: number): string {
    if (index < 0 || index >= this.internalConnections.length) {
      throw new Error("Invalid connection index");
    }
    return this.internalConnections[index].status;
  }
}

// Testing and debugging use these controlled methods
const db = new Database();
console.log(db.getConnectionCount()); // GOOD
```

**Rationale:** Inspection methods are part of the public contract and remain stable. Direct field access creates undocumented dependencies.

---

### 14. Document Invariants and Contracts

Clearly document class invariants, preconditions, and postconditions. Use JSDoc/TSDoc and assertions.

```typescript
/**
 * Represents a monetary amount with a specific currency.
 * 
 * Invariants:
 * - amount >= 0
 * - currency is a valid ISO 4217 code (e.g., "USD")
 */
class Money {
  private amount: number;
  private currency: string;
  
  /**
   * Creates a Money instance.
   * 
   * @param amount Non-negative number
   * @param currency ISO 4217 currency code
   * @throws {Error} If amount is negative or currency is invalid
   */
  constructor(amount: number, currency: string) {
    if (amount < 0) {
      throw new Error("Amount cannot be negative");
    }
    if (!this.isValidCurrency(currency)) {
      throw new Error(`Invalid currency: ${currency}`);
    }
    
    this.amount = amount;
    this.currency = currency;
  }
  
  /**
   * Adds another Money instance to this one.
   * 
   * @param other Money to add (must be same currency)
   * @returns New Money instance (invariant preserved)
   * @throws {Error} If currencies don't match
   */
  add(other: Money): Money {
    if (this.currency !== other.currency) {
      throw new Error("Cannot add different currencies");
    }
    return new Money(this.amount + other.amount, this.currency);
  }
  
  private isValidCurrency(code: string): boolean {
    return /^[A-Z]{3}$/.test(code);
  }
}
```

**Rationale:** Documentation makes contracts explicit, helping maintainers understand what the class promises and what it requires.

---

### 15. Align Encapsulation with the Domain Model

Encapsulation should reflect *domain rules*, not just technical constraints. Business rules belong inside the object they govern.

```typescript
/**
 * A user's shopping cart, representing shopping domain rules.
 */
class ShoppingCart {
  private items: CartItem[] = [];
  private readonly maxItems = 100;
  
  addItem(product: Product, quantity: number): void {
    // Domain rule: validate quantity
    if (quantity <= 0) {
      throw new Error("Quantity must be at least 1");
    }
    
    // Domain rule: enforce cart size limit
    if (this.items.length >= this.maxItems) {
      throw new Error("Cart is full");
    }
    
    // Domain rule: duplicate items increase quantity
    const existing = this.items.find(item => item.product.id === product.id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      this.items.push({ product, quantity });
    }
  }
  
  calculateTotal(): number {
    return this.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  }
  
  // Domain rule: only cart itself decides when to clear
  clearForCheckout(): CartItem[] {
    const itemsSnapshot = [...this.items];
    this.items = [];
    return itemsSnapshot;
  }
}

// Domain logic is encapsulated; clients don't manage business rules
const cart = new ShoppingCart();
cart.addItem(laptop, 1);
const total = cart.calculateTotal();
```

**Rationale:** When encapsulation aligns with the domain, the code becomes a reflection of business requirements, making it easier to understand and maintain.

---

### 16. Be Aware of Serialization and Reflection Bypasses

Serialization (JSON, binary) and reflection (proxies, Object.getOwnPropertyNames) can expose or reconstruct private state, bypassing constructors and validation.

#### Mitigation Strategies

**Custom JSON Serialization (TypeScript)**
```typescript
class SecureUser {
  private password: string;
  private apiKey: string;
  
  constructor(public readonly id: string, private email: string, password: string) {
    this.password = this.hashPassword(password);
    this.apiKey = this.generateApiKey();
  }
  
  // Control what gets serialized
  toJSON() {
    return {
      id: this.id,
      email: this.email
      // password and apiKey are excluded
    };
  }
  
  static fromJSON(json: any): SecureUser {
    // Validate and reconstruct through constructor
    return new SecureUser(json.id, json.email, json.password);
  }
  
  private hashPassword(pwd: string): string {
    // Hash implementation
    return `hashed-${pwd}`;
  }
  
  private generateApiKey(): string {
    return `key-${Math.random()}`;
  }
}

// Serialization respects encapsulation
const user = new SecureUser("1", "user@example.com", "secret");
console.log(JSON.stringify(user)); // { id: "1", email: "user@example.com" }
```

**Protecting Against Reflection (JavaScript)**
```javascript
class ProtectedData {
  #secret = "hidden";
  
  reveal() {
    return this.#secret;
  }
}

const data = new ProtectedData();

// Reflection cannot access private fields
Object.getOwnPropertyNames(data); // []
Object.getOwnPropertySymbols(data); // [Symbol(#secret)]

// But you cannot directly read the private field
// data.#secret // Syntax error at parse time

// Object.freeze prevents dynamic property addition
const frozen = Object.freeze(new ProtectedData());
// frozen.newProperty = "x"; // Error in strict mode
```

**Rationale:** Serialization and reflection are legitimate bypass paths. Design with them in mind: control JSON output, validate on deserialization, and use strict mode to catch reflection attacks.

---

## Practical Patterns and Examples

### Pattern 1: The Module Pattern (Closure-Based Encapsulation)

```typescript
const createCounter = (): { increment: () => void; getCount: () => number } => {
  let count = 0; // Truly private
  
  return {
    increment() {
      count++;
    },
    getCount() {
      return count;
    }
  };
};

const counter1 = createCounter();
const counter2 = createCounter();

counter1.increment();
counter1.increment();
console.log(counter1.getCount()); // 2
console.log(counter2.getCount()); // 0 (separate closure)
```

### Pattern 2: The Revealing Module Pattern

```typescript
const UserRepository = (() => {
  const users: Map<string, User> = new Map();
  
  // Private methods
  const validateUser = (user: User): boolean => {
    return user.id && user.email;
  };
  
  const notifyObservers = (event: string): void => {
    console.log(`Event: ${event}`);
  };
  
  // Public API (revealed)
  return {
    add(user: User): void {
      if (!validateUser(user)) throw new Error("Invalid user");
      users.set(user.id, user);
      notifyObservers("user-added");
    },
    
    getById(id: string): User | undefined {
      return users.get(id);
    },
    
    getAll(): User[] {
      return Array.from(users.values());
    }
  };
})();

UserRepository.add(new User("1", "john@example.com"));
// UserRepository.validateUser() // Error: not exposed
```

### Pattern 3: The Proxy Pattern for Access Control

```typescript
class DatabaseConnection {
  private connected = false;
  
  connect(): void {
    this.connected = true;
    console.log("Connected");
  }
  
  query(sql: string): any {
    if (!this.connected) {
      throw new Error("Not connected");
    }
    return { /* results */ };
  }
}

// Proxy controls access
const createSecureConnection = (db: DatabaseConnection, password: string) => {
  const correctPassword = "admin123";
  let attempts = 0;
  
  return new Proxy(db, {
    get(target, prop) {
      if (prop === "query") {
        if (attempts > 3) throw new Error("Too many attempts");
        return function(sql: string) {
          attempts++;
          return target.query(sql);
        };
      }
      return Reflect.get(target, prop);
    }
  });
};
```

---

## Summary Table: Access Modifiers and Visibility

| Mechanism | JavaScript | TypeScript | Visibility | Use Case |
| --- | --- | --- | --- | --- |
| **Private Fields** | `#field` (ES2022+) | `#field` / `private` | Truly private at runtime | Core implementation details |
| **Protected** | Not available | `protected` | Subclasses and declarations in same file | Shared behavior in inheritance hierarchies |
| **Public** | Default (all fields) | `public` (default) | Globally visible | Stable public API |
| **Module Privacy** | Closure / `export` scope | `export` / `private` | Module-level | Hide internal utilities and classes |
| **Readonly** | Frozen objects | `readonly` | Read-only property | Immutable configuration and constants |
| **Getters/Setters** | `get`/`set` keywords | `get`/`set` keywords | Logic-wrapped properties | Computed properties, validation on write |

---

## Best Practices Checklist

- [ ] All data is private or read-only by default
- [ ] Public methods reflect domain behavior, not just data access
- [ ] Constructors fully initialize objects into a valid state
- [ ] Invariants are enforced in every method that mutates state
- [ ] Returned collections and objects are defensive copies or read-only views
- [ ] No direct leakage of mutable internal objects
- [ ] Documentation clearly states invariants and contracts
- [ ] Business rules are encoded inside objects, not delegated to clients
- [ ] Internal representation can change without affecting the public API
- [ ] Serialization is controlled; deserialization validates
- [ ] The Law of Demeter is followed; coupling is minimized
- [ ] Composition is favored over inheritance for reuse

---

## Conclusion

Encapsulation in JavaScript and TypeScript is a sophisticated practice that combines language features (private fields, access modifiers, closures) with design discipline (invariants, domain logic, controlled mutation). While JavaScript's dynamic nature once made encapsulation optional, modern JavaScript and TypeScript now provide powerful tools to enforce it. The principles outlined in this guide—minimizing visibility, maintaining invariants, avoiding anemic getters/setters, and aligning encapsulation with the domain—remain universal across all object-oriented languages and are essential for building maintainable, robust systems.
