# **Abstract Data Types in JavaScript/TypeScript: Modern Patterns and Best Practices**

The implementation of Abstract Data Types (ADTs) in JavaScript and TypeScript represents a unique challenge in the landscape of programming languages. Unlike Java's interface-based system or Python's ABC module, JavaScript's dynamic nature and TypeScript's structural type system provide alternative pathways for defining contracts. This document synthesizes contemporary best practices for ADT implementation across both languages, emphasizing the principles of encapsulation, immutability, and compositional architecture that have become standard in 2026.

## **1. Core Best Practices for Implementing ADTs**

The modern standard for defining an ADT in JavaScript/TypeScript is to use a combination of **class-based structures**, **interfaces or type aliases**, and **structural typing** to define behavior and ensure type safety. The philosophy mirrors Java's interface-contract pattern while accommodating JavaScript's dynamic capabilities.

### **1.1 Prefer Interfaces and Abstract Classes over Concrete Classes**

In TypeScript, interfaces serve as explicit contracts that multiple implementations can satisfy. This approach decouples the definition of an ADT's behavior from its implementation, enabling polymorphism and testability.

```typescript
// ADT Contract: The Interface
interface Stack<T> {
  push(value: T): void;
  pop(): T | undefined;
  peek(): T | undefined;
  isEmpty(): boolean;
  size(): number;
}

// Implementation 1: Array-backed stack
class ArrayStack<T> implements Stack<T> {
  private items: T[] = [];

  push(value: T): void {
    this.items.push(value);
  }

  pop(): T | undefined {
    return this.items.pop();
  }

  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  size(): number {
    return this.items.length;
  }
}

// Implementation 2: Linked-list-backed stack
class LinkedListStack<T> implements Stack<T> {
  private head: Node<T> | null = null;
  private _size: number = 0;

  push(value: T): void {
    this.head = { value, next: this.head };
    this._size++;
  }

  pop(): T | undefined {
    if (!this.head) return undefined;
    const value = this.head.value;
    this.head = this.head.next;
    this._size--;
    return value;
  }

  peek(): T | undefined {
    return this.head?.value;
  }

  isEmpty(): boolean {
    return this._size === 0;
  }

  size(): number {
    return this._size;
  }
}

interface Node<T> {
  value: T;
  next: Node<T> | null;
}
```

**Key Principles:**
- Define the contract using an interface (not a concrete class).
- Multiple implementations can satisfy the same interface.
- Clients depend on the interface, not the concrete class.
- This allows swapping implementations without changing client code.

### **1.2 Use Generics for Type Safety and Reusability**

Generics ensure that ADTs are type-safe while remaining general-purpose. TypeScript's generic system closely mirrors Java's, providing compile-time type checking and preventing runtime type errors.

```typescript
// Generic ADT: A Queue implementation
interface Queue<T> {
  enqueue(value: T): void;
  dequeue(): T | undefined;
  front(): T | undefined;
  isEmpty(): boolean;
  size(): number;
}

class CircularQueue<T> implements Queue<T> {
  private items: (T | undefined)[];
  private front_index: number = 0;
  private rear_index: number = -1;
  private _size: number = 0;
  private capacity: number;

  constructor(capacity: number = 10) {
    this.capacity = capacity;
    this.items = new Array(capacity);
  }

  enqueue(value: T): void {
    if (this._size === this.capacity) {
      throw new Error("Queue overflow");
    }
    this.rear_index = (this.rear_index + 1) % this.capacity;
    this.items[this.rear_index] = value;
    this._size++;
  }

  dequeue(): T | undefined {
    if (this.isEmpty()) return undefined;
    const value = this.items[this.front_index];
    this.items[this.front_index] = undefined;
    this.front_index = (this.front_index + 1) % this.capacity;
    this._size--;
    return value;
  }

  front(): T | undefined {
    return this.isEmpty() ? undefined : this.items[this.front_index];
  }

  isEmpty(): boolean {
    return this._size === 0;
  }

  size(): number {
    return this._size;
  }
}
```

**Generic Constraints:**
TypeScript supports generic constraints, allowing you to restrict what types can be used:

```typescript
// Only accept types that have a comparison method
interface Comparable<T> {
  compareTo(other: T): number;
}

class BinarySearchTree<T extends Comparable<T>> {
  // Implementation details...
}
```

