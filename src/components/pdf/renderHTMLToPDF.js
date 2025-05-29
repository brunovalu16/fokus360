import { Text, View, Link, StyleSheet } from "@react-pdf/renderer";
import { parseDocument } from "htmlparser2";

const styles = StyleSheet.create({
  paragraph: { marginBottom: 5 },
  bold: { fontWeight: "bold" },
  italic: { fontStyle: "italic" },
  listItem: { marginLeft: 10, marginBottom: 2 },
  link: { color: "blue", textDecoration: "underline" },
});

const renderNode = (node, key) => {
  if (!node) return null;

  if (node.type === "text") {
    return <Text key={key}>{node.data}</Text>;
  }

  if (node.type === "tag") {
    const children = (node.children || []).map((child, index) =>
      renderNode(child, `${key}-${index}`)
    );

    switch (node.name) {
      case "p":
        return (
          <View key={key} style={styles.paragraph}>
            <Text>{children}</Text>
          </View>
        );
      case "strong":
      case "b":
        return <Text key={key} style={styles.bold}>{children}</Text>;
      case "em":
      case "i":
        return <Text key={key} style={styles.italic}>{children}</Text>;
      case "ul":
        return <View key={key}>{children}</View>;
      case "li":
        return (
          <View key={key} style={styles.listItem}>
            <Text>• {children}</Text>
          </View>
        );
      case "br":
        return <Text key={key}>{"\n"}</Text>;
      case "a":
        return (
          <Link key={key} src={node.attribs?.href || "#"} style={styles.link}>
            {children}
          </Link>
        );
      default:
        return <Text key={key}>{children}</Text>;
    }
  }

  return null;
};

export const renderHTMLToPDF = (htmlString) => {
  const dom = parseDocument(htmlString);
  if (!dom || !dom.children) return null;

  return dom.children.map((node, index) => renderNode(node, index));
};
