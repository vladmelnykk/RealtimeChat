import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import useStore from '../core/store/store';
import Thumbnail from '../components/common/Thumbnail';

const ProfileScreen = () => {
  const logout = useStore(state => state.logout);
  const user = useStore(state => state.user);
  const uploadThumbnail = useStore(state => state.uploadThumbnail);

  return (
    <View style={styles.screenContainer}>
      <TouchableOpacity
        onPress={async () => {
          const response = await launchImageLibrary({
            mediaType: 'photo',
            includeBase64: true,
          });
          if (response.didCancel) return;

          if (response.assets) {
            const file = response.assets[0];
            uploadThumbnail(file);
          }
        }}>
        <Thumbnail url={user?.thumbnail ? user.thumbnail : null} size={180} />
        <View style={styles.editIconContainer}>
          <FontAwesomeIcon icon={'pencil'} size={15} color={'#d0d0d0'} />
        </View>
      </TouchableOpacity>

      <Text style={styles.fullName}>{user?.name}</Text>
      <Text style={styles.username}>@{user?.username}</Text>
      <TouchableOpacity style={styles.btnContainer} onPress={logout}>
        <FontAwesomeIcon
          icon={'right-from-bracket'}
          color="#d0d0d0"
          size={20}
        />
        <Text style={styles.btnText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullName: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1b1b1b',
    marginTop: 20,
    marginBottom: 6,
  },
  username: {
    textAlign: 'center',
    fontSize: 14,
    color: '#606060',
  },
  btnContainer: {
    height: 52,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#202020',
    paddingHorizontal: 26,
    borderRadius: 26,
    marginTop: 30,
  },
  btnText: {
    color: '#d0d0d0',
    fontWeight: 'bold',
    marginLeft: 10,
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#202020',
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 26,
    borderColor: 'white',
    borderWidth: 3,
  },
});

export default ProfileScreen;