### **1.3 Immutability by Default**

Immutable data structures prevent side effects and make code easier to reason about. TypeScript's `readonly` keyword and functional patterns enable immutable-by-design ADTs.

```typescript
// Immutable Linked List ADT
interface LinkedListNode<T> {
  readonly value: T;
  readonly next: LinkedListNode<T> | null;
}

interface ImmutableList<T> {
  readonly head: LinkedListNode<T> | null;
  readonly length: number;
  append(value: T): ImmutableList<T>;
  prepend(value: T): ImmutableList<T>;
  map<U>(fn: (value: T) => U): ImmutableList<U>;
  filter(predicate: (value: T) => boolean): ImmutableList<T>;
}

class LinkedList<T> implements ImmutableList<T> {
  readonly head: LinkedListNode<T> | null;
  readonly length: number;

  constructor(head: LinkedListNode<T> | null = null, length: number = 0) {
    this.head = head;
    this.length = length;
  }

  // Returns a NEW list, does not mutate
  append(value: T): ImmutableList<T> {
    const newNode: LinkedListNode<T> = { value, next: null };
    if (!this.head) {
      return new LinkedList(newNode, 1);
    }
    // Copy the list and append
    return this.prependToTail(newNode);
  }

  prepend(value: T): ImmutableList<T> {
    return new LinkedList({ value, next: this.head }, this.length + 1);
  }

  map<U>(fn: (value: T) => U): ImmutableList<U> {
    let current = this.head;
    let newHead: LinkedListNode<U> | null = null;
    let newTail: LinkedListNode<U> | null = null;

    while (current) {
      const newNode: LinkedListNode<U> = { value: fn(current.value), next: null };
      if (!newHead) {
        newHead = newNode;
      } else {
        newTail!.next = newNode;
      }
      newTail = newNode;
      current = current.next;
    }

    return new LinkedList(newHead, this.length);
  }

  filter(predicate: (value: T) => boolean): ImmutableList<T> {
    // Implementation: traverse and construct a new list
    let newHead: LinkedListNode<T> | null = null;
    let newTail: LinkedListNode<T> | null = null;
    let count = 0;
    let current = this.head;

    while (current) {
      if (predicate(current.value)) {
        const newNode: LinkedListNode<T> = { value: current.value, next: null };
        if (!newHead) {
          newHead = newNode;
        } else {
          newTail!.next = newNode;
        }
        newTail = newNode;
        count++;
      }
      current = current.next;
    }

    return new LinkedList(newHead, count);
  }

  private prependToTail(newNode: LinkedListNode<T>): ImmutableList<T> {
    let current = this.head;
    let result: LinkedListNode<T> | null = null;
    let tail: LinkedListNode<T> | null = null;

    while (current) {
      const copy: LinkedListNode<T> = { value: current.value, next: null };
      if (!result) {
        result = copy;
      } else {
        tail!.next = copy;
      }
      tail = copy;
      current = current.next;
    }

    if (tail) {
      tail.next = newNode;
    } else {
      result = newNode;
    }

    return new LinkedList(result, this.length + 1);
  }
}
```

---

## **2. ADTs in Collections and Data Structures**

Collections are the foundational ADTs in computer science. When implementing custom collections in JavaScript/TypeScript, adherence to standard patterns ensures compatibility with the broader ecosystem and predictable performance characteristics.

### **2.1 Designing Collection Interfaces**

A well-designed collection ADT separates the concerns of creation, access, and mutation:

```typescript
// Read-only collection interface
interface ReadOnlyCollection<T> {
  readonly size: number;
  isEmpty(): boolean;
  contains(value: T): boolean;
  toArray(): T[];
}

// Mutable collection interface
interface MutableCollection<T> extends ReadOnlyCollection<T> {
  add(value: T): boolean;
  remove(value: T): boolean;
  clear(): void;
}

// Specialized: Set ADT
interface Set<T> extends MutableCollection<T> {
  union(other: Set<T>): Set<T>;
  intersection(other: Set<T>): Set<T>;
  difference(other: Set<T>): Set<T>;
}

// Specialized: Map ADT
interface Map<K, V> extends MutableCollection<[K, V]> {
  get(key: K): V | undefined;
  set(key: K, value: V): void;
  has(key: K): boolean;
  keys(): Iterable<K>;
  values(): Iterable<V>;
  entries(): Iterable<[K, V]>;
}
```

