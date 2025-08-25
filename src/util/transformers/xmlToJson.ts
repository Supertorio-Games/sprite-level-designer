/**
 * Converts an XML DOM object or XML string to a JSON object.
 * This is a generic function that can be used for any well-formed XML.
 *
 * @param {string|Document} xml The XML string or DOM document to convert.
 * @returns {object} The resulting JSON object.
 */
export default (xml: string | Document) => {
    // If the input is a string, parse it as a DOM object
    if (typeof xml === 'string') {
        const parser = new DOMParser();
        xml = parser.parseFromString(xml, "application/xml");
    }

    // Get the root element of the document
    const rootElement = xml.documentElement;
    
    // Call the recursive helper function on the root element
    return elementToJson(rootElement);
}

/**
 * Recursive helper function to convert an element and its children to JSON.
 *
 * @param {Element} element The XML element to convert.
 * @returns {object|string} The resulting JSON object or string (for text nodes).
 */
const elementToJson = (element: Element) => {
    const obj = {};

    // Handle attributes for this element
    if (element.hasAttributes()) {
        // const attributes = {};
        for (const attr of element.attributes) {
            obj[attr.name] = attr.value;
            // attributes[attr.name] = attr.value;
        }
        // obj['@attributes'] = attributes;
    }

    // Handle child nodes and their content
    const children = element.childNodes;
    if (children.length > 0) {
        let hasTextContent = false;
        let textContent = '';
        
        for (const node of children) {
            if (node.nodeType === 1) { // Element node
                const nodeName = node.nodeName;
                const childObj = elementToJson(node);

                if (obj[nodeName]) {
                    // If the node name already exists, convert to an array
                    if (!Array.isArray(obj[nodeName])) {
                        obj[nodeName] = [obj[nodeName]];
                    }
                    obj[nodeName].push(childObj);
                } else {
                    // Otherwise, just add the new object
                    obj[nodeName] = childObj;
                }
            } else if (node.nodeType === 3 || node.nodeType === 4) { // Text or CDATA node
                const nodeText = node.textContent.trim();
                if (nodeText !== '') {
                    hasTextContent = true;
                    textContent += nodeText;
                }
            }
        }
        
        // If there's text content and no other element children, return just the text
        if (hasTextContent && Object.keys(obj).length === 0) {
            return textContent;
        }
        
        // If there's a mix of text and elements, add the text to a special key
        if (hasTextContent) {
             obj['#text'] = textContent;
        }
    }

    return obj;
}