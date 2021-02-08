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
export class SortedSet<T> {
  private root?: SSTNode<T>
  private compare: (a: T, b: T) => number

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
  add(value: T): number {
    if (this.root === undefined || !this.has(value)) {
      this.root = insert(value, this.root, this.compare)
    }
    // We just added a value to the tree, so the tree will be non-empty
    return this.root.data.size
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
   * Determines whether the value is in the set.
   */
  has(value: T): boolean {
    const node = find(this.root, (node) => this.compare(value, node.data.value))
    return node !== undefined
  }

  /**
   * Iterates over the values in the set in order.
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
   * Returns a string representation of the sorted set.
   */
  toString(): string {
    return `[ SortedSet ${[...this].join(', ')} ]`
  }
}