### **2.2 Implementing Iterators and Iterables**

JavaScript's iteration protocol (Symbol.iterator) mirrors Java's Iterable and Iterator interfaces. ADT implementations should support standard iteration mechanisms:

```typescript
// Iterator ADT
interface Iterator<T> {
  next(): IteratorResult<T>;
  return?(): IteratorResult<T>;
  throw?(error: any): IteratorResult<T>;
}

interface IteratorResult<T> {
  done: boolean;
  value?: T;
}

// Iterable ADT
interface Iterable<T> {
  [Symbol.iterator](): Iterator<T>;
}

// Example: Implementing a HashSet with proper iteration
class HashSet<T> implements Set<T>, Iterable<T> {
  private items: Map<T, boolean> = new Map();

  add(value: T): boolean {
    if (this.items.has(value)) return false;
    this.items.set(value, true);
    return true;
  }

  remove(value: T): boolean {
    return this.items.delete(value);
  }

  has(value: T): boolean {
    return this.items.has(value);
  }

  contains(value: T): boolean {
    return this.has(value);
  }

  get size(): number {
    return this.items.size;
  }

  isEmpty(): boolean {
    return this.items.size === 0;
  }

  clear(): void {
    this.items.clear();
  }

  toArray(): T[] {
    return Array.from(this.items.keys());
  }

  union(other: Set<T>): Set<T> {
    const result = new HashSet<T>();
    for (const item of this.items.keys()) {
      result.add(item);
    }
    for (const item of other.toArray()) {
      result.add(item);
    }
    return result;
  }

  intersection(other: Set<T>): Set<T> {
    const result = new HashSet<T>();
    for (const item of this.items.keys()) {
      if (other.contains(item)) {
        result.add(item);
      }
    }
    return result;
  }

  difference(other: Set<T>): Set<T> {
    const result = new HashSet<T>();
    for (const item of this.items.keys()) {
      if (!other.contains(item)) {
        result.add(item);
      }
    }
    return result;
  }

  // Enable for...of loops
  [Symbol.iterator](): Iterator<T> {
    return this.items.keys() as any;
  }
}

// Usage
const set = new HashSet<number>();
set.add(1);
set.add(2);
set.add(3);

for (const item of set) {
  console.log(item); // 1, 2, 3
}
```

---

## **3. Data Transfer Objects (DTOs) and Exchange Patterns**

DTOs are ADTs designed to transfer data between system boundaries. In distributed systems, they serve as contracts for REST APIs, BFF layers, and message queues.

### **3.1 REST-based Web Services**

In REST, the DTO is the contract between client and server. TypeScript interfaces and classes should enforce validation and serialization:

```typescript
// REST API Response DTO
interface UserResponse {
  readonly id: string;
  readonly username: string;
  readonly email: string;
  readonly createdAt: Date;
}

// Factory function for safe construction
function createUserResponse(data: unknown): UserResponse {
  if (typeof data !== 'object' || data === null) {
    throw new Error('Invalid user data');
  }

  const obj = data as Record<string, unknown>;

  if (typeof obj.id !== 'string') {
    throw new Error('Invalid id: must be a string');
  }
  if (typeof obj.username !== 'string' || obj.username.length === 0) {
    throw new Error('Invalid username: must be a non-empty string');
  }
  if (typeof obj.email !== 'string' || !isValidEmail(obj.email)) {
    throw new Error('Invalid email format');
  }

  return {
    id: obj.id,
    username: obj.username,
    email: obj.email,
    createdAt: new Date(obj.createdAt as string),
  };
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Client code: fetch and parse
async function fetchUser(userId: string): Promise<UserResponse> {
  const response = await fetch(`/api/users/${userId}`);
  const data = await response.json();
  return createUserResponse(data); // Validation happens here
}
```

### **3.2 Backend-for-Frontend (BFF) Systems**

In a BFF, multiple microservices are aggregated into a single response optimized for a specific frontend. TypeScript's type system enables safe composition:

