import { imageToBase64 } from "@/lib/gemini";
import { router, useLocalSearchParams } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function PreviewScreen() {
  const { photoUri } = useLocalSearchParams<{ photoUri: string }>();

  async function testBase64() {
    if (!photoUri) return;

    const base64 = await imageToBase64(photoUri);

    console.log("Base64 Length:", base64.length);
    console.log("First 100 chars:", base64.substring(0, 100));
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

        <TouchableOpacity
          style={styles.analyzeButton}
          onPress={() =>
            router.push({
              pathname: "/result",
              params: { photoUri },
            })
          }
        >
          <Text style={styles.buttonText}>Analyze</Text>
        </TouchableOpacity>
      </View>

      {/* Temporary test button for Phase 4.2 */}
      <TouchableOpacity style={styles.testButton} onPress={testBase64}>
        <Text style={styles.buttonText}>Test Base64</Text>
      </TouchableOpacity>
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

  testButton: {
    alignSelf: "center",
    backgroundColor: "#2563EB",
    paddingHorizontal: 30,
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 30,
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
