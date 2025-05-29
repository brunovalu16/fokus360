import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import { renderHTMLToPDF } from "./renderHTMLToPDF";
import { cleanHTML } from "../utils/cleanHTML";

const styles = StyleSheet.create({
  page: { padding: 30 },
  section: { marginBottom: 15 },
  title: { fontSize: 18, marginBottom: 10, fontWeight: "bold" },
  itemTitle: { fontSize: 16, marginBottom: 5, fontWeight: "bold" },
  subItemTitle: { fontSize: 14, marginBottom: 5, fontWeight: "bold" },
});

const ManualPDF = ({ nomeProjeto, formularios }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>{nomeProjeto}</Text>

      {formularios.map((form, idx) => (
        <View key={idx} style={styles.section}>
          {/* Título do item */}
          <Text style={styles.itemTitle}>{form.titulo}</Text>

          {/* Descrição do item */}
          {renderHTMLToPDF(cleanHTML(form.descricao))}

          {/* Loop dos subitens */}
          {form.subItens?.map((sub, subIdx) => (
            <View key={subIdx} style={{ marginLeft: 10, marginTop: 5 }}>
              {/* Título do subitem */}
              <Text style={styles.subItemTitle}>{sub.titulo}</Text>

              {/* Descrição do subitem */}
              {renderHTMLToPDF(cleanHTML(sub.descricao))}
            </View>
          ))}
        </View>
      ))}
    </Page>
  </Document>
);

export default ManualPDF;
