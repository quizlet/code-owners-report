import sayHello from '../src'

xdescribe('sayHello', () => {
  it('returns hello', () => {
    expect(sayHello()).toBe('Hello, Haz!')
    expect(sayHello('foo')).toBe('Hello, foo!')
  })
})
