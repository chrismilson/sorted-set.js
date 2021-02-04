import { insert, WBTNode } from './WBTNode'

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
  private root?: WBTNode<T>
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
    if (idx < 0 || idx >= (this.root?.size ?? 0) || isNaN(idx)) {
      return undefined
    }

    let curr = this.root

    while (curr) {
      const lSize = curr.left?.size ?? 0
      if (idx < lSize) {
        // The lSize was positive, since idx >= 0, so curr.left is defined.
        curr = curr.left
      } else if (idx > lSize) {
        // There are now lSize plus the current node nodes that do not hold the
        // target value.
        idx -= lSize + 1
        curr = curr.right
      } else {
        return curr.data // We will always return here.
      }
    }
    return undefined // Never reached
  }

  get length(): number {
    return this.root?.size ?? 0
  }

  /**
   * Inserts a value into the set.
   *
   * @param value The value to insert.
   */
  insert(value: T): number {
    this.root = insert(value, this.root, this.compare)
    // We just added a value to the tree, so the tree will be non-empty
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.root!.size
  }

  /**
   * Calculates the minimum would-be index in the sorted set if the value was
   * inserted, or the actual index if the value is already in the set.
   *
   * @param value
   */
  bisect(value: T): number {
    let result = 0

    let curr = this.root

    while (curr !== undefined) {
      const comparison = this.compare(value, curr.data)

      if (comparison < 0) {
        curr = curr.left
      } else if (comparison > 0) {
        result += (curr.left?.size ?? 0) + 1
        curr = curr.right
      } else {
        return result
      }
    }

    return result
  }

  /**
   * Determines whether the value is in the set.
   */
  contains(value: T): boolean {
    let curr = this.root

    while (curr) {
      const comparison = this.compare(value, curr.data)

      if (comparison < 0) {
        curr = curr.left
      } else if (comparison > 0) {
        curr = curr.right
      } else {
        return true
      }
    }

    return false
  }

  /**
   * Iterates over the values in the set in order.
   */
  *[Symbol.iterator](): Generator<T> {
    // Performs a morris traversal of the tree.
    let curr = this.root

    while (curr) {
      if (curr.left === undefined) {
        yield curr.data
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
          yield curr.data
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
