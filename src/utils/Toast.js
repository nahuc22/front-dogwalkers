import { Text, View } from 'react-native';
import { BaseToast, ErrorToast } from 'react-native-toast-message';
import { Image } from 'react-native'

export const toastConfig = {

  success: (props) => (
    <BaseToast
        {...props}
    style={{ backgroundColor: 'red' , border: 20 , borderColor: 'white'}}
    text1Style={{
      fontSize: 17,
      color: 'white'
    }}
    text2Style={{
      fontSize: 15
    }}
    />
  ),

  
  error: (props) => (
      <ErrorToast
      {...props}
      style={{ borderLeftColor: 'red', backgroundColor: 'white' }}
      contentContainerStyle={{ paddingHorizontal: 20 }}
      text1Style={{
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black'
      }}
    />
  ),
        register: (props) => 
        <BaseToast
        {...props}
        style={{ borderLeftColor: 'blue', backgroundColor: 'white' }}
        contentContainerStyle={{ paddingHorizontal: 20 }}
        text1Style={{
            fontSize: 20,
            fontWeight: 'bold',
            color: 'black'
        }}
        />,

  tomatoToast: ({ text1, props }) => (
    <View style={{ height: 60, width: '75%', backgroundColor: 'red', borderRadius: 10 }}>
      <Text style={{color: 'white', left: 75 , }}>{text1}</Text>
      <Text>{props.uuid}</Text>
    </View>
  )
};
