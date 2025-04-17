import axios from "axios";
import {
  CameraType,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import { useRef, useState } from "react";
import { Button, Pressable, StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { FontAwesome6, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function Camerapg() {
  const [permission, requestPermission] = useCameraPermissions();
  const ref = useRef<CameraView>(null);
  const [uri, setUri] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showCamera, setShowCamera] = useState(false);

  const employeeId = "12";
  const attendanceId = "429";

  const [facing, setFacing] = useState<CameraType>("back");

  if (!permission) {
    return null;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <View style={styles.permissionCard}>
          <Ionicons name="camera" size={48} color="#4F46E5" style={styles.icon} />
          <Text style={styles.permissionTitle}>Camera Access Needed</Text>
          <Text style={styles.permissionText}>
            We need your permission to use the camera for capturing images
          </Text>
          <TouchableOpacity 
            style={styles.permissionButton}
            onPress={requestPermission}
          >
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const takePicture = async () => {
    if (!ref.current) return;
    setIsCapturing(true);
    try {
      const photo = await ref.current.takePictureAsync();
      setUri(photo.uri);
    } catch (error) {
      console.error("Error taking picture:", error);
      alert("Failed to capture image");
    } finally {
      setIsCapturing(false);
    }
  };

  const handleUploadImage = async () => {
    if (!uri) return;
  
    setUploading(true);
    try {
      const formData = new FormData();
      const fetchResponse = await fetch(uri);
      const blob = await fetchResponse.blob();
      formData.append('image1', blob, 'captured_image.jpg');
  
      formData.append('employeeId', employeeId.toString());
      formData.append('attendanceId', attendanceId.toString());
  
      const response = await axios.post(
        'http://192.168.1.14:8080/api/images/uploadImage1',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
  
      console.log('Upload successful:', response.data);
      alert('Image uploaded successfully!');
      setUri(null);
      setShowCamera(false);
    } catch (error) {
      console.error('Upload error:', error);
      alert(`Upload failed: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };
  

  const toggleFacing = () => {
    setFacing((prev) => (prev === "back" ? "front" : "back"));
  };

  const renderHomeScreen = () => {
    return (
      <View style={styles.homeContainer}>
        <TouchableOpacity 
          style={styles.captureCard}
          onPress={() => setShowCamera(true)}
        >
          <View style={styles.captureCardContent}>
            <Ionicons name="camera" size={32} color="#4F46E5" />
            <Text style={styles.captureCardText}>Capture Image</Text>
          </View>
        </TouchableOpacity>


        <Text  onPress={() => router.push('/Image2Capture')} >cam</Text>

      </View>
    );
  };

  const renderCamera = () => {
    return (
      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          ref={ref}
          facing={facing}
        >
          <View style={styles.cameraControls}>
            <TouchableOpacity 
              style={styles.flipButton}
              onPress={toggleFacing}
            >
              <FontAwesome6 name="rotate" size={24} color="white" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.captureButton}
              onPress={takePicture}
              disabled={isCapturing}
            >
              <View style={styles.captureButtonOuter} />
              <View style={styles.captureButtonInner} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setShowCamera(false)}
            >
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </CameraView>
      </View>
    );
  };

  const renderPreview = () => {
    return (
      <View style={styles.previewContainer}>
        <View style={styles.previewContent}>
          <Text style={styles.previewTitle}>Preview</Text>
          
          <Image 
            source={{ uri }} 
            style={styles.previewImage}
          />
          
          <View style={styles.previewButtons}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.retakeButton]}
              onPress={() => setUri(null)}
              disabled={uploading}
            >
              <MaterialIcons name="replay" size={20} color="white" />
              <Text style={styles.buttonText}>Retake</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.uploadButton]}
              onPress={handleUploadImage}
              disabled={uploading}
            >
              {uploading ? (
                <Text style={styles.buttonText}>Uploading...</Text>
              ) : (
                <>
                  <Ionicons name="cloud-upload" size={20} color="white" />
                  <Text style={styles.buttonText}>Upload</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  if (!showCamera && !uri) {
    return renderHomeScreen();
  }

  return (
    <View style={styles.container}>
      {showCamera && !uri ? renderCamera() : null}
      {uri ? renderPreview() : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
  },
  permissionCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '90%',
  },
  permissionTitle: {
    fontSize: 22,
    fontWeight: '600',
    marginVertical: 10,
    color: '#111827',
  },
  permissionText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#6B7280',
    marginBottom: 20,
  },
  permissionButton: {
    backgroundColor: '#4F46E5',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  permissionButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  homeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  captureCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 25,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  captureCardContent: {
    alignItems: 'center',
  },
  captureCardText: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: '600',
    color: '#4F46E5',
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
  },
  cameraControls: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  flipButton: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  captureButtonOuter: {
    position: 'absolute',
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: 'white',
  },
  captureButtonInner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'white',
  },
  previewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 20,
  },
  previewContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  previewTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15,
    color: '#111827',
  },
  previewImage: {
    width: 300,
    height: 300,
    borderRadius: 12,
    marginVertical: 15,
    backgroundColor: '#F3F4F6',
  },
  previewButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 5,
  },
  retakeButton: {
    backgroundColor: '#EF4444',
  },
  uploadButton: {
    backgroundColor: '#4F46E5',
  },
  buttonText: {
    color: 'white',
    marginLeft: 8,
    fontWeight: '600',
  },
  icon: {
    marginBottom: 15,
  },
});