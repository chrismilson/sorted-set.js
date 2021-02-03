import { insert, WBTNode } from './WBTNode'

function defaultCmp(a: unknown, b: unknown) {
  const aStr = new String(a)
  const bStr = new String(b)
  return aStr < bStr ? -1 : aStr > bStr ? 1 : 0
}

/**
 * A sorted array implemented with a weight balanced tree.
 */
export default class SortedArray<T> {
  private root?: WBTNode<T>
  private compare: (a: T, b: T) => number

  constructor(compare: (a: T, b: T) => number = defaultCmp) {
    this.compare = compare
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
}
