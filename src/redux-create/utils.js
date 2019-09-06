export const isArray = a => Array.isArray(a)

export const isFunction = f => typeof f === 'function'

export const isObject = o => o != null && typeof o === 'object' && !isArray(o)

export const isObjectObject = o =>
  isObject(o) === true && Object.prototype.toString.call(o) === '[object Object]'

export const isPlainObject = o => {
  var ctor, prot
  if (isObjectObject(o) === false) return false
  ctor = o.constructor
  if (typeof ctor !== 'function') return false
  prot = ctor.prototype
  if (isObjectObject(prot) === false) return false
  if (prot.hasOwnProperty('isPrototypeOf') === false) {
    return false
  }
  return true
}

export const invariant = (b, s) => {
  if (!b) {
    throw new Error(s)
  }
}
