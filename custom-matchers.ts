import { WBTNode } from './src/WBTNode'

expect.extend({
  toHaveCorrectSizes(recieved: WBTNode<unknown>) {
    const checkRecursive = (
      node: WBTNode<unknown> | undefined
    ): [boolean, number] => {
      if (node === undefined) return [true, 0]

      const [leftResult, leftSize] = checkRecursive(node.left)
      const [rightResult, rightSize] = checkRecursive(node.right)

      return [
        leftResult && rightResult && leftSize + rightSize + 1 === node.size,
        node.size,
      ]
    }

    if (checkRecursive(recieved)) {
      return {
        pass: true,
        message: () => `Expected the tree to have incorrect sizes.`,
      }
    }
    return {
      pass: false,
      message: () => `Expected the tree to have correct sizes.`,
    }
  },
})
