import { insert, WBTNode } from './WBTNode'

export function defaultCmp(a: unknown, b: unknown): number {
  const aStr = new String(a)
  const bStr = new String(b)
  return aStr < bStr ? -1 : aStr > bStr ? 1 : 0
}

/**
 * A sorted array.
 */
export class SortedArray<T> {
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
    if (idx < 0 || idx >= (this.root?.size ?? 0)) {
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
        return curr.value // We will always return here.
      }
    }
    return undefined // Never reached
  }

  /**
   * Inserts a value into the sorted array.
   *
   * @param value The value to insert into the array.
   */
  insert(value: T): number {
    this.root = insert(value, this.root, this.compare)
    // We just added a value to the tree, so the tree will be non-empty
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.root!.size
  }

  /**
   * Calculates the minimum would-be index in the sorted array if the value was
   * inserted.
   *
   * @param value
   */
  bisectLeft(value: T): number {
    let result = 0

    let curr = this.root

    while (curr !== undefined) {
      const comparison = this.compare(value, curr.value)

      if (comparison < 0) {
        curr = curr.left
      } else if (comparison > 0) {
        result += (curr.left?.size ?? 0) + 1
        curr = curr.right
      } else {
        break
      }
    }

    return result
  }

  /**
   * Calculates the maximum would-be index in the sorted array if the value was
   * inserted.
   *
   * @param value
   */
  bisectRight(value: T): number {
    let result = 0

    let curr = this.root

    while (curr !== undefined) {
      const comparison = this.compare(value, curr.value)

      if (comparison < 0) {
        curr = curr.left
      } else if (comparison > 0) {
        result += (curr.left?.size ?? 0) + 1
        curr = curr.right
      } else {
        return result + curr.size
      }
    }

    return result
  }

  /**
   * Determines whether the value is in the sorted array.
   */
  contains(value: T): boolean {
    let curr = this.root

    while (curr) {
      const comparison = this.compare(value, curr.value)

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

  *[Symbol.iterator](): Generator<T> {
    let curr = this.root

    while (curr) {
      if (curr.left === undefined) {
        yield curr.value
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
          yield curr.value
          curr = curr.right
        }
      }
    }
  }

  /**
   * Returns a string representation of the sorted array.
   */
  toString(): string {
    return `<SortedArray [${[...this].join(', ')}]>`
  }
}
