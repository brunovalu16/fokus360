import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
} from "@react-pdf/renderer";

// Estilos do PDF
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
    fontFamily: "Helvetica",
  },
  tituloDepto: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
  itemContainer: {
    marginBottom: 15,
    borderBottom: "1px solid #ccc",
    paddingBottom: 10,
  },
  itemTitulo: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
  },
  itemDescricao: {
    marginBottom: 8,
    lineHeight: 1.4,
  },
  subItem: {
    marginLeft: 12,
    marginBottom: 6,
  },
  subItemTitulo: {
    fontSize: 12,
    fontWeight: "bold",
  },
  subItemDescricao: {
    fontSize: 11,
    lineHeight: 1.3,
  },
});

// Componente de PDF
const ManualPDF = ({ nomeProjeto, formularios }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.tituloDepto}>Manual: {nomeProjeto}</Text>

      {formularios.map((form, i) => (
        <View key={i} style={styles.itemContainer}>
          <Text style={styles.itemTitulo}>
            {form.titulo || `Item #${form.id}`}
          </Text>
          <Text style={styles.itemDescricao}>{form.descricao}</Text>

          {form.subItens?.map((sub, j) => (
            <View key={j} style={styles.subItem}>
              <Text style={styles.subItemTitulo}>
                ↳ {sub.titulo || `Subitem #${j + 1}`}
              </Text>
              <Text style={styles.subItemDescricao}>{sub.descricao}</Text>
            </View>
          ))}
        </View>
      ))}
    </Page>
  </Document>
);

export default ManualPDF;
