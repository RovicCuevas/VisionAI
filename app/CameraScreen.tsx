import { CameraView, useCameraPermissions } from "expo-camera";
import { router } from "expo-router";
import { useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

  const [photo, setPhoto] = useState<string | null>(null);

  async function takePicture() {
    if (!cameraRef.current) return;

    const result = await cameraRef.current.takePictureAsync({
      quality: 0.7,
    });

    if (!result?.uri) return;

    setPhoto(result.uri);

    console.log("Photo URI:", result.uri);

    router.push({
      pathname: "/preview",
      params: {
        photoUri: result.uri,
      },
    });
  }

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>
          We need your permission to use the camera
        </Text>

        <TouchableOpacity
          style={styles.permissionButton}
          onPress={requestPermission}
        >
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFillObject}
        facing="back"
      />

      <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
        <Text style={styles.captureText}>Capture</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },

  permissionText: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
  },

  permissionButton: {
    backgroundColor: "#2563eb",
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 8,
  },

  permissionButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  captureButton: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    backgroundColor: "#ffffff",
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },

  captureText: {
    fontWeight: "bold",
  },
});
