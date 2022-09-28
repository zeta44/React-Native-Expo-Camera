import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  Image,
} from "react-native";
import { Camera } from "expo-camera";
import { FontAwesome } from "@expo/vector-icons";

export default function App() {
  const camRef = useRef(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [hasPermission, setHasPermission] = useState(null);
  const [capturadPhoto, setCapturadPhoto] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }

  if (hasPermission === false) {
    return <Text>Access denied</Text>;
  }

  async function takePicture() {
    if (camRef) {
      const data = await camRef.current.takePictureAsync();
      setCapturadPhoto(data.uri);
      setOpen(true);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Camera style={styles.camera} type={type} ref={camRef}>
        <View style={styles.contentButtons}>
          <TouchableOpacity
            style={styles.buttonFlip}
            onPress={() => {
              setType(
                type === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back
              );
            }}
          >
            <FontAwesome name="exchange" size={30} color="black"></FontAwesome>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonCamera} onPress={takePicture}>
            <FontAwesome name="camera" size={30} color="#ffffff"></FontAwesome>
          </TouchableOpacity>
        </View>
      </Camera>
      {capturadPhoto && (
        <Modal animationType="slide" transparent={true} visible={open}>
          <View style={styles.contentModal}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                setOpen(false);
              }}
            >
              <FontAwesome name="close" size={50} color="#fff"></FontAwesome>
            </TouchableOpacity>

            <Image
              style={styles.imagePhoto}
              source={{ uri: capturadPhoto }}
            />
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  camera: {
    width: "100%",
    height: "100%",
  },
  contentButtons: {
    flex: 1,
    backgroundColor: "transparent",
    flexDirection: "row",
  },
  buttonFlip: {
    position: "absolute",
    bottom: "3%",
    right: "30%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    margin: 20,
    height: 50,
    width: 50,
    borderRadius: 50,
    opacity: 0.6,
  },
  buttonCamera: {
    position: "absolute",
    bottom: "3%",
    left: "30%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    margin: 20,
    height: 50,
    width: 50,
    borderRadius: 50,
    opacity: 0.6,
  },
  contentModal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-end",
    margin: 20,
  },
  closeButton:{
    position: "absolute",
    top: "3%",
    left: "3%",
    margin: 10,
    borderRadius: 50,
  },
  imagePhoto: {
    width: "100%",
    height: 400
  }
});
