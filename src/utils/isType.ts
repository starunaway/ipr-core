export function isHTMLElement(node: any) {
  const vDom = document.createElement('div');
  try {
    vDom.appendChild(node.cloneNode(true));
    return vDom.nodeType === 1 ? true : false;
  } catch (e) {
    return false;
  }
}
