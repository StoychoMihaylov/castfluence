import React, { useState  } from 'react';
import {
    Button,
    Platform,
    Text,
    View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParams } from '../../App';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';

interface RecordState {
  recordSecs: number;
  recordTime: string;
}

interface PlayerState {
  currentPositionSec: number;
  currentDurationSec: number;
  playTime: string;
  duration: string;
}

const AudioRecorder = () => {
  const [recordState, setRecordState] = useState<RecordState>();
  const [playerState, setPlayerState] = useState<PlayerState>();

  const navitation = useNavigation<NativeStackNavigationProp<RootStackParams>>();
  const audioRecorderPlayer = new AudioRecorderPlayer();

  const onStartRecord = async () => {
    const url = await audioRecorderPlayer.startRecorder();

    audioRecorderPlayer.addRecordBackListener((e) => {
      setRecordState({
        recordSecs: e.currentPosition,
        recordTime: audioRecorderPlayer.mmssss(Math.floor(e.currentPosition),),
      });
    });

    console.log(url);
  };

  const onStopRecord = async () => {
    const result = await audioRecorderPlayer.stopRecorder();
    audioRecorderPlayer.removeRecordBackListener();
    setRecordState({
      recordSecs: 0,
      recordTime: ''
    });
    console.log(result);
  };

  const onStartPlay = async () => {
    const message = await audioRecorderPlayer.startPlayer();
    console.log(message);
    audioRecorderPlayer.addPlayBackListener((e) => {
      setPlayerState({
        currentPositionSec: e.currentPosition,
        currentDurationSec: e.duration,
        playTime: audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)),
        duration: audioRecorderPlayer.mmssss(Math.floor(e.duration)),
      });
      return;
    });
  };

  const onPausePlay = async () => {
    await audioRecorderPlayer.pausePlayer();
  };

  const onStopPlay = async () => {
    audioRecorderPlayer.stopPlayer();
    audioRecorderPlayer.removePlayBackListener();
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Audio Recorder</Text>

        <Button
            title="Start record"
            onPress={() => onStartRecord()}
        />

        <Button
            title="Stop record"
            onPress={() => onStopRecord()}
        />

        <Button
            title="Play"
            onPress={() => onStartPlay()}
        />

        <Button
            title="Pause"
            onPress={() => onPausePlay()}
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
    </View>
  )
};

export default AudioRecorder;