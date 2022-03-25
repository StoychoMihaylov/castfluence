import React, { useContext, useReducer } from 'react';
import {
    Button,
    Text,
    View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CastfluenceContext, RootStackParams } from '../App';
import { ColorActionType, testReducer } from '../reducers/TestReducer';
import RecordAudioButton from '../components/audio_handler/RecordAudioButton';

const HomeScreen = () => {
    const context = useContext(CastfluenceContext);
    const [state, dispatch] = useReducer(testReducer, { color: "none" });
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParams>>();

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Home screen</Text>
            <Text>{ state.color }</Text>
            <RecordAudioButton />
            <Button title='blue' onPress={() => dispatch({ type: ColorActionType.CHANGE_COLOR_TO_BLUE, payload: 'blue' })}></Button>
            <Button title='black' onPress={() => dispatch({ type: ColorActionType.CHANGE_COLOR_TO_BLACK, payload: 'black' })}></Button>
            <Button
                title="Go to Profile"
                onPress={() => navigation.navigate('Profile')}
            />
            <Button
                title="Go to audio recorder"
                onPress={() => navigation.navigate('AudioRecorder')}
            />
            <Button
                title="Go to Page"
                onPress={() => navigation.navigate('Page')}
            />
        </View>
    );
};

export default HomeScreen;