import React from 'react';
import {
  Modal,
  View,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';

interface Props {
  visible: boolean;
  user: any;
  onClose: () => void;
  onAccept: (userId: string) => void;
  onReject: (userId: string) => void;
}

const RequestDetailModal: React.FC<Props> = ({
  visible,
  user,
  onClose,
  onAccept,
  onReject,
}) => {
  console.log('user:', user);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPressOut={onClose}
        style={styles.modalContainer}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={styles.card}
          onPress={() => {}}
        >
          <Image
            source={{
              uri: user?.photoUrl
            }}
            style={styles.cardImageWide}
          />
          <Text style={styles.cardTitle}>
            {user?.firstName} {user?.lastName}
          </Text>
          {user?.description ? (
            <Text style={styles.cardDescription}>{user.description}</Text>
          ) : null}
          <Text style={styles.cardDetail}>Age: {user?.age}</Text>
          <Text style={styles.cardDetail}>Gender: {user?.gender}</Text>
          <Text style={styles.cardDetail}>
            Skills: {user?.skills?.join(', ') || 'None'}
          </Text>

          <View style={styles.cardActions}>
            <TouchableOpacity
              onPress={() => onReject(user._id)}
              style={styles.rejectBtn}
            >
              <Text style={styles.btnText}>Reject</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onAccept(user._id)}
              style={styles.acceptBtn}
            >
              <Text style={styles.btnText}>Accept</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={onClose}>
          <Text style={styles.closeOutsideText}>Close</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

export default RequestDetailModal;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  cardImageWide: {
    width: '90%',
    aspectRatio: 1,
    borderRadius: 16,
    marginBottom: 16,
    backgroundColor: '#eee',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: '#555',
    fontStyle: 'italic',
    marginBottom: 8,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  cardDetail: {
    fontSize: 14,
    marginBottom: 4,
  },
  cardActions: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 12,
  },
  acceptBtn: {
    backgroundColor: '#4caf50',
    padding: 10,
    borderRadius: 8,
  },
  rejectBtn: {
    backgroundColor: '#f44336',
    padding: 10,
    borderRadius: 8,
  },
  btnText: {
    color: 'white',
    fontWeight: '600',
  },
  closeOutsideText: {
    marginTop: 16,
    color: '#eee',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});
