import { imageToBase64 } from "@/lib/gemini";
import { router, useLocalSearchParams } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function PreviewScreen() {
  const { photoUri } = useLocalSearchParams<{ photoUri: string }>();

  async function goAnalyze(promptKey: string) {
    if (!photoUri) return;

    try {
      // Convert image to Base64
      const base64Image = await imageToBase64(photoUri);

      console.log("Base64 Length:", base64Image.length);

      // Navigate to Result screen with selected prompt
      router.push({
        pathname: "/result",
        params: {
          base64Image,
          promptKey,
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
      </View>

      <View style={styles.personaRow}>
        <TouchableOpacity
          style={styles.personaButton}
          onPress={() => goAnalyze("academic")}
        >
          <Text style={styles.buttonText}>Academic</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.personaButton}
          onPress={() => goAnalyze("safety")}
        >
          <Text style={styles.buttonText}>Safety</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.personaButton}
          onPress={() => goAnalyze("inventory")}
        >
          <Text style={styles.buttonText}>Inventory</Text>
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
    paddingTop: 20,
    alignItems: "center",
  },

  retakeButton: {
    backgroundColor: "#5A6472",
    paddingHorizontal: 35,
    paddingVertical: 14,
    borderRadius: 8,
  },

  personaRow: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 12,
  },

  personaButton: {
    backgroundColor: "#5B3FA3",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
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
