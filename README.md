# Sorted Set

Sometimes you have an array that needs to be sorted after each push and pop.
However doing something like this can be taxing on resources:

```js
// Not in order!
for (const value of set) { /* ... */ }

// Can be slow for large sets!
for (const value of [...set].sort()) { /* ... */ }
```

This module provides an API to an array that provides a similar api as the
builtin javascript `Set`, but can be iterated in order for much less overhead
than sorting an array.

```js
const set = new SortedSet((a, b) => a - b)

set.add(3) // { 3 }
set.add(1) // { 1, 3 }
set.add(5) // { 1, 3, 5 }
set.add(2) // { 1, 2, 3, 5 }
set.add(2) // { 1, 2, 3, 5 }

console.log([...set]) // [1, 2, 3, 5]
console.log(arr.get(1)) // 2 the value that would be at index 1
console.log(arr.bisect(3)) // 2 the index that 3 would be inserted to
```

## Usage

Check out [the docs]()!