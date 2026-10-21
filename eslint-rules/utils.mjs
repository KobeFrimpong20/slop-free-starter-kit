// Shared helpers for the slop-free lint rules.

/** Collect every string fragment inside an AST subtree (literals, template text). */
export function collectStrings(node, out = []) {
  if (!node || typeof node.type !== "string") return out;
  if (node.type === "Literal" && typeof node.value === "string") out.push(node.value);
  else if (node.type === "TemplateElement") out.push(node.value.cooked ?? "");
  else {
    for (const key of Object.keys(node)) {
      if (key === "parent" || key === "loc" || key === "range") continue;
      const child = node[key];
      if (Array.isArray(child)) child.forEach((c) => collectStrings(c, out));
      else if (child && typeof child.type === "string") collectStrings(child, out);
    }
  }
  return out;
}

export function getAttr(openingElement, name) {
  return openingElement.attributes.find(
    (a) => a.type === "JSXAttribute" && a.name.name === name,
  );
}

/** Class tokens from a className attribute, with variant prefixes (hover:, md:) stripped. */
export function classTokens(openingElement) {
  const attr = getAttr(openingElement, "className");
  if (!attr?.value) return [];
  return collectStrings(attr.value)
    .flatMap((s) => s.split(/\s+/))
    .filter(Boolean)
    .map((t) => t.replace(/^(?:[^:[\]]+:)+/, "").replace(/^!/, ""));
}

export function elementName(openingElement) {
  const n = openingElement.name;
  if (n.type === "JSXIdentifier") return n.name;
  if (n.type === "JSXMemberExpression") return n.property.name;
  return "";
}

/** Yield the enclosing JSXElements of a node, nearest first. */
export function* jsxAncestors(node) {
  for (let p = node.parent; p; p = p.parent) {
    if (p.type === "JSXElement") yield p;
  }
}

/** Visible text of a JSXElement: its text and string-literal children, recursively. */
export function jsxText(element) {
  let text = "";
  for (const child of element.children ?? []) {
    if (child.type === "JSXText") text += child.value;
    else if (child.type === "JSXElement" || child.type === "JSXFragment") text += jsxText(child);
    else if (child.type === "JSXExpressionContainer") text += collectStrings(child.expression).join("");
  }
  return text.replace(/\s+/g, " ").trim();
}
