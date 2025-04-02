import axios from "axios";
import {
  CameraType,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import { useRef, useState } from "react";
import { Button, Pressable, StyleSheet, Text, View, Image, Modal, TouchableOpacity } from "react-native";
import { FontAwesome6, Ionicons, MaterialIcons } from "@expo/vector-icons";

export default function Image2Capture() {
  const [permission, requestPermission] = useCameraPermissions();
  const ref = useRef<CameraView>(null);
  const [uri, setUri] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [facing, setFacing] = useState<CameraType>("back"); // Changed to CameraType

  const imageId = 427; // Replace with the actual imageId you want to use

  if (!permission) {
    return <View style={styles.container} />; // Return empty view while waiting for permission
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <View style={styles.permissionCard}>
          <Ionicons name="camera" size={48} color="#4F46E5" style={styles.icon} />
          <Text style={styles.permissionTitle}>Camera Access Needed</Text>
          <Text style={styles.permissionText}>
            We need your permission to use the camera for capturing TimeOut image
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
      setShowCamera(false); // Close camera after taking picture
    } catch (error) {
      console.error("Error taking picture:", error);
      alert("Failed to capture image");
    } finally {
      setIsCapturing(false);
    }
  };

  const handleUploadImage2 = async () => {
    if (!uri || !imageId) {
      alert("Please capture an image first.");
      return;
    }
  
    setUploading(true);
    try {
      // 1. Get the image file
      const response = await fetch(uri);
      const blob = await response.blob();
  
      // 2. Create FormData
      const formData = new FormData();
      formData.append('image2', blob, `image2_${Date.now()}.jpg`);
  
      // 3. Verify your endpoint URL
      const apiUrl = `http://192.168.1.24:8080/api/images/uploadImage2/${imageId}`;
      console.log('Attempting upload to:', apiUrl);
  
      // 4. Make the request
      const uploadResponse = await axios.post(apiUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        transformRequest: (data) => data, // Bypass Axios automatic transform
      });
  
      console.log('Upload success:', uploadResponse.data);
      alert('Upload successful!');
      setUri(null);
    } catch (error) {
      console.error('Full upload error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: error.config
      });
      
      alert(`Upload failed: ${error.message || 'Unknown error'}`);
    } finally {
      setUploading(false);
    }
  };

  const toggleFacing = () => {
    setFacing((prev) => (prev === "back" ? "front" : "back"));
  };

  const renderHomeScreen = () => {
    return (
      <View style={styles.container}>
        <TouchableOpacity 
          style={styles.captureCard}
          onPress={() => setShowCamera(true)}
        >
          <View style={styles.captureCardContent}>
            <Ionicons name="camera" size={32} color="#4F46E5" />
            <Text style={styles.captureCardText}>Capture TimeOut Image</Text>
          </View>
        </TouchableOpacity>
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
              onPress={() => {
                setShowCamera(false);
                setUri(null);
              }}
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
          <Text style={styles.previewTitle}>TimeOut Image Preview</Text>
          
          <Image 
            source={{ uri }} 
            style={styles.previewImage}
            resizeMode="contain"
          />
          
          <View style={styles.previewButtons}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.retakeButton]}
              onPress={() => {
                setUri(null);
                setShowCamera(true);
              }}
              disabled={uploading}
            >
              <MaterialIcons name="replay" size={20} color="white" />
              <Text style={styles.buttonText}>Retake</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.uploadButton]}
              onPress={handleUploadImage2}
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  permissionCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    width: '90%',
  },
  icon: {
    marginBottom: 15,
  },
  permissionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  permissionText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  permissionButton: {
    backgroundColor: '#4F46E5',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  captureCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  captureCardContent: {
    alignItems: 'center',
  },
  captureCardText: {
    marginTop: 10,
    fontSize: 18,
    color: '#4F46E5',
    fontWeight: '500',
  },
  cameraContainer: {
    flex: 1,
    width: '100%',
  },
  camera: {
    flex: 1,
  },
  cameraControls: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  flipButton: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 15,
    borderRadius: 50,
  },
  closeButton: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 15,
    borderRadius: 50,
  },
  captureButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureButtonOuter: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255,255,255,0.3)',
    position: 'absolute',
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
    backgroundColor: '#f5f5f5',
  },
  previewContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  previewImage: {
    width: '100%',
    height: 300,
    borderRadius: 8,
    marginBottom: 20,
  },
  previewButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
  },
  retakeButton: {
    backgroundColor: '#6B7280',
  },
  uploadButton: {
    backgroundColor: '#4F46E5',
  },
  buttonText: {
    color: 'white',
    marginLeft: 8,
    fontWeight: '500',
  },
});