# Sorted Set

Sometimes you have an array that needs to be sorted after each push and pop.
However doing something like this can be taxing on resources:

```js
// Not good if arr is large!
arr.push(value)
arr.sort()
```

This module provides an API to an array that provides a similar api as the
builtin javascript array, but is guaranteed to be sorted after any modification.

```
const arr = new SortedArray((a, b) => a - b)

arr.insert(3)
arr.insert(1)
arr.insert(5)
arr.insert(2)

console.log([...arr]) // [1, 2, 3, 5]
console.log(arr[1]) // 2
console.log(arr.indexOf(3)) // 2

```

