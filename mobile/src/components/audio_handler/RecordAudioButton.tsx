import axios from 'axios';
import React, {Component} from 'react';
import {
    Image,
    PermissionsAndroid,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
} from 'react-native';
import AudioRecorderPlayer, {
    AVEncoderAudioQualityIOSType,
    AVEncodingOption,
    AudioEncoderAndroidType,
    AudioSet,
    AudioSourceAndroidType,
    RecordBackType,
} from 'react-native-audio-recorder-player';

interface State {
    recordSecs: number;
    recordTime: string;
    currentPositionSec: number;
    currentDurationSec: number;
    playTime: string;
    duration: string;
}

class RecordAudioButton extends Component<any, State> {
    private audioRecorderPlayer: AudioRecorderPlayer;

    constructor(props: any) {
        super(props);
        this.state = {
            recordSecs: 0,
            recordTime: '00:00:00',
            currentPositionSec: 0,
            currentDurationSec: 0,
            playTime: '00:00:00',
            duration: '00:00:00',
        };

        this.audioRecorderPlayer = new AudioRecorderPlayer();
        this.audioRecorderPlayer.setSubscriptionDuration(0.1); // optional. Default is 0.5
    }

    private onStartRecord = async () => {
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

        // Default path
        const uri = await this.audioRecorderPlayer.startRecorder(
            undefined,
            audioSet,
        );

        this.audioRecorderPlayer.addRecordBackListener((event: RecordBackType) => {
          console.log('record-back', event);
          this.setState({
              recordSecs: event.currentPosition,
              recordTime: this.audioRecorderPlayer.mmssss(Math.floor(event.currentPosition),),
          });
        });

        console.log(`uri: ${uri}`);
    };

    private onStopRecord = async () => {
        const result = await this.audioRecorderPlayer.stopRecorder();
        this.audioRecorderPlayer.removeRecordBackListener();
        this.setState({
            recordSecs: 0,
        });

        console.log(result);

        const formData = new FormData()
        formData.append('file', {
            uri: result,
            name: 'sound.mp4',
            type: 'audio/mp4',
        })

        try {
            const res = await axios.post('https://10.0.0.236:49157/upload/audio', formData);
            console.log(res);
        } catch (err) {
            console.warn(err);
        }

        try {
            const res = await axios.get('https://10.0.0.236:49157/upload/audio');
            console.log(res)
        } catch (err) {
            console.warn(err);
        }
    };

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <TouchableWithoutFeedback
                    onLongPress={() => this.onStartRecord()}
                    onPressOut={() => this.onStopRecord()}
                >
                    <Image style={styles.mic} source={require('../../../assets/icons/mic-icon.png')} />
                </TouchableWithoutFeedback>

                <Text adjustsFontSizeToFit={true} style={styles.recordTime} >{this.state.recordTime}</Text>
            </SafeAreaView>
      );
    }
}

const styles: any = StyleSheet.create({
    container: {
        height: 70,
        width: 70,
        borderRadius: 70/2,
        textAlign: 'center',
        overflow: 'hidden',
        borderWidth: 3,
        borderColor: 'lightblue',
        justifyContent: 'center'
    },
    mic: {
        height: 35,
        width: 25,
        marginLeft: 18
    },
    recordTime: {
        marginLeft: 11,
        fontSize: 11
    }
});

export default RecordAudioButton;