```typescript
// Domain DTOs from different microservices
interface UserService_UserDTO {
  id: string;
  name: string;
  email: string;
}

interface ProductService_ProductDTO {
  id: string;
  title: string;
  price: number;
}

interface OrderService_OrderDTO {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  createdAt: Date;
}

// BFF Response: Unified view optimized for the mobile app
interface MobileOrderResponse {
  readonly orderId: string;
  readonly customerName: string;
  readonly customerEmail: string;
  readonly productTitle: string;
  readonly unitPrice: number;
  readonly totalPrice: number;
  readonly orderDate: string;
  readonly status: OrderStatus;
}

enum OrderStatus {
  Pending = 'PENDING',
  Shipped = 'SHIPPED',
  Delivered = 'DELIVERED',
}

// BFF Aggregator
class MobileOrderAggregator {
  async fetchOrderDetails(orderId: string): Promise<MobileOrderResponse> {
    // Fetch from multiple services in parallel
    const [order, user, product] = await Promise.all([
      this.orderService.getOrder(orderId),
      this.userService.getUser(userId), // obtained from order
      this.productService.getProduct(productId), // obtained from order
    ]);

    // Transform and combine into BFF response
    return {
      orderId: order.id,
      customerName: user.name,
      customerEmail: user.email,
      productTitle: product.title,
      unitPrice: product.price,
      totalPrice: product.price * order.quantity,
      orderDate: order.createdAt.toISOString(),
      status: this.mapOrderStatus(order.status),
    };
  }

  private mapOrderStatus(serviceStatus: string): OrderStatus {
    // Map from service-specific status to BFF status
    const statusMap: Record<string, OrderStatus> = {
      'pending': OrderStatus.Pending,
      'shipped': OrderStatus.Shipped,
      'delivered': OrderStatus.Delivered,
    };
    return statusMap[serviceStatus] ?? OrderStatus.Pending;
  }
}
```

### **3.3 Message Queues (RabbitMQ, Kafka, AWS SQS)**

Message queues deal with serialized data streams. ADTs must ensure type safety and handle deserialization correctly:

```typescript
// Message Contract ADT
interface MessageEnvelope<T> {
  readonly messageId: string;
  readonly correlationId: string;
  readonly timestamp: Date;
  readonly payload: T;
  readonly headers: Record<string, string>;
}

// Event ADT (immutable)
interface UserCreatedEvent {
  readonly userId: string;
  readonly username: string;
  readonly email: string;
  readonly createdAt: Date;
}

// Message envelope factory with validation
function createMessageEnvelope<T>(
  payload: T,
  messageId: string = generateMessageId(),
  correlationId: string = generateCorrelationId()
): MessageEnvelope<T> {
  return {
    messageId,
    correlationId,
    timestamp: new Date(),
    payload,
    headers: {
      'content-type': 'application/json',
      'message-id': messageId,
      'correlation-id': correlationId,
    },
  };
}

// Serialization
function serializeMessage<T>(envelope: MessageEnvelope<T>): string {
  return JSON.stringify({
    messageId: envelope.messageId,
    correlationId: envelope.correlationId,
    timestamp: envelope.timestamp.toISOString(),
    payload: envelope.payload,
    headers: envelope.headers,
  });
}

// Deserialization with validation
function deserializeMessage<T>(json: string): MessageEnvelope<T> {
  const data = JSON.parse(json);

  if (!data.messageId || typeof data.messageId !== 'string') {
    throw new Error('Invalid messageId');
  }
  if (!data.correlationId || typeof data.correlationId !== 'string') {
    throw new Error('Invalid correlationId');
  }
  if (!data.timestamp) {
    throw new Error('Invalid timestamp');
  }

  return {
    messageId: data.messageId,
    correlationId: data.correlationId,
    timestamp: new Date(data.timestamp),
    payload: data.payload as T,
    headers: data.headers ?? {},
  };
}

// Producer
class UserEventProducer {
  async publishUserCreated(user: { id: string; username: string; email: string }): Promise<void> {
    const event: UserCreatedEvent = {
      userId: user.id,
      username: user.username,
      email: user.email,
      createdAt: new Date(),
    };

    const envelope = createMessageEnvelope(event);
    const serialized = serializeMessage(envelope);

    await this.messageQueue.publish('user.created', serialized);
  }
}

// Consumer
class UserEventConsumer {
  async handleUserCreated(message: string): Promise<void> {
    try {
      const envelope = deserializeMessage<UserCreatedEvent>(message);
      const event = envelope.payload;

      // Process the event
      console.log(`User created: ${event.username} (${event.userId})`);

      // Acknowledge the message only after successful processing
      await this.markAsProcessed(envelope.messageId);
    } catch (error) {
      console.error('Failed to process message:', error);
      throw error; // Requeue or send to dead-letter queue
    }
  }
}
```

