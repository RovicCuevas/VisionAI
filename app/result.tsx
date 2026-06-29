import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

export default function ResultScreen() {
  const { base64Image } = useLocalSearchParams<{
    base64Image: string;
  }>();

  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadResult() {
      try {
        // We'll call Gemini here in the next step.
        console.log("Received Base64:", base64Image?.length);

        setLoading(false);
      } catch (err) {
        setError("Something went wrong.");
        setLoading(false);
      }
    }

    loadResult();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#5B3FA3" />
        <Text style={styles.loadingText}>Analyzing image...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Analysis Complete</Text>

      <Text>Objects: {analysis?.objects?.join(", ")}</Text>

      <Text>Context: {analysis?.context}</Text>

      <Text>Activities: {analysis?.activities}</Text>

      <Text>Recommendations: {analysis?.recommendations}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },

  loadingText: {
    marginTop: 20,
    textAlign: "center",
    fontSize: 18,
  },

  errorText: {
    color: "red",
    fontSize: 18,
    textAlign: "center",
  },
});
