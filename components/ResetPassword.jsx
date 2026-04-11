// import React, { useState } from "react";
// import {
//   Modal,
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   Alert,
// } from "react-native";

// const ResetPassword = ({ visible, onClose }) => {
//   const [email, setEmail] = useState("");

//   const handleReset = () => {
//     const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

//     if (!email) {
//       Alert.alert("Error", "Please enter your email.");
//       return;
//     }
//     if (!gmailRegex.test(email)) {
//       Alert.alert("Error", "Please enter a valid Gmail address.");
//       return;
//     }

//     Alert.alert("Success", "Password reset link sent to your Gmail.");
//     onClose();
//   };

//   return (
//     <Modal visible={visible} transparent animationType="fade">
//       <View style={styles.overlay}>
//         <View style={styles.modalBox}>
//           <Text style={styles.title}>Reset Password</Text>
//           <Text style={styles.subtitle}>
//             Enter your registered Gmail address
//           </Text>

//           <TextInput
//             style={styles.input}
//             placeholder="Enter Gmail"
//             placeholderTextColor="#999"
//             keyboardType="email-address"
//             autoCapitalize="none"
//             value={email}
//             onChangeText={setEmail}
//           />

//           <TouchableOpacity style={styles.button} onPress={handleReset}>
//             <Text style={styles.buttonText}>Reset</Text>
//           </TouchableOpacity>

//           <TouchableOpacity onPress={onClose}>
//             <Text style={styles.cancelText}>Cancel</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </Modal>
//   );
// };

// const styles = StyleSheet.create({
//   overlay: {
//     flex: 1,
//     backgroundColor: "rgba(0, 0, 0, 0.5)",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   modalBox: {
//     width: "85%",
//     backgroundColor: "#fff",
//     borderRadius: 12,
//     padding: 20,
//     alignItems: "center",
//     elevation: 10,
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: "bold",
//     color: "#222",
//     marginBottom: 8,
//   },
//   subtitle: {
//     fontSize: 14,
//     color: "#666",
//     textAlign: "center",
//     marginBottom: 15,
//   },
//   input: {
//     width: "100%",
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 8,
//     padding: 10,
//     fontSize: 16,
//     marginBottom: 15,
//   },
//   button: {
//     width: "100%",
//     backgroundColor: "#007BFF",
//     paddingVertical: 12,
//     borderRadius: 8,
//     alignItems: "center",
//   },
//   buttonText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "600",
//   },
//   cancelText: {
//     marginTop: 10,
//     color: "#007BFF",
//     fontSize: 14,
//   },
// });

// export default ResetPassword;
