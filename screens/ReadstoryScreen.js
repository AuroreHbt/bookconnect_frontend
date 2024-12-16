import React from "react";
import { StyleSheet, Text, View,} from "react-native";
import { WebView } from "react-native-webview";

export default function ReadStoryScreen({ route }) {
  const { story } = route.params;

  console.log("Histoire reçue :", story);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{story.title}</Text>
      <Text style={styles.category}>{story.category}</Text>
      <Text style={styles.description}>{story.description}</Text>
      <WebView source={{ uri: story.storyFile }} style={styles.webView} />
    </View>
  );
}

const styles = StyleSheet.create({
  
    container: { flex: 1,
    padding: 10,
    backgroundColor: "pink" },

    title: { fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10 },

  webView: { flex: 1 },
});