---

## **4. Encapsulation and Information Hiding**

Encapsulation in JavaScript/TypeScript relies on private fields (introduced in ES2022), closures, and TypeScript's visibility modifiers.

### **4.1 Using Private Fields and Properties**

```typescript
// Private fields (ES2022 standard)
class BankAccount {
  #balance: number; // Private field
  readonly #accountNumber: string; // Private readonly field

  constructor(initialBalance: number, accountNumber: string) {
    if (initialBalance < 0) {
      throw new Error('Initial balance cannot be negative');
    }
    this.#balance = initialBalance;
    this.#accountNumber = accountNumber;
  }

  // Public behavior, not data
  deposit(amount: number): void {
    if (amount <= 0) {
      throw new Error('Deposit amount must be positive');
    }
    this.#balance += amount;
  }

  withdraw(amount: number): void {
    if (amount <= 0) {
      throw new Error('Withdrawal amount must be positive');
    }
    if (amount > this.#balance) {
      throw new Error('Insufficient funds');
    }
    this.#balance -= amount;
  }

  // Query method, not a getter for internal data
  getBalance(): number {
    return this.#balance;
  }

  // Encapsulated invariant check
  private canWithdraw(amount: number): boolean {
    return amount > 0 && amount <= this.#balance;
  }
}
```

### **4.2 Closure-Based Encapsulation**

For scenarios where ES2022 private fields are not available or when using plain JavaScript, closures provide strong encapsulation:

```typescript
// Factory function with closure-based encapsulation
function createStack<T>(): Stack<T> {
  // Private state (not accessible from outside)
  const items: T[] = [];

  // Public interface
  return {
    push(value: T): void {
      items.push(value);
    },

    pop(): T | undefined {
      return items.pop();
    },

    peek(): T | undefined {
      return items[items.length - 1];
    },

    isEmpty(): boolean {
      return items.length === 0;
    },

    size(): number {
      return items.length;
    },

    // Note: Serialization is controlled
    toArray(): T[] {
      return [...items]; // Return a copy, not the original
    },
  };
}
```

### **4.3 Protecting Exposed State**

Never return direct references to mutable internal objects. Always return copies or defensive views:

```typescript
class Graph<T> {
  private nodes: Map<string, T[]> = new Map();

  // WRONG: Returns direct reference
  // getNeighbors(nodeId: string): T[] {
  //   return this.nodes.get(nodeId)!; // Client can mutate!
  // }

  // CORRECT: Returns a copy
  getNeighbors(nodeId: string): T[] {
    const neighbors = this.nodes.get(nodeId);
    return neighbors ? [...neighbors] : [];
  }

  // ALSO CORRECT: Returns a readonly view
  getNeighborsReadonly(nodeId: string): ReadonlyArray<T> {
    return this.nodes.get(nodeId) ?? [];
  }

  // Add edges with validation
  addEdge(from: string, to: T): void {
    if (!this.nodes.has(from)) {
      throw new Error(`Node ${from} does not exist`);
    }
    const neighbors = this.nodes.get(from)!;
    if (!neighbors.includes(to)) {
      neighbors.push(to);
    }
  }
}
```

---

## **5. Asynchronous and Iterator-Based ADTs**

Modern JavaScript/TypeScript applications frequently deal with asynchronous data sources. ADTs should support both synchronous and asynchronous traversal patterns.

### **5.1 Async Iterators and Iterables**

