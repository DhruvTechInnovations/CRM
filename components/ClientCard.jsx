import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import PhoneNumberModal from './PhoneModal'; // Import the new modal component

const ClientCard = ({ client, isExpanded, onPress, onYes, onNo }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const maskedPhoneNumber = `+91 ******${client.phone.slice(-4)}`;

  const handleYes = () => {
    setIsModalVisible(false);
    onYes(client.id);
  };
  
  const handleNo = () => {
    setIsModalVisible(false);
    onNo(client.id);
  };

  return (
    <TouchableOpacity onPress={onPress} style={styles.clientCard}>
      <View style={styles.clientHeader}>
        <Text style={styles.clientName}>{client.name}</Text>
        <Text style={styles.clientDetail}>📍 {client.location}</Text>
      </View>

      {isExpanded && (
        <View style={styles.expandedContent}>
          <TouchableOpacity onPress={() => setIsModalVisible(true)}>
            <Text style={[styles.clientDetail, styles.phoneNumberMasked]}>
              📱 {maskedPhoneNumber}
            </Text>
          </TouchableOpacity>

          <Text style={styles.clientDetail}>🏛️ {client.court}</Text>
          <Text style={styles.clientDetail}>📅 **Date:** {client.date}</Text>
          <Text style={styles.clientDetail}>🟢 **Status:** {client.status}</Text>
        </View>
      )}

      <PhoneNumberModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        phoneNumber={client.phone}
        onYes={handleYes}
        onNo={handleNo}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  clientCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  clientHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  clientName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A202C',
  },
  clientDetail: {
    fontSize: 14,
    color: '#4A5568',
    marginTop: 4,
  },
  phoneNumberMasked: {
    color: '#007AFF',
    textDecorationLine: 'underline',
  },
  expandedContent: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
});

export default ClientCard;