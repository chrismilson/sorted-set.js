import { WBTNode, balanceLeft, balanceRight } from 'wbtree'

export type SSTNode<T> = WBTNode<{ value: T }>

/**
 * Finds a node in the subtree rooted at a given node. It does this by calling a
 * special compare function that takes the current node as input and continues
 * depending on the output of this function:
 *
 * If the compare function returns a negative number on a given node, the search
 * will continue on the left subtree of the node.
 *
 * If the compare function returns a positive number on a given node, the search
 * will continue on the right subtree of the node.
 *
 * If the compare function returns zero on the node, then the current node will
 * be returned by `find`.
 *
 * @example
 * ```ts
 * const findByIndex = (idx, root) => find(root, (node) => {
 *   const lSize = node.left?.size ?? 0
 *
 *   if (lSize < idx) {
 *     idx -= lSize
 *     return 1
 *   } else if (idx < lSize) {
 *     return -1
 *   }
 *   return 0
 * })
 *
 * // Assumes we have some compare function for the type of `value`.
 * const findByValue = (value, root) => find(root, (node) => {
 *   return compare(value, node.data.value)
 * })
 * ```
 *
 * @param node The root node of the tree to search.
 * @param progressUpdater The special compare function.
 */
export function find<T>(
  node: SSTNode<T> | undefined,
  progressUpdater: (node: SSTNode<T>) => number
): SSTNode<T> | undefined {
  while (node !== undefined) {
    const next = progressUpdater(node)

    if (next < 0) {
      node = node.left
    } else if (next > 0) {
      node = node.right
    } else {
      break
    }
  }
  return node
}

/**
 * Inserts the value into the tree. The value must not be in the tree already.
 */
export function insert<T>(
  value: T,
  node: SSTNode<T> | undefined,
  compare: (a: T, b: T) => number
): SSTNode<T> {
  if (node === undefined) {
    return { data: { value, size: 1 } }
  }
  node.data.size += 1
  const comparison = compare(value, node.data.value)

  if (comparison < 0) {
    node.left = insert(value, node.left, compare)
    return balanceRight(node) as SSTNode<T>
  } else if (comparison > 0) {
    node.right = insert(value, node.right, compare)
    return balanceLeft(node) as SSTNode<T>
  }

  return node
}
