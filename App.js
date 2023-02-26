import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  FlatList,
  Image,
  PermissionsAndroid,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import RNFS from 'react-native-fs';
const App = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [folderName, setFolderName] = useState('');
  const [fileName, setFilerName] = useState('');
  const [currentPath, setCurrentPath] = useState(RNFS.DocumentDirectoryPath);
  const [folders, setFolders] = useState([]);
  const requestStoragePermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: ' App Storage Permission',
          message:
            'App needs access to your Storage ' +
            'so you can take create folders',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the storage');
        getAllFolders(currentPath);
      } else {
        console.log('Storage permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };
  useEffect(() => {
    requestStoragePermission();
  }, []);
  const getAllFolders = path => {
    RNFS.readDir(path) // On Android, use "RNFS.DocumentDirectoryPath" (MainBundlePath is not defined)
      .then(result => {
        console.log('GOT RESULT', result);
        setFolders(result);
      })

      .catch(err => {
        console.log(err.message, err.code);
      });
  };
  const isFolder = name => {
    let itsFolder = name.includes('.');
    return itsFolder;
  };
  const createFolder = () => {
    RNFS.mkdir(currentPath + '/' + folderName)
      .then(res => {
        getAllFolders(currentPath);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const createFile = () => {
    RNFS.writeFile(currentPath + '/' + fileName + '.txt', 'hello how are you')
      .then(res => {
        getAllFolders(currentPath);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const deleteDir = path => {
    RNFS.unlink(path)
      .then(res => {
        getAllFolders(currentPath);
      })
      .catch(error => {
        console.log(error);
      });
  };
  return (
    <View style={{flex: 1}}>
      <View style={{width: '100%', flexDirection: 'row', margin: 20}}>
        {currentPath == RNFS.DocumentDirectoryPath ? null : (
          <Text
            style={{fontWeight: '700'}}
            onPress={() => {
              setCurrentPath(RNFS.DocumentDirectoryPath);
              getAllFolders(RNFS.DocumentDirectoryPath);
            }}>
            Back
          </Text>
        )}
        <Text style={{marginLeft: 20}}>{currentPath}</Text>
      </View>
      <View style={{marginTop: 50}}>
        <FlatList
          data={folders}
          numColumns={2}
          renderItem={({item, index}) => {
            return (
              <TouchableOpacity
                style={{
                  width: '50%',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 100,
                }}
                onPress={() => {
                  if (!isFolder(item.name)) {
                    setCurrentPath(currentPath + '/' + item.name);
                    getAllFolders(currentPath + '/' + item.name);
                  }
                }}
                onLongPress={() => {
                  deleteDir(item.path);
                }}>
                {isFolder(item.name) ? (
                  <View
                    style={{
                      width: '50%',
                      height: '50%',
                      backgroundColor: '#C9C9C9',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: 10,
                    }}>
                    <Text>file</Text>
                  </View>
                ) : (
                  <Image
                    source={require('./images/open-folder.png')}
                    style={{width: 50, height: 50}}
                  />
                )}
                <Text>
                  {item.name.length > 20
                    ? item.name.substring(0, 10) + '...'
                    : item.name}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>
      <TouchableOpacity
        style={{
          position: 'absolute',
          right: 20,
          bottom: 50,
          backgroundColor: '#000',
          width: 50,
          height: 50,
          borderRadius: 25,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={() => {
          setModalVisible(true);
        }}>
        <Text style={{color: '#fff', fontSize: 30}}>+</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          position: 'absolute',
          right: 20,
          bottom: 130,
          backgroundColor: '#000',
          width: 50,
          height: 50,
          borderRadius: 25,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={() => {
          setModalVisible2(true);
        }}>
        <Text style={{color: '#fff', fontSize: 30}}>cf</Text>
      </TouchableOpacity>

      <Modal
        transparent
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}>
        <View
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              backgroundColor: '#fff',
              width: '90%',
              height: 200,
              borderRadius: 10,
            }}>
            <TextInput
              placeholder="Enter Folder Name"
              value={folderName}
              onChangeText={txt => setFolderName(txt)}
              style={{
                width: '90%',
                height: 50,
                borderWidth: 1,
                alignSelf: 'center',
                marginTop: 50,
                paddingLeft: 20,
                borderRadius: 10,
              }}
            />
            <TouchableOpacity
              style={{
                marginTop: 20,
                alignSelf: 'center',
                width: '90%',
                height: 50,
                borderRadius: 10,
                backgroundColor: '#000',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => {
                setModalVisible(false);
                createFolder();
              }}>
              <Text style={{color: '#fff', fontSize: 18}}>Create Folder</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        transparent
        visible={modalVisible2}
        onRequestClose={() => {
          setModalVisible2(false);
        }}>
        <View
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              backgroundColor: '#fff',
              width: '90%',
              height: 200,
              borderRadius: 10,
            }}>
            <TextInput
              placeholder="Enter File Name"
              value={fileName}
              onChangeText={txt => setFilerName(txt)}
              style={{
                width: '90%',
                height: 50,
                borderWidth: 1,
                alignSelf: 'center',
                marginTop: 50,
                paddingLeft: 20,
                borderRadius: 10,
              }}
            />
            <TouchableOpacity
              style={{
                marginTop: 20,
                alignSelf: 'center',
                width: '90%',
                height: 50,
                borderRadius: 10,
                backgroundColor: '#000',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => {
                setModalVisible2(false);
                createFile();
              }}>
              <Text style={{color: '#fff', fontSize: 18}}>Create File</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default App;
