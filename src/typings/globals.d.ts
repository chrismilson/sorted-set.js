declare global {
  namespace jest {
    interface Matchers<R> {
      /**
       * Makes sure that a weigh balanced tree has correct sizes for each node;
       * each nodes size is the number of nodes in the subtree rooted at that
       * node.
       */
      toHaveCorrectSizes(): R

      /**
       * Makes sure that a weight balanced tree is balanced by checking that
       * each node satisfies the balance criteria.
       */
      toBeBalanced(): R
    }
  }
}
export {}
