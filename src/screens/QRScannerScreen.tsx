/* eslint-disable react-native/no-inline-styles */
/* eslint-disable jsx-quotes */
import {StackNavigationProp} from '@react-navigation/stack';
import React from 'react';
import {Alert} from 'react-native';
import {Camera, CameraType} from 'react-native-camera-kit';
import {RootStackParamList} from '../../App';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Main'>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

const QRScannerScreen: React.FC<HomeScreenProps> = ({navigation}) => {
  return (
      <Camera
        cameraType={CameraType.Back}
        flashMode="auto"
        scanBarcode={true}
        style={{flex:1}}
        onReadCode={event => {
          Alert.alert('QR code found', event.nativeEvent.codeStringValue);
          navigation.navigate('RestaurantDetails');
        }}
        showFrame={true}
        laserColor="#28a745"
        frameColor="#28a745"
      />
  );
};

export default QRScannerScreen;
