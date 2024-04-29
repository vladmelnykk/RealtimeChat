import EncryptedStorage from 'react-native-encrypted-storage';

async function set(key: string, object: object) {
  try {
    await EncryptedStorage.setItem(key, JSON.stringify(object));
  } catch (error) {
    console.log('secure.set error:' + error);
  }
}

async function get(key: string) {
  try {
    const data = await EncryptedStorage.getItem(key);
    if (data) return JSON.parse(data);
  } catch (error) {
    console.log('secure.get error:' + error);
  }
}

async function remove(key: string) {
  try {
    await EncryptedStorage.removeItem(key);
  } catch (error) {
    console.log('secure.remove error:' + error);
  }
}

async function wipe() {
  try {
    await EncryptedStorage.clear();
  } catch (error) {
    console.log('secure.wipe error:' + error);
  }
}

export default {set, get, remove, wipe};
