import { defaultCmp } from '..'
import {
  balanceLeft,
  balanceRight,
  doubleLeft,
  doubleRight,
  find,
  insert,
  singleLeft,
  singleRight,
  WBTNode,
} from '../WBTNode'

/**
 * Copies a weight balanced tree recursively. Has no protection against circular
 * trees, so be careful.
 */
function deepCopy(root: undefined): undefined
function deepCopy<T>(root: WBTNode<T>): WBTNode<T>
function deepCopy<T>(root: WBTNode<T> | undefined): WBTNode<T> | undefined
function deepCopy<T>(root: WBTNode<T> | undefined): WBTNode<T> | undefined {
  if (root === undefined) {
    return undefined
  }

  return {
    ...root,
    left: deepCopy(root.left),
    right: deepCopy(root.right),
  }
}

describe('Weight Balanced Tree Node', () => {
  describe('rotation', () => {
    describe('single left', () => {
      it('Should rotate a node left and keep the sizes correct', () => {
        const a = {
          data: 'a',
          size: 3,
          right: { data: 'b', size: 2, right: { data: 'c', size: 1 } },
        }
        const b = a.right
        const originalSize = a.size

        const result = singleLeft(a)
        expect(result).toBe(b)
        expect(result).toHaveCorrectSizes()
        expect(result.size).toBe(originalSize)
      })
    })

    describe('single right', () => {
      it('Should rotate a node right and keep the sizes correct', () => {
        const c = {
          data: 'c',
          size: 3,
          left: { data: 'b', size: 2, left: { data: 'a', size: 1 } },
        }
        const b = c.left
        const originalSize = c.size

        const result = singleRight(c)
        expect(result).toBe(b)
        expect(result).toHaveCorrectSizes()
        expect(result.size).toBe(originalSize)
      })
    })

    describe('double left', () => {
      const exampleTree = {
        data: 'a',
        size: 3,
        right: { data: 'c', size: 2, left: { data: 'b', size: 1 } },
      }

      it('Should rotate a node left after rotating its child right', () => {
        const a = deepCopy(exampleTree)
        const b = a.right?.left

        const result = doubleLeft(a)
        expect(result).toBe(b)
      })

      it('Should keep the node sizes correct', () => {
        const a = deepCopy(exampleTree)

        const result = doubleLeft(a)
        expect(result).toHaveCorrectSizes()
      })
    })

    describe('double right', () => {
      const exampleTree = {
        data: 'c',
        size: 3,
        left: { data: 'a', size: 2, right: { data: 'b', size: 1 } },
      }

      it('Should rotate a node left after rotating its child right', () => {
        const c = deepCopy(exampleTree)
        const b = c.left?.right

        const result = doubleRight(c)
        expect(result).toBe(b)
      })

      it('Should keep the node sizes correct', () => {
        const c = deepCopy(exampleTree)

        const result = doubleRight(c)
        expect(result).toHaveCorrectSizes()
      })
    })
  })

  describe('balance', () => {
    const balancedTree = {
      data: 'b',
      size: 3,
      left: { data: 'a', size: 1 },
      right: { data: 'c', size: 1 },
    }
    const rightHeavyTree = {
      data: 'a',
      size: 3,
      right: { data: 'c', size: 2, left: { data: 'b', size: 1 } },
    }
    const leftHeavyTree = {
      data: 'c',
      size: 3,
      left: { data: 'b', size: 2, left: { data: 'a', size: 1 } },
    }

    it('Should detect a balanced tree', () => {
      expect(balancedTree).toBeBalanced()
    })

    it('Should detect an unbalanced tree as unbalanced', () => {
      expect(rightHeavyTree).not.toBeBalanced()
      expect(leftHeavyTree).not.toBeBalanced()
    })

    describe('balance right', () => {
      it('Should balance a left heavy node', () => {
        const root = deepCopy(leftHeavyTree)
        const result = balanceRight(root)
        expect(result).toBeBalanced()
      })
    })

    describe('balance left', () => {
      it('Should balance a right heavy node', () => {
        const root = deepCopy(rightHeavyTree)
        const result = balanceLeft(root)
        expect(result).toBeBalanced()
      })
    })
  })

  describe('insert', () => {
    const exampleTree = {
      data: 'b',
      size: 3,
      left: { data: 'a', size: 1 },
      right: { data: 'c', size: 1 },
    }

    it('Should insert a value in lexicographical order', () => {
      const traverse = function* <T>(
        root: WBTNode<T> | undefined
      ): Generator<T> {
        if (root === undefined) {
          return
        }
        yield* traverse(root.left)
        yield root.data
        yield* traverse(root.right)
      }

      const root = deepCopy(exampleTree)
      const result = insert('aa', root, (a, b) => (a < b ? -1 : a > b ? 1 : 0))

      const order = [...traverse(result)]
      expect(order).toMatchObject([...order].sort())
    })

    it('Should remain balanced while inserting values at the far right', () => {
      let root: WBTNode<number> | undefined = undefined

      for (let i = 0; i < 100; i++) {
        root = insert(i, root, (a, b) => a - b)
        expect(root).toBeBalanced()
      }
    })

    it('Should remain balanced while inserting values at the far left', () => {
      let root: WBTNode<number> | undefined = undefined

      for (let i = 100; i > 0; i--) {
        root = insert(i, root, (a, b) => a - b)
        expect(root).toBeBalanced()
      }
    })

    it('Should have the correct size while inserting values at the far right', () => {
      let root: WBTNode<number> | undefined = undefined

      for (let i = 0; i < 100; i++) {
        root = insert(i, root, (a, b) => a - b)
        expect(root).toHaveCorrectSizes()
        expect(root.size).toBe(i + 1)
      }
    })

    it('Should have the correct size while inserting values at the far left', () => {
      let root: WBTNode<number> | undefined = undefined

      for (let i = 0; i < 100; i++) {
        root = insert(i, root, (a, b) => b - a)
        expect(root).toHaveCorrectSizes()
        expect(root.size).toBe(i + 1)
      }
    })

    // This test is not deterministic due to the use of Math.random and
    // therefore would be a nightmare to debug. It is purely here to grant the
    // developer peace of mind that the algorithm works. Due to the massive
    // number of test cases that would be needed if the tests intended to be
    // exhaustive, it would be unwise to implement these tests by hand.
    it.skip('Should remain balanced while inserting random values', () => {
      let root: WBTNode<number> | undefined = undefined

      for (let i = 0; i < 1000; i++) {
        root = insert(Math.random(), root, (a, b) => a - b)
        expect(root).toBeBalanced()
      }
    })
  })

  describe('find', () => {
    const exampleTree = {
      data: 'b',
      size: 3,
      left: { data: 'a', size: 1 },
      right: { data: 'c', size: 1 },
    }

    it('Should be able to find a node by its index', () => {
      let targetIdx = 1

      const findIdx = (node: WBTNode<unknown>) => {
        const lSize = node.left?.size ?? 0

        if (targetIdx < lSize) {
          return -1 // go left
        } else if (lSize < targetIdx) {
          targetIdx -= lSize
          return 1 // go right and update target idx
        }
        return 0 // this is the one!
      }

      expect(find(exampleTree, findIdx)).toMatchObject(exampleTree)
    })

    it('Should be able to find a node by its value', () => {
      const targetValue = 'c'

      const findValue = (node: WBTNode<string>) =>
        defaultCmp(targetValue, node.data)

      expect(find(exampleTree, findValue)).toMatchObject(exampleTree.right)
    })
  })
})
