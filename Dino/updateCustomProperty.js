// ===================== gets our element property
export function getCustomProperty(elem, prop) {
  //getComputedStyle() returns an object containing all of the CSS properties of an element
  //getPropertyValue() returns a DOMString containing the value of a specified CSS property
  //parseFloat converts value to a decimal number
  return parseFloat(getComputedStyle(elem).getPropertyValue(prop)) || 0;
}

// ===================== sets our element property
export function setCustomProperty(elem, prop, value) {
  //setProperty() sets a new value for a property on a CSS style
  elem.style.setProperty(prop, value);
}

// ===================== uses the above two function
export function incrementCustomProperty(elem, prop, inc) {
  setCustomProperty(elem, prop, getCustomProperty(elem, prop) + inc);
}
