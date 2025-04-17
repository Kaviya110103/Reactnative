import axios from "axios";
import { useLocalSearchParams } from "expo-router";
import {
  CameraType,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import { useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function UploadImageTimeout() {
  const { latestAttendanceId, employeeId, imageId, timeIn, timeOut } = useLocalSearchParams();

  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [uri, setUri] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [facing, setFacing] = useState<CameraType>("back");
  const [uploading, setUploading] = useState(false);

  if (!permission) return null;

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <View style={styles.permissionCard}>
          <Ionicons name="camera" size={48} color="#4F46E5" />
          <Text style={styles.permissionTitle}>Camera Access Needed</Text>
          <Text style={styles.permissionText}>
            We need your permission to use the camera for capturing images.
          </Text>
          <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const handleUpload = async () => {
    if (!uri) {
      Alert.alert("Error", "No image to upload.");
      return;
    }
  
    setUploading(true);
  
    try {
      const formData = new FormData();
      formData.append("image2", {
        uri: uri,
        name: `timeout_image_${Date.now()}.jpg`,
        type: "image/jpeg",
      } as any);
  
      const apiUrl = `http://192.168.1.14:8080/api/images/uploadImage2/${imageId}`;
  
      await axios.post(apiUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 15000,
      });
  
      Alert.alert("Success", "Image uploaded successfully!");
      setUri(null);
    } catch (error: any) {
      console.error("Upload error:", error);
  
      if (error.response?.data) {
        console.log("Server responded with:", error.response.data);
      }
  
      if (error.code === 'ECONNABORTED') {
        Alert.alert("Timeout", "Image upload timed out.");
      } else {
        Alert.alert("Error", "Failed to upload image.");
      }
    } finally {
      setUploading(false);
    }
  };
  
  
  const handleCapture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        setUri(photo.uri);
        setShowCamera(false);
      } catch (error) {
        console.error("Camera error:", error);
        Alert.alert("Error", "Failed to take picture.");
      }
    }
  };

  const renderDetails = () => (
    <View style={styles.detailsContainer}>
      <Text style={styles.detailsText}>Latest Attendance ID: {latestAttendanceId}</Text>
      <Text style={styles.detailsText}>Employee ID: {employeeId}</Text>
      <Text style={styles.detailsText}>Image ID: {imageId}</Text>
      <Text style={styles.detailsText}>Time In: {timeIn}</Text>
      <Text style={styles.detailsText}>Time Out: {timeOut}</Text>
    </View>
  );

  const renderCamera = () => (
    <CameraView
      style={{ flex: 1 }}
      ref={cameraRef}
      facing={facing}
    >
      <View style={styles.cameraControls}>
        <TouchableOpacity
          style={styles.flipButton}
          onPress={() => setFacing(facing === "back" ? "front" : "back")}
        >
          <Ionicons name="camera-reverse" size={32} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.captureButton} onPress={handleCapture}>
          <View style={styles.captureButtonOuter} />
          <View style={styles.captureButtonInner} />
        </TouchableOpacity>
      </View>
    </CameraView>
  );

  if (showCamera) {
    return <View style={{ flex: 1 }}>{renderCamera()}</View>;
  }

  if (uri) {
    return (
      <View style={styles.container}>
        {renderDetails()}
        <Image source={{ uri }} style={styles.capturedImage} />
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.retakeButton} onPress={() => setUri(null)}>
            <Text style={styles.buttonText}>Retake</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={handleUpload}
            disabled={uploading}
          >
            {uploading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Upload</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderDetails()}
      <TouchableOpacity style={styles.captureCard} onPress={() => setShowCamera(true)}>
        <View style={styles.captureCardContent}>
          <Ionicons name="camera" size={32} color="#4F46E5" />
          <Text style={styles.captureCardText}>Capture Image</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    padding: 20,
  },
  detailsContainer: {
    marginBottom: 20,
  },
  detailsText: {
    fontSize: 16,
    marginBottom: 10,
    color: "#111827",
  },
  capturedImage: {
    width: "100%",
    height: 300,
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  retakeButton: {
    backgroundColor: "#DC3545",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  uploadButton: {
    backgroundColor: "#28A745",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  captureCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 25,
    width: "80%",
    alignItems: "center",
    alignSelf: "center",
    shadowColor: "#4F46E5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  captureCardContent: {
    alignItems: "center",
  },
  captureCardText: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "600",
    color: "#4F46E5",
  },
  cameraControls: {
    position: "absolute",
    bottom: 40,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  flipButton: {
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 10,
    borderRadius: 50,
  },
  captureButton: {
    alignSelf: "center",
  },
  captureButtonOuter: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "white",
    opacity: 0.5,
  },
  captureButtonInner: {
    position: "absolute",
    top: 10,
    left: 10,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "white",
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  permissionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 30,
    alignItems: "center",
    elevation: 5,
  },
  permissionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4F46E5",
    marginVertical: 10,
  },
  permissionText: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 20,
  },
  permissionButton: {
    backgroundColor: "#4F46E5",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
