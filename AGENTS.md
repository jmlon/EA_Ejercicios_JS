# Examples and exercises about Data Structures and Algorithms

This is an educational set of examples and exercises in JavaScript about data structures and algorithms based on the Sedgewick "Algorithms, 4th Edition" textbook.

## General guidelines

- When implementing ADTs, always ensure proper encapsulation using private fields (`#`).
- ADTs should provide inline tests at the bottom of the module file using `node:assert/strict`. Do not use other testing frameworks. Each module's inline tests should include at least 3-5 assert statements covering normal cases, edge cases (e.g., empty structures), and error conditions.
- To test expected exceptions, use the following pattern:

  ```js
  import assert from 'node:assert/strict';

  assert.throws(
      () => { stack.pop(); }, // empty stack
      Error,
      "Should have thrown an error"
  );
  ```

- Run modules directly with Node.js: `node src/ea02_EstructurasBasicas/Stack.mjs`.
- Classes and methods should include JSDoc documentation.
- ADTs should not accept `null` or `undefined` as valid elements; throw an `Error` (or a descriptive `TypeError`/`RangeError`) if `null`/`undefined` is passed.

## Code Style and Conventions

- Follow standard JavaScript naming conventions: classes in PascalCase (e.g., `ListaSimple`), methods and variables in camelCase (e.g., `pushElement`), constants in UPPER_SNAKE_CASE.
- Use consistent indentation (4 spaces, no tabs) and adhere to a 120-character line limit for readability.
- Use ES Modules (`.mjs` extension) with `import`/`export` syntax. Organize imports alphabetically: Node.js built-in modules first (e.g., `import assert from 'node:assert/strict'`), then local modules.
- JavaScript is dynamically typed, so generics do not apply. Keep implementations simple for educational purposes; use JSDoc `@param {type}` annotations to document expected types where helpful.
- **Language policy**: folder and class names may use Spanish (e.g., `ListaSimple`, `Fecha`). Method names should use English (e.g., `addHead`, `removeHead`). JSDoc and comments may use Spanish.

## Project Structure and Dependencies

- Maintain the folder structure under `src/` (e.g., `src/ea01_ADT/`, `src/ea02_EstructurasBasicas/`) for all new modules, ensuring they align with the existing folder hierarchy.
- Avoid external npm packages unless explicitly required by an exercise; rely on Node.js built-in modules (e.g., `node:assert/strict`, `node:readline`) to keep the project self-contained and focused on core concepts.
- No build step is required. Run modules directly: `node src/<folder>/<File>.mjs`.

## Implementation Best Practices

- Prioritize efficiency and correctness in algorithms: document time/space complexity in JSDoc using the format `Time: O(n), Space: O(1)`, especially in modules like ea03_AnalisisDeAlgoritmos or ea04_MétodosDeOrdenación.
- Handle edge cases and exceptions gracefully (e.g., throw `Error`, `TypeError`, or `RangeError` for invalid inputs in ADTs like stacks/queues), but keep error handling minimal for exercise simplicity.
- Value-type ADTs (e.g., `Fecha`, `Punto2D`) should be immutable: use private `#` fields with only getters (no setters), and return defensive copies from accessors when needed. Container ADTs (e.g., `Pila`, `Cola`, `ListaSimple`) are inherently mutable but should protect internal state via private `#` fields.
- Always implement `toString()` in ADTs for debugging and educational output (used by template literals and `console.log`).
- Implement an `equals(other)` method in value-type ADTs (e.g., `Fecha`, `Punto2D`). JavaScript has no `hashCode()` equivalent, so focus on `equals()` with a clear contract: reflexive, symmetric, transitive, consistent, and null-safe (return `false` for `null`/`undefined`).
- For ADTs with a natural ordering (e.g., `Fecha`), implement `valueOf()` to enable relational operators (`<`, `>`, `<=`, `>=`), or provide a static comparator function suitable for `Array.prototype.sort()`. Provide separate comparator functions for alternate orderings (e.g., sorting by different fields).
- All collection ADTs should implement the [iterable protocol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols) by defining a `[Symbol.iterator]()` method that returns an iterator object.
- Use non-exported helper classes for internal nodes (`Nodo`) in linked data structures (defined in the module but not exported).

## Documentation and Collaboration

- Use JSDoc comments: include `@param {type}`, `@returns {type}`, and `@throws {ErrorType}` tags for all public methods, plus brief examples in `@example` blocks. For classes, add a high-level description of the ADT's purpose and invariants.
- When proposing code changes, reference relevant exercises (e.g., from [ea02_EstructurasBasicas/EXERCISES.md](ea02_EstructurasBasicas/EXERCISES.md)) and explain algorithmic choices to aid learning.
- If generating new files or features, ensure they fit the project's educational scope—focus on fundamental data structures without over-engineering.
