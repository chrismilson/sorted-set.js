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

/**
 * Removes a value from the subtree rooted at `node` and returns the root of the
 * resulting tree after deletion. The node must be in the tree already.
 *
 * @param value The value to remove.
 * @param node The root of the tree to remove the value from.
 * @param compare A comparison function to know which subtree to recurse into.
 */
export function remove<T>(
  value: T,
  node: SSTNode<T>,
  compare: (a: T, b: T) => number
): SSTNode<T> | undefined {
  if (node === undefined) {
    return undefined
  }

  node.data.size -= 1
  const comparison = compare(value, node.data.value)

  if (comparison < 0) {
    // The value is in the left subtree and is definitely in the tree.
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    node.left = remove(value, node.left!, compare)
    return balanceLeft(node)
  } else if (comparison > 0) {
    // The value is in the right subtree and is definitely in the tree.
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    node.right = remove(value, node.right!, compare)
    return balanceRight(node)
  }

  // The current node should be deleted.
  if (node.left !== undefined && node.right !== undefined) {
    // Two children. We should replace the current node with its predecessor
    // value and remove that value from the left subtree.
    // since it is a predecessor it will not have two children and we will not
    // recurse forever.
    let pre = node.left
    while (pre.right !== undefined) {
      pre = pre.right
    }
    node.data.value = pre.data.value
    node.left = remove(pre.data.value, node.left, compare)
    return balanceLeft(node)
  }

  // If at most one of the children is defined, they must be a single node, as
  // otherwise we would not be weight balanced.
  return node.left || node.right
}
