import { WBTNode, singleLeft } from '../WBTNode'

describe('Weight Balanced Tree Node', () => {
  describe('rotation', () => {
    describe('single left', () => {
      it('Should rotate a node left and keep the sizes correct', () => {
        /**
         * ```
         *     a
         *      \            b
         *       b    ->   /   \
         *        \       a     c
         *         c
         * ```
         */
        const a: WBTNode<string> = {
          value: 'a',
          size: 3,
        }
        const b: WBTNode<string> = {
          value: 'b',
          size: 2,
        }
        const c: WBTNode<string> = {
          value: 'c',
          size: 1,
        }
        let result: WBTNode<string>
        a.right = b
        b.right = c

        result = singleLeft(a)
        expect(result).toBe(b)
        expect(result).toHaveCorrectSizes()

        // one more left
        result = singleLeft(result)
        expect(result).toBe(c)
        expect(result).toHaveCorrectSizes()
      })
    })
  })
})
