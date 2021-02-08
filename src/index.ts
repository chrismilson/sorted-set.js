import { insert, find, SSTNode, remove } from './tree'

/**
 * The default comparison function. Designed to be consistend with
 * `Array.prototype.sort()`.`
 */
export function defaultCmp(a: unknown, b: unknown): number {
  const aStr = new String(a)
  const bStr = new String(b)
  return aStr < bStr ? -1 : aStr > bStr ? 1 : 0
}

/**
 * A sorted set.
 */
export class SortedSet<T> implements Set<T> {
  private root?: SSTNode<T>
  private compare: (a: T, b: T) => number;
  [Symbol.toStringTag] = 'SortedSet'

  constructor(compare: (a: T, b: T) => number = defaultCmp) {
    this.compare = compare
  }

  /**
   * Returns the value at the given index in the sorted order. (0-indexed)
   *
   * If the index is invalid, returns undefined.
   *
   * @param idx The index to lookup
   */
  get(idx: number): T | undefined {
    // Make sure we have a valid index
    if (idx < 0 || idx >= (this.root?.data.size ?? 0) || isNaN(idx)) {
      return undefined
    }

    return find(this.root, (node) => {
      const lSize = node.left?.data.size ?? 0

      if (idx > lSize) {
        // All nodes in the left subtree plus the single parent.
        idx -= lSize + 1
        return 1
      }
      return lSize - idx
    })?.data.value
  }

  /**
   * The number of distinct elements in the set.
   */
  get size(): number {
    return this.root?.data.size ?? 0
  }

  /**
   * Inserts a value into the set.
   *
   * @param value The value to insert.
   */
  add(value: T): this {
    if (this.root === undefined || !this.has(value)) {
      this.root = insert(value, this.root, this.compare)
    }
    return this
  }

  /**
   * Removes all elements from the SortedSet object.
   */
  clear(): void {
    this.root = undefined
  }

  /**
   * Removes a value from the set and returns a boolean determining whether the
   * removal was successful. (the value was or wasn't in the tree beforehand)
   *
   * @param value The value to remove
   */
  delete(value: T): boolean {
    if (this.root === undefined || !this.has(value)) {
      return false
    }

    this.root = remove(value, this.root, this.compare)
    return true
  }

  /**
   * Determines whether the value is in the set.
   */
  has(value: T): boolean {
    const node = find(this.root, (node) => this.compare(value, node.data.value))
    return node !== undefined
  }

  /**
   * Calculates the minimum would-be index in the sorted set if the value was
   * inserted, or the actual index if the value is already in the set.
   *
   * @param value
   */
  bisect(value: T): number {
    let result = 0

    find(this.root, (node) => {
      const comparison = this.compare(value, node.data.value)
      if (comparison > 0) {
        result += (node.left?.data.size ?? 0) + 1
      }
      return comparison
    })

    return result
  }

  /**
   * Iterates over the values in the set in sorted order.
   */
  *[Symbol.iterator](): Generator<T> {
    // Performs a morris traversal of the tree.
    let curr = this.root

    while (curr) {
      if (curr.left === undefined) {
        yield curr.data.value
        curr = curr.right
      } else {
        let pre = curr.left
        while (pre.right !== undefined && pre.right !== curr) {
          pre = pre.right
        }

        if (pre.right === undefined) {
          pre.right = curr
          curr = curr.left
        } else {
          pre.right = undefined
          yield curr.data.value
          curr = curr.right
        }
      }
    }
  }

  /**
   * Calls `callbackfn` once for each value present in the `SortedSet` object,
   * in sorted order. If a `thisArg` parameter is provided, it will be used as
   * the `this` value for each invocation of `callbackfn`.
   *
   * @param callbackfn Function to execute for each element.
   * @param thisArg Value to use as `this` when executing `callbackfn`.
   */
  forEach(
    callbackfn: (value: T, value2: T, set: Set<T>) => void,
    thisArg?: unknown
  ): void {
    callbackfn = callbackfn.bind(thisArg || this)
    for (const val of this) {
      callbackfn(val, val, this)
    }
  }

  /**
   * Returns a new iterator object that contains an array of [value, value] for
   * each element in the Set object, in sorted order.
   *
   * This is similar to the `Map` object, so that each entry's key is the same
   * as its value for a `SortedSet`.
   */
  *entries(): IterableIterator<[T, T]> {
    for (const value of this) {
      yield [value, value]
    }
  }
  /**
   * Returns a new iterator object that yields the values for each element in
   * the `SortedSet` object in sorted order. (For `SortedSets`, this is the same as the
   * `values()` method.)
   */
  keys(): IterableIterator<T> {
    return this[Symbol.iterator]()
  }
  /**
   * Returns a new iterator object that yields the values for each element in
   * the `SortedSet` object in sorted order. (For `SortedSets`, this is the same as the
   * `keys()` method.)
   */
  values(): IterableIterator<T> {
    return this[Symbol.iterator]()
  }
}
