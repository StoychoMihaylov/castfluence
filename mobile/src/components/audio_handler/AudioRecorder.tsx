import React, { useReducer } from 'react';
import {
    Button,
    PermissionsAndroid,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParams } from '../../App';
import AudioRecorderPlayer, {
  AudioEncoderAndroidType,
  AudioSet,
  AudioSourceAndroidType,
  AVEncoderAudioQualityIOSType,
  AVEncodingOption
} from 'react-native-audio-recorder-player';

interface RecordState {
  recordSecs: number;
  recordTime: string;
  currentPositionSec: number;
  currentDurationSec: number;
  playTime: string;
  duration: string;
}

const AudioRecorder = () => {

  const navitation = useNavigation<NativeStackNavigationProp<RootStackParams>>();
  const audioRecorderPlayer = new AudioRecorderPlayer();
  audioRecorderPlayer.setSubscriptionDuration(0.1);

  const [recordState, setRecordState] = useReducer(
    (state: RecordState, newState: Partial<RecordState>) => ({
    ...state,
    ...newState,
    }),
    {
      recordSecs: 0,
      recordTime: '00:00:00',
      currentPositionSec: 0,
      currentDurationSec: 0,
      playTime: '00:00:00',
      duration: '00:00:00',
    }
  );

  const onStartRecord = async () => {
    if (Platform.OS === 'android') {
      try {
        const grants = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        ]);

        console.log('write external stroage', grants);

        if (
          grants['android.permission.WRITE_EXTERNAL_STORAGE'] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          grants['android.permission.READ_EXTERNAL_STORAGE'] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          grants['android.permission.RECORD_AUDIO'] ===
            PermissionsAndroid.RESULTS.GRANTED
        ) {
          console.log('permissions granted');
        } else {
          console.log('All required permissions not granted');
          return;
        }
      } catch (err) {
        console.warn(err);
        return;
      }
    }

    const audioSet: AudioSet = {
      AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
      AudioSourceAndroid: AudioSourceAndroidType.MIC,
      AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
      AVNumberOfChannelsKeyIOS: 2,
      AVFormatIDKeyIOS: AVEncodingOption.aac,
    };

    const url = await audioRecorderPlayer.startRecorder(undefined, audioSet);

    audioRecorderPlayer.addRecordBackListener((event) => {
      setRecordState({
        recordSecs: event.currentPosition,
        recordTime: audioRecorderPlayer.mmssss(Math.floor(event.currentPosition),),
      });
    });

    console.log(url);
  };

  const onStopRecord = async () => {
    const result = await audioRecorderPlayer.stopRecorder();

    audioRecorderPlayer.removeRecordBackListener();
    setRecordState({
      recordSecs: 0
    });

    console.log(result);
  };

  const onStartPlay = async () => {
    const message = await audioRecorderPlayer.startPlayer();
    const volume = await audioRecorderPlayer.setVolume(1.0);
    console.log(`file: ${message}`, `volume: ${volume}`);

    audioRecorderPlayer.addPlayBackListener((event) => {
      setRecordState({
        currentPositionSec: event.currentPosition,
        currentDurationSec: event.duration,
        playTime: audioRecorderPlayer.mmssss(Math.floor(event.currentPosition)),
        duration: audioRecorderPlayer.mmssss(Math.floor(event.duration)),
      });
    });
  };

  const onStopPlay = async () => {
    audioRecorderPlayer.stopPlayer();
    audioRecorderPlayer.removePlayBackListener();
    console.log('Play stopped')
  };

  return (
    <SafeAreaView style={styles.container}>
        <Text>Audio Recorder</Text>

        <Text style={styles.txtRecordCounter}>{recordState.recordTime}</Text>
        <TouchableWithoutFeedback
                onLongPress={() => onStartRecord()}
                onPressOut={() => onStopRecord()}
        >
          <View>
              <Text>RECORD</Text>
          </View>
        </TouchableWithoutFeedback>

        <Button
            title="Start Record"
            onPress={() => onStartRecord()}
        />

        <Button
            title="Stop Record"
            onPress={() => onStopRecord()}
        />

        <Button
            title="Play"
            onPress={() => onStartPlay()}
        />

        <Button
            title="Stop"
            onPress={() => onStopPlay()}
        />

        <Button
            title="Go to Profile"
            onPress={() => navitation.navigate('Profile')}
        />
        <Button
            title="Go to Home"
            onPress={() => navitation.navigate('Home')}
        />
    </SafeAreaView>
  )
};

const styles: any = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#455A64',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  txtRecordCounter: {
    marginTop: 32,
    color: 'white',
    fontSize: 20,
    textAlignVertical: 'center',
    fontWeight: '200',
    fontFamily: 'Helvetica Neue',
    letterSpacing: 3,
  },
})

export default AudioRecorder;