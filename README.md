# Sorted Array

Sometimes you have an array that needs to be sorted after each push and pop.
However doing something like this can be taxing on resources.:

```js
// Not good!
arr.push(value)
arr.sort()
```

This module provides an API to an array that provides a similar api as the
builtin javascript array, but is guaranteed to be sorted after any modification.

```
const arr = SortedArray.from([1, 2, 4])
arr.push(3)
console.log(arr) // [1, 2, 3, 4]
```

