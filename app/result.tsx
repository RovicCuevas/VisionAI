import { ANALYSIS_PROMPT, analyzeImage } from "@/lib/gemini";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

type AnalysisResult = {
  objects: string[];
  context: string;
  activities: string;
  recommendations: string;
};

export default function ResultScreen() {
  const { base64Image } = useLocalSearchParams<{
    base64Image: string;
  }>();

  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (base64Image) {
      runAnalysis();
    }
  }, []);

  async function runAnalysis() {
    try {
      setLoading(true);
      setError("");

      const response = await analyzeImage(
        base64Image as string,
        ANALYSIS_PROMPT,
      );

      console.log("========== GEMINI RESPONSE ==========");
      console.log(JSON.stringify(response, null, 2));
      console.log("=====================================");

      if (response.error) {
        throw new Error(response.error.message);
      }

      let text = response?.candidates?.[0]?.content?.parts?.[0]?.text;

      console.log("Gemini Text:");
      console.log(text);

      if (!text) {
        throw new Error("Gemini returned an empty response.");
      }

      // Remove markdown if Gemini wraps the JSON
      text = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      console.log("Clean JSON:");
      console.log(text);

      const parsed = JSON.parse(text);

      console.log("Parsed Result:");
      console.log(parsed);

      setAnalysis(parsed);
    } catch (err: any) {
      console.log("Gemini Error:", err);

      setError(err.message || "Unknown error.");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#5B3FA3" />
        <Text style={styles.loadingText}>Analyzing image...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Analysis Result</Text>

      <Text style={styles.heading}>Objects</Text>

      {analysis?.objects.map((item, index) => (
        <Text key={index} style={styles.listItem}>
          • {item}
        </Text>
      ))}

      <Text style={styles.heading}>Context</Text>
      <Text style={styles.body}>{analysis?.context}</Text>

      <Text style={styles.heading}>Activities</Text>
      <Text style={styles.body}>{analysis?.activities}</Text>

      <Text style={styles.heading}>Recommendations</Text>
      <Text style={styles.body}>{analysis?.recommendations}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 60,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 25,
    textAlign: "center",
  },

  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 8,
    color: "#5B3FA3",
  },

  listItem: {
    fontSize: 16,
    marginBottom: 5,
    marginLeft: 8,
  },

  body: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
  },

  loadingText: {
    marginTop: 15,
    fontSize: 16,
  },

  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
  },
});
