import { analyzeImage, imageToBase64 } from "@/lib/gemini";
import { router, useLocalSearchParams } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function PreviewScreen() {
  const { photoUri } = useLocalSearchParams<{ photoUri: string }>();

  async function handleAnalyze() {
    if (!photoUri) return;

    try {
      // Convert image to Base64
      const base64Image = await imageToBase64(photoUri);

      console.log("Base64 Length:", base64Image.length);

      // Send image to Gemini
      const result = await analyzeImage(base64Image);

      console.log("Gemini Response:", result);

      // Go to Result screen
      router.push({
        pathname: "/result",
        params: {
          base64Image,
        },
      });
    } catch (error) {
      console.error("Analyze Error:", error);
    }
  }

  return (
    <View style={styles.container}>
      {photoUri ? (
        <Image source={{ uri: photoUri }} style={styles.preview} />
      ) : (
        <Text style={styles.errorText}>No photo found.</Text>
      )}

      <View style={styles.actionRow}>
        <TouchableOpacity
          style={styles.retakeButton}
          onPress={() => router.back()}
        >
          <Text style={styles.buttonText}>Retake</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.analyzeButton} onPress={handleAnalyze}>
          <Text style={styles.buttonText}>Analyze</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },

  preview: {
    flex: 1,
    resizeMode: "contain",
  },

  actionRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 20,
  },

  retakeButton: {
    backgroundColor: "#5A6472",
    paddingHorizontal: 30,
    paddingVertical: 14,
    borderRadius: 8,
  },

  analyzeButton: {
    backgroundColor: "#5B3FA3",
    paddingHorizontal: 30,
    paddingVertical: 14,
    borderRadius: 8,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  errorText: {
    flex: 1,
    color: "#fff",
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 18,
  },
});
