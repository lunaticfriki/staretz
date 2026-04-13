abstract class HastProperties {
  className?: string[];
  alt?: string;
  [key: string]: unknown;
}

abstract class HastNode {
  type?: string;
  tagName?: string;
  properties?: HastProperties;
  children?: HastNode[];
  value?: string;
}

export function rehypeImageCaption() {
  return (tree: HastNode) => {
    const walk = (node: HastNode) => {
      if (node.children) {
        if (
          node.tagName === "p" &&
          node.children.length === 1 &&
          node.children[0].tagName === "img"
        ) {
          const img = node.children[0];

          if (img.properties && img.properties.alt) {
            node.tagName = "figure";
            node.properties = {
              ...node.properties,
              className: [
                "flex",
                "flex-col",
                "items-center",
                "justify-center",
                "my-8",
                "w-full",
              ],
            };

            node.children.push({
              type: "element",
              tagName: "figcaption",
              properties: {
                className: [
                  "text-sm",
                  "text-gray-500",
                  "dark:text-gray-400",
                  "mt-2",
                  "italic",
                  "text-center",
                ],
              },
              children: [{ type: "text", value: img.properties.alt }],
            });
          }
        }

        node.children.forEach(walk);
      }
    };

    walk(tree);
  };
}
