/**
 * Represents a node in the weight-balanced tree.
 */
export interface WBTNode<T> {
	value: T
	left?: WBTNode<T>
	right?: WBTNode<T>
	size: number
}

/**
 * ```
 *     a
 *      \            b
 *       b    ->   /   \
 *        \       a     c
 *         c
 * ```
 *
 * @returns The node b
 */
export function singleLeft<T>(a: WBTNode<T>): WBTNode<T> {
	if (a.right === undefined) return a
	const b = a.right

	a.size -= b.right?.size ?? 0
	b.size += a.left?.size ?? 0

	a.right = b.left
	b.left = a
	return b
}

/**
 * ```
 *         c
 *        /          b
 *       b    ->   /   \
 *      /         a     c
 *     a
 * ```
 *
 * @returns The node b
 */
export function singleRight<T>(c: WBTNode<T>): WBTNode<T> {
	if (c.left === undefined) return c
	const b = c.left

	c.size -= b.left?.size ?? 0
	b.size += c.right?.size ?? 0

	c.left = b.right
	b.right = c
	return b
}

/**
 * ```
 *     a
 *      \          b
 *       c  ->   /   \
 *      /       a     c
 *     b
 * ```
 *
 * @returns The node b
 */
export function doubleLeft<T>(a: WBTNode<T>): WBTNode<T> {
	if (a.right === undefined) return a
	a.right = singleRight(a.right)
	return singleLeft(a)
}

/**
 * ```
 *       c
 *      /          b
 *     a    ->   /   \
 *      \       a     c
 *       b
 * ```
 *
 * @returns The node b
 */
export function doubleRight<T>(c: WBTNode<T>): WBTNode<T> {
	if (c.left === undefined) return c
	c.left = singleLeft(c.left)
	return singleRight(c)
}

/**
 * Determines whether a single rotation will be sufficient to balance the left
 * and right trees.
 */
function isSingle(
	left: WBTNode<unknown> | undefined,
	right: WBTNode<unknown> | undefined
): boolean {
	const lSize = (left?.size ?? 0) + 1
	const rSize = (right?.size ?? 0) + 1

	return lSize * lSize < 2 * rSize * rSize
}

/**
 * Determines whether the left and right trees are currently balanced.
 */
function isBalanced(
	left: WBTNode<unknown> | undefined,
	right: WBTNode<unknown> | undefined
): boolean {
	const lSize = (left?.size ?? 0) + 1
	const rSize = (right?.size ?? 0) + 1
	const totalSize = lSize + rSize

	return 2 * rSize * rSize < totalSize * totalSize
}

export function balanceLeft(node: undefined): undefined
export function balanceLeft<T>(node: WBTNode<T>): WBTNode<T>
export function balanceLeft<T>(
	node: WBTNode<T> | undefined
): WBTNode<T> | undefined {
	if (node === undefined || isBalanced(node.left, node.right)) {
		return node
	}

	// Should we do a single or double rotation?
	if (isSingle(node.right?.left, node.right?.right)) {
		return singleLeft(node)
	}
	return doubleLeft(node)
}

export function balanceRight(node: undefined): undefined
export function balanceRight<T>(node: WBTNode<T>): WBTNode<T>
export function balanceRight<T>(
	node: WBTNode<T> | undefined
): WBTNode<T> | undefined {
	if (node === undefined || isBalanced(node.right, node.left)) {
		return node
	}

	// Should we do a single or double rotation?
	if (isSingle(node.left?.right, node.left?.left)) {
		return singleRight(node)
	}
	return doubleRight(node)
}

/**
 * Inserts a value into the weight balanced tree with root `node` while keeping
 * the tree balanced.
 */
export function insert<T>(
	value: T,
	node: WBTNode<T> | undefined,
	compare: (a: T, b: T) => number
): WBTNode<T> {
	if (node === undefined) {
		return { value, size: 1 }
	}

	const comparison = compare(value, node.value)

	if (comparison < 0) {
		node.left = insert(value, node.left, compare)
		return balanceRight(node)
	} else if (comparison > 0) {
		node.right = insert(value, node.right, compare)
		return balanceLeft(node)
	}
	return node
}
