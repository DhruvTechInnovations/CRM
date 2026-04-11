// import React, { useState } from 'react';
// import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';

// // to handle no click

// const PhoneNumberModal = ({ visible, onClose, phoneNumber }) => {
//   const[yesModal,setYesModal]=useState(false)
//   const[noModal,setNoModal]=useState(false)
//   const onNo=()=>{
//   setYesModal(true)
//   }

//   return (
//     <View>
//     <Modal
//       animationType="fade"
//       transparent={true}
//       visible={visible && !yesModal}
//       onRequestClose={onClose}
//     >
//       {visible &&<View style={styles.centeredView}>
//         <View style={styles.modalView}>
//           <Text style={styles.modalTitle}> Phone Number</Text>
//           <Text style={styles.phoneNumberText}>{phoneNumber}</Text>
//           <Text style={styles.modalSubtitle}>Do you want to accept this lead?</Text>

//           <View style={styles.buttonContainer}>
//             <TouchableOpacity style={[styles.modalButton, styles.yesButton]} onPress={onYes}>
//               <Text style={styles.buttonText}>Yes</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={[styles.modalButton, styles.noButton]} onPress={onNo}>
//               <Text style={styles.buttonText}>No</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>}
//     </Modal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   centeredView: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//   },
//   modalView: {
//     width: '80%',
//     backgroundColor: 'white',
//     borderRadius: 20,
//     padding: 35,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   modalTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   modalSubtitle: {
//     fontSize: 14,
//     color: '#666',
//     marginTop: 10,
//     textAlign: 'center',
//   },
//   phoneNumberText: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#007AFF', // A nice blue for the phone number
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     marginTop: 20,
//     gap: 10,
//   },
//   modalButton: {
//     borderRadius: 10,
//     padding: 12,
//     elevation: 2,
//     minWidth: 100,
//     alignItems: 'center',
//   },
//   yesButton: {
//     backgroundColor: '#48BB78',
//   },
//   noButton: {
//     backgroundColor: '#F56565',
//   },
//   buttonText: {
//     color: 'white',
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
// });

// export default PhoneNumberModal;
import { useState } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import PhoneNoModal from './PhoneNoModal';
import PhoneYesModal from './PhoneYesModal';
const PhoneNumberModal = ({ visible, onClose, phoneNumber }) => {
  const [yesModal, setYesModal] = useState(false);
  const [noModal, setNoModal] = useState(false);

  // State for the follow-up questions
  const [selectedOption, setSelectedOption] = useState('');
  const [otherText, setOtherText] = useState('');

  // Handle no click
  const onNo = () => {
    setNoModal(true);
    onClose(); // Close the main modal
  };

  // Handle yes click
  const onYes = () => {
    onClose(); //close the main modal
  };

  // Handle option selection
  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    if (option !== 'Other') {
      setOtherText(''); // Clear other text if not "Other"
    }
  };

  // Handle submit
  const handleSubmit = () => {
    const response = {
      phoneNumber: phoneNumber,
      option: selectedOption,
      otherDetails: selectedOption === 'Other' ? otherText : null,
    };


    // Your API call or logic here
    // Example: sendLeadResponse(response);

    // Close both modals
    setYesModal(false);
    setSelectedOption('');
    setOtherText('');
    onClose();
  };

  // Handle back from yes modal
  const handleBackToMain = () => {
    setYesModal(false);
    setSelectedOption('');
    setOtherText('');
  };

  return (
    <View>
      {/* Main Modal - Accept/Reject Lead */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={visible && !yesModal}
        onRequestClose={onClose}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Phone Number</Text>
            <Text style={styles.phoneNumberText}>{phoneNumber}</Text>
            <Text style={styles.modalSubtitle}>
              Do you want to accept this lead?
            </Text>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.yesButton]}
                onPress={onYes}
              >
                <Text style={styles.buttonText}>Yes</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.noButton]}
                onPress={onNo}
              >
                <Text style={styles.buttonText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Follow-up Modal - Lead Details */}
      <PhoneYesModal
        visible={yesModal}
        phoneNumber={phoneNumber}
        Close={() => { setYesModal(false) }}
      />

      <PhoneNoModal
        visible={noModal}
        phoneNumber={phoneNumber}
        Close={() => { setNoModal(false) }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  largeModal: {
    width: '90%',
    maxHeight: '80%',
    padding: 25,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 10,
    textAlign: 'center',
  },
  phoneNumberText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 10,
  },
  modalButton: {
    borderRadius: 10,
    padding: 12,
    elevation: 2,
    minWidth: 100,
    alignItems: 'center',
  },
  yesButton: {
    backgroundColor: '#48BB78',
  },
  noButton: {
    backgroundColor: '#F56565',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  questionText: {
    fontSize: 16,
    color: '#444',
    marginTop: 15,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: '500',
  },
  optionsContainer: {
    width: '100%',
    marginBottom: 20,
  },
  optionButton: {
    backgroundColor: '#F7FAFC',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },
  selectedOption: {
    backgroundColor: '#EBF8FF',
    borderColor: '#007AFF',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    color: '#4A5568',
    fontWeight: '500',
  },
  selectedOptionText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  textInputContainer: {
    width: '100%',
    marginTop: 10,
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: '#4A5568',
    marginBottom: 8,
    fontWeight: '500',
  },
  textInput: {
    backgroundColor: '#F7FAFC',
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    minHeight: 100,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    backgroundColor: '#E2E8F0',
  },
  backButtonText: {
    color: '#4A5568',
    fontWeight: '600',
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#48BB78',
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  disabledButton: {
    backgroundColor: '#CBD5E0',
    opacity: 0.6,
  },
});

export default PhoneNumberModal;