```typescript
// Async Iterator protocol
interface AsyncIterator<T> {
  next(): Promise<IteratorResult<T>>;
  return?(): Promise<IteratorResult<T>>;
  throw?(error: any): Promise<IteratorResult<T>>;
}

interface AsyncIterable<T> {
  [Symbol.asyncIterator](): AsyncIterator<T>;
}

// Example: Async Generator (simplifies async iterator implementation)
async function* fetchPagesOfData<T>(
  pageSize: number,
  totalItems: number,
  fetcher: (page: number) => Promise<T[]>
): AsyncIterable<T> {
  let page = 0;
  let fetched = 0;

  while (fetched < totalItems) {
    const items = await fetcher(page);
    for (const item of items) {
      yield item;
      fetched++;
      if (fetched >= totalItems) break;
    }
    page++;
  }
}

// Consumer
async function processLargeDataset(): Promise<void> {
  const fetcher = async (page: number) => {
    // Simulated API call
    return fetch(`/api/items?page=${page}`).then(r => r.json());
  };

  for await (const item of fetchPagesOfData(100, 10000, fetcher)) {
    console.log('Processing item:', item);
  }
}
```

### **5.2 Lazy Evaluation and Streaming**

```typescript
// Lazy stream ADT
interface LazySequence<T> extends Iterable<T> {
  map<U>(fn: (value: T) => U): LazySequence<U>;
  filter(predicate: (value: T) => boolean): LazySequence<T>;
  take(n: number): LazySequence<T>;
  toArray(): T[];
}

class LazyList<T> implements LazySequence<T> {
  private source: Iterable<T>;

  constructor(source: Iterable<T>) {
    this.source = source;
  }

  map<U>(fn: (value: T) => U): LazySequence<U> {
    const source = this.source;
    return new LazyList(
      (function* () {
        for (const item of source) {
          yield fn(item);
        }
      })()
    );
  }

  filter(predicate: (value: T) => boolean): LazySequence<T> {
    const source = this.source;
    return new LazyList(
      (function* () {
        for (const item of source) {
          if (predicate(item)) {
            yield item;
          }
        }
      })()
    );
  }

  take(n: number): LazySequence<T> {
    const source = this.source;
    return new LazyList(
      (function* () {
        let count = 0;
        for (const item of source) {
          if (count >= n) break;
          yield item;
          count++;
        }
      })()
    );
  }

  toArray(): T[] {
    return Array.from(this.source);
  }

  [Symbol.iterator](): Iterator<T> {
    return this.source[Symbol.iterator]();
  }
}

// Usage: Lazy evaluation—computation happens only when needed
const numbers = new LazyList([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
const result = numbers
  .filter(n => n % 2 === 0)
  .map(n => n * 2)
  .take(3)
  .toArray();

console.log(result); // [4, 8, 12]
// Only 3 elements were actually transformed, not all 10
```

---

## **6. Concurrency and Thread Safety**

JavaScript's single-threaded event loop simplifies concurrency concerns compared to Java or C#, but asynchronous patterns introduce new challenges for ADT designers.

### **6.1 Immutability as a Concurrency Strategy**

```typescript
// Immutable LinkedList—safe for concurrent access
class ImmutableLinkedList<T> implements Iterable<T> {
  private readonly head: Node<T> | null;
  private readonly _length: number;

  constructor(head: Node<T> | null = null, length: number = 0) {
    this.head = head;
    this._length = length;
  }

  get length(): number {
    return this._length;
  }

  // Returns a new list
  prepend(value: T): ImmutableLinkedList<T> {
    return new ImmutableLinkedList({ value, next: this.head }, this._length + 1);
  }

  // Returns a new list
  tail(): ImmutableLinkedList<T> {
    return this.head?.next
      ? new ImmutableLinkedList(this.head.next, this._length - 1)
      : new ImmutableLinkedList();
  }

  get head_value(): T | undefined {
    return this.head?.value;
  }

  [Symbol.iterator](): Iterator<T> {
    let current = this.head;
    return {
      next: () => {
        if (!current) {
          return { done: true, value: undefined };
        }
        const value = current.value;
        current = current.next;
        return { done: false, value };
      },
    };
  }
}

interface Node<T> {
  readonly value: T;
  readonly next: Node<T> | null;
}

// Multiple coroutines/async tasks can safely share the same list
async function processListConcurrently(list: ImmutableLinkedList<number>) {
  const promises = [
    (async () => {
      for (const val of list) {
        console.log('Task 1:', val);
      }
    })(),
    (async () => {
      for (const val of list) {
        console.log('Task 2:', val);
      }
    })(),
  ];

  await Promise.all(promises);
}
```

