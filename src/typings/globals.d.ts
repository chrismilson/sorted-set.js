declare global {
  namespace jest {
    interface Matchers<R> {
      /**
       * Makes sure that a weigh balanced tree has correct sizes for each node;
       * each nodes size is the number of nodes in the subtree rooted at that
       * node.
       */
      toHaveCorrectSizes(): R
    }
  }
}
export {}
