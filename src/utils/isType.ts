export function isHTMLElement(node: any) {
  const vDom = document.createElement('div');
  try {
    vDom.appendChild(node.cloneNode(true));
    return vDom.nodeType === 1 ? true : false;
  } catch (e) {
    return false;
  }
}

export function isArray(t: any) {
  return Object.prototype.toString.call(t).includes('Array');
}

export function isFunction(f: any) {
  return Object.prototype.toString.call(f).includes('Function');
}

export function isObject(o: any) {
  return Object.prototype.toString.call(o).includes('Object');
}
