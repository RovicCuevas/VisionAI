import * as FileSystem from "expo-file-system/legacy";

const GEMINI_KEY = process.env.EXPO_PUBLIC_GEMINI_KEY;

export async function imageToBase64(uri) {
  const base64 = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  return base64;
}

export { GEMINI_KEY };
