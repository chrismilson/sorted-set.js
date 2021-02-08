import { SortedSet } from '..'

describe('SortedSet', () => {
  describe('get', () => {
    it('Should return undefined for invalid indicies', () => {
      const arr = new SortedSet<number>((a, b) => a - b)

      arr.add(1)
      arr.add(5)

      expect(arr.get(6)).toBe(undefined)
      expect(arr.get(-10)).toBe(undefined)
      expect(arr.get(NaN)).toBe(undefined)
      expect(arr.get(Infinity)).toBe(undefined)
    })
  })

  describe('size', () => {
    it('Should return the number of values in the tree', () => {
      const arr = new SortedSet<number>((a, b) => a - b)

      expect(arr.size).toBe(0)

      arr.add(1)
      arr.add(2)
      arr.add(5)

      expect(arr.size).toBe(3)

      arr.add(1)

      expect(arr.size).toBe(3)
    })
  })

  describe('iterator', () => {
    it('Should iterate the right values and in order', () => {
      const arr = new SortedSet<number>((a, b) => a - b)
      arr.add(2)
      arr.add(3)
      arr.add(1)
      const it = arr[Symbol.iterator]()

      for (let i = 1; i < 4; i++) {
        expect(it.next().value).toBe(i)
      }
      expect(it.next().done).toBeTruthy()
    })
  })

  describe('add', () => {
    it('Should insert values in order', () => {
      const arr = new SortedSet<number>((a, b) => a - b)

      arr.add(1)
      arr.add(5)

      expect([...arr]).toMatchObject([1, 5])

      arr.add(2)

      expect([...arr]).toMatchObject([1, 2, 5])
    })
  })

  describe('remove', () => {
    it('Should remove a value from a tree.', () => {
      const s = new SortedSet<number>((a, b) => a - b)
      const vals = []
      for (let i = 0; i < 10; i++) {
        s.add(i)
        vals.push(i)
      }

      expect([...s]).toMatchObject(vals)
      vals.splice(3, 1)
      s.delete(3)
      expect([...s]).toMatchObject(vals)
    })
  })
})
