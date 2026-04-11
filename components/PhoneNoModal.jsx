import { useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
const PhoneNoModal = ({ visible, phoneNumber, Close }) => {
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
    // setYesModal(false)
    setSelectedOption('');
    setOtherText('');
    Close();
  };

  // Handle back from yes modal
  const handleBackToMain = () => {
    // setYesModal(false);
    setSelectedOption('');
    setOtherText('');
  };
  const [selectedOption, setSelectedOption] = useState('');
  const [otherText, setOtherText] = useState('');
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={handleBackToMain}
    >
      <View style={styles.centeredView}>
        <View style={[styles.modalView, styles.largeModal]}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.modalTitle}>Lead Details</Text>
            <Text style={styles.phoneNumberText}>{phoneNumber}</Text>

            <Text style={styles.questionText}>
              What's the next step for this lead?
            </Text>

            {/* Options */}
            <View style={styles.optionsContainer}>
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  selectedOption === 'Wrong Number' && styles.selectedOption
                ]}
                onPress={() => handleOptionSelect('Wrong Number')}
              >
                <View style={styles.optionContent}>
                  <Text style={[
                    styles.optionText,
                    selectedOption === 'Wrong Number' && styles.selectedOptionText
                  ]}>
                    💼 Wrong Number
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.optionButton,
                  selectedOption === 'No Response' && styles.selectedOption
                ]}
                onPress={() => handleOptionSelect('No Response')}
              >
                <View style={styles.optionContent}>
                  <Text style={[
                    styles.optionText,
                    selectedOption === 'No Response' && styles.selectedOptionText
                  ]}>
                    📅 No Response
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.optionButton,
                  selectedOption === 'Not Interested' && styles.selectedOption
                ]}
                onPress={() => handleOptionSelect('Not Interested')}
              >
                <View style={styles.optionContent}>
                  <Text style={[
                    styles.optionText,
                    selectedOption === 'NotInterested' && styles.selectedOptionText
                  ]}>
                    📞 Not Interested
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.optionButton,
                  selectedOption === 'Other' && styles.selectedOption
                ]}
                onPress={() => handleOptionSelect('Other')}
              >
                <View style={styles.optionContent}>
                  <Text style={[
                    styles.optionText,
                    selectedOption === 'Other' && styles.selectedOptionText
                  ]}>
                    ✏️ Other
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Text Input for "Other" */}
            {selectedOption === 'Other' && (
              <View style={styles.textInputContainer}>
                <Text style={styles.inputLabel}>Please specify:</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter details..."
                  value={otherText}
                  onChangeText={setOtherText}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>
            )}

            {/* Action Buttons */}
            <View style={styles.actionButtonsContainer}>
              {/* <TouchableOpacity
                  style={[styles.actionButton, styles.backButton]}
                  onPress={handleBackToMain}
                >
                  <Text style={styles.backButtonText}>Back</Text>
                </TouchableOpacity> */}

              <TouchableOpacity
                style={[
                  styles.actionButton,
                  styles.submitButton,
                  !selectedOption && styles.disabledButton
                ]}
                onPress={handleSubmit}
                disabled={!selectedOption || (selectedOption === 'Other' && !otherText.trim())}
              >
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  )
}
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

export default PhoneNoModal