### **6.2 Controlled Mutability with Change Notifications**

```typescript
// Observable pattern for controlled mutations
type Observer<T> = (change: Change<T>) => void;

interface Change<T> {
  type: 'add' | 'remove' | 'update';
  element: T;
}

class ObservableSet<T> {
  private items: Set<T> = new Set();
  private observers: Observer<T>[] = [];

  subscribe(observer: Observer<T>): () => void {
    this.observers.push(observer);
    // Unsubscribe function
    return () => {
      this.observers = this.observers.filter(o => o !== observer);
    };
  }

  add(value: T): boolean {
    if (this.items.has(value)) return false;

    this.items.add(value);
    this.notifyObservers({ type: 'add', element: value });
    return true;
  }

  remove(value: T): boolean {
    if (!this.items.has(value)) return false;

    this.items.delete(value);
    this.notifyObservers({ type: 'remove', element: value });
    return true;
  }

  private notifyObservers(change: Change<T>): void {
    for (const observer of this.observers) {
      observer(change);
    }
  }

  toArray(): T[] {
    return Array.from(this.items);
  }
}

// Usage
const set = new ObservableSet<string>();

const unsubscribe = set.subscribe((change) => {
  console.log(`Set changed: ${change.type} - ${change.element}`);
});

set.add('apple');
set.add('banana');
set.remove('apple');

unsubscribe(); // Stop listening
```

---

## **7. Design Guidelines for Reusable ADT Libraries**

When creating ADT libraries intended for public consumption, several architectural principles ensure consistency and usability.

### **7.1 Choosing the Correct Abstraction**

```typescript
// Parameter type: Accept the most general interface
function sumValues<T extends number | bigint>(
  values: Iterable<T>
): T {
  let sum = 0 as any;
  for (const val of values) {
    sum += val;
  }
  return sum;
}

// Works with arrays, sets, custom iterables
sumValues([1, 2, 3]);
sumValues(new Set([1, 2, 3]));

// Return type: Provide a specific interface for navigation
interface List<T> {
  readonly length: number;
  get(index: number): T;
  [Symbol.iterator](): Iterator<T>;
}

class ArrayList<T> implements List<T> {
  // Implementation
}

// Clients can call methods on the returned List
function getTopScores(allScores: Iterable<number>, limit: number): List<number> {
  // Aggregate and return as a specific List
  const sorted = Array.from(allScores).sort((a, b) => b - a);
  // ... wrap in ArrayList
  return new ArrayList(sorted.slice(0, limit));
}
```

### **7.2 Composition over Inheritance**

Inheritance exposes implementation details to subclasses, breaking encapsulation. Composition provides better flexibility:

```typescript
// AVOID: Deep inheritance hierarchy
// class TreeNode { ... }
// class BinaryTreeNode extends TreeNode { ... }
// class AVLTreeNode extends BinaryTreeNode { ... }

// PREFER: Composition
interface TreeNodeBehavior<T> {
  balance(): void;
  rotate(): void;
}

class AVLTree<T> {
  private balancer: AVLBalancer<T>; // Composition
  private root: TreeNode<T> | null = null;

  insert(value: T): void {
    this.root = this._insert(this.root, value);
    this.balancer.balance(this.root);
  }

  private _insert(node: TreeNode<T> | null, value: T): TreeNode<T> {
    if (!node) return { value, left: null, right: null };
    // ... recursive insertion
    return node;
  }
}

interface TreeNode<T> {
  value: T;
  left: TreeNode<T> | null;
  right: TreeNode<T> | null;
}

class AVLBalancer<T> {
  balance(node: TreeNode<T> | null): void {
    // Balancing logic
  }
}
```

### **7.3 Immutability and Sealed Types**

In TypeScript, use `as const` and `readonly` to signal immutable types:

```typescript
// Immutable type definitions
const colors = {
  red: '#FF0000',
  green: '#00FF00',
  blue: '#0000FF',
} as const;

type Color = typeof colors[keyof typeof colors];

// Sealed type: Cannot be extended
type Point = {
  readonly x: number;
  readonly y: number;
} & { readonly __brand: 'Point' };

function createPoint(x: number, y: number): Point {
  return { x, y, __brand: 'Point' };
}

// Type safety: Cannot accidentally create invalid Point
const p = { x: 1, y: 2 }; // Not a Point
// const p2: Point = { x: 1, y: 2 }; // Compile error
const p3: Point = createPoint(1, 2); // Correct
```

---

## **8. Performance Optimization and Complexity Analysis**

ADT designers must be aware of the performance characteristics of their implementations and document them clearly.

### **8.1 Time and Space Complexity Documentation**

```typescript
/**
 * LinkedList ADT
 *
 * Operations and their complexities:
 * - prepend(value): O(1) - Constant time
 * - append(value): O(n) - Linear time (must traverse to tail)
 * - removeAt(index): O(n) - Linear time (must traverse to index)
 * - get(index): O(n) - Linear time (must traverse to index)
 * - size(): O(1) - Constant time (if cached)
 *
 * Space Complexity: O(n) where n is the number of elements
 */
class LinkedList<T> {
  // Implementation...
}

/**
 * ArrayList ADT
 *
 * Operations and their complexities:
 * - append(value): O(1) amortized - Constant amortized time
 * - removeAt(index): O(n) - Linear time (must shift elements)
 * - get(index): O(1) - Constant time (direct array access)
 * - size(): O(1) - Constant time
 *
 * Space Complexity: O(n) where n is the number of elements
 */
class ArrayList<T> {
  // Implementation...
}
```

### **8.2 Memory-Efficient Implementations**

```typescript
// Object pooling for frequently allocated objects
class ObjectPool<T> {
  private available: T[] = [];
  private factory: () => T;
  private reset: (obj: T) => void;

  constructor(
    factory: () => T,
    reset: (obj: T) => void,
    initialSize: number = 10
  ) {
    this.factory = factory;
    this.reset = reset;

    for (let i = 0; i < initialSize; i++) {
      this.available.push(factory());
    }
  }

  acquire(): T {
    return this.available.pop() || this.factory();
  }

  release(obj: T): void {
    this.reset(obj);
    this.available.push(obj);
  }
}

// Usage
interface Vector2 {
  x: number;
  y: number;
}

const vectorPool = new ObjectPool<Vector2>(
  () => ({ x: 0, y: 0 }),
  (v) => {
    v.x = 0;
    v.y = 0;
  }
);

// In performance-critical code
const vec = vectorPool.acquire();
vec.x = 10;
vec.y = 20;
// ... use vec ...
vectorPool.release(vec); // Return to pool
```

---

## **9. Common Pitfalls and Best Practices Summary**

### **Pitfalls:**

1. **Leaking Mutable References**: Returning direct references to internal collections or objects.
2. **Multiple Enumeration Overhead**: Reusing the same iterator without recreating it.
3. **Serialization Bypasses**: Not validating deserialized data; assuming JSON is trustworthy.
4. **Poor Encapsulation**: Exposing internal implementation details through public properties.
5. **Side Effects in Iterators**: Modifying shared state during traversal.
6. **Incorrect Generic Constraints**: Allowing invalid types to be used with generic ADTs.

### **Best Practices:**

1. **Encapsulate state** using private fields and only expose necessary behavior.
2. **Validate inputs** at all boundaries, especially for public methods.
3. **Prefer immutability** by default; require explicit mutable variants when necessary.
4. **Document complexity** clearly, including time and space requirements.
5. **Use descriptive names** that reflect domain concepts, not implementation details.
6. **Follow the Interface Segregation Principle**: Depend on minimal interfaces.
7. **Test invariants** rigorously to ensure ADTs maintain their contracts.
8. **Consider performance** without sacrificing correctness or readability.

---

## **Conclusion**

The implementation of Abstract Data Types in JavaScript/TypeScript has evolved into a sophisticated discipline that balances the language's dynamic nature with TypeScript's powerful type system. By adopting the patterns and principles outlined in this guide—deriving from proven architectures in Java, Python, and C#—developers can create ADTs that are type-safe, efficient, maintainable, and ready for integration into modern distributed systems. The key is to view ADTs not merely as data containers but as behavioral abstractions that enforce invariants and provide clear contracts to their consumers.

