// React - Native
import React, {  useState  } from 'react';
import { View, Alert } from 'react-native';
import { scale } from 'react-native-size-matters';
import { useNavigation } from '@react-navigation/native';
import { Image } from 'react-native';
import  { MaterialIcons }  from '@expo/vector-icons';
// Redux
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../redux/actions/users/userAction.jsx'
// Components
import Label from '../components/Label.jsx'
import CustomInput from '../components/CustomInput'; 
import Container from '../components/Container.jsx';
import CustomButton from '../components/CustomButton.jsx';
import BackButton from '../components/BackButton.jsx';
// Utils
import { appColors } from '../utils/appColors.js';

export default function Login({ route, setIsLoggedIn }) {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { isAuthenticated, loading } = useSelector((state) => state.user);
  const userType = route.params?.userType || 'owner'; // Default a 'owner' si no viene

    const [formValues, setFormValues] = useState({
      email: '',
      password: '',
    });

    

    const handleInputChange = (name, value) => {
      setFormValues({ ...formValues, [name]: value });
    };
    const fields = [

      {
        name: "email",
        placeholder: "Email",
      },
      {
        name:"password",
        placeholder: "Password",
        secureTextEntry: true
      }
    ]
    
    const handleLogin = async () => {
      try {
        console.log('Form values antes de enviar:', formValues);
        const result = await dispatch(login({ 
          email: formValues.email.trim(), 
          password: formValues.password.trim() })
        ).unwrap(); 
        console.log('Login exitoso:', result);

        // Sincronizar con el estado global de la app
        setTimeout(() => {
          setIsLoggedIn(true);
        }, 2000);
      } catch (error) {
        console.error('Error en login:', error);
        return error;
      }
    };

    return (
      <Container style={{ paddingHorizontal: scale(10) }}>
        <View style={{ marginTop: scale(30) }}>
          <BackButton destination="Choice" />
        </View>
        <View style={{ paddingVertical: scale(10) }}>
          <Label text="¡Bienvenido!" style={{ fontSize: scale(34) }} bold />
          <Label text="Ingresa tus datos para iniciar" style={{ fontSize: scale(17), color: appColors.gray }} />
        </View>
        <View>
          {fields.map((field, index) => (
            <View style={{ paddingVertical: scale(5) }} key={field.name}>
              <CustomInput
                placeholder={field.placeholder}
                {...field}
                value={formValues[field.name]}
                onChangeText={(value) => handleInputChange(field.name, value)}
              />
            </View>
          ))}
        </View>
        <View style={{ paddingVertical: scale(10), justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Label text="¿No estás registrado? " style={{ fontSize: scale(14) }} />
            <Label
              text="Registrarse"
              style={{ fontSize: scale(14), color: 'blue', textDecorationLine: 'underline' }}
              onPress={() => {
                setFormValues({ email: '', password: '' });
                navigation.navigate('Register', { userType });
              }}
            />
          </View>
        </View>
        <View style={{ paddingVertical: scale(10) }}>
          <CustomButton
            onPress={handleLogin}
            label={'Ingresar'}
            colors={[appColors.primary, appColors.primaryTwo]}
          />
          <View style={{ paddingVertical: scale(15), justifyContent: 'center', alignItems: 'center' }}>
            <Label text="o" style={{ fontSize: scale(14) }} />
          </View>
          <View style={{ flexDirection: 'column', justifyContent: 'space-between', height: 150 }}>
            <CustomButton
              onPress={() => {
                Alert.alert('Próximamente', 'Esta función estará disponible pronto.');
              }}
              iconLeft={
                <View style={{ marginRight: scale(5), alignItems: 'flex-start' }}>
                  <Image
                    source={{ uri: 'https://static.vecteezy.com/system/resources/previews/010/353/285/large_2x/colourful-google-logo-on-white-background-free-vector.jpg' }}
                    style={{ width: 40, height: 40, marginRight: scale(7) }}
                  />
                </View>
              }
              style={{ width: '100%', flex: 1, marginBottom: scale(17) }}
              label={'Conéctate con Google'}
              labelStyle={{ color: 'black', marginRight: scale(35) }}
              colors={['#ffffff', '#ffffff']}
              borderColor={'lightblue'}
              rippleColor={appColors.lightBlue}
            />
            <CustomButton
              onPress={() => {
                Alert.alert('Próximamente', 'Esta función estará disponible pronto.');
              }}
              iconLeft={<MaterialIcons name="facebook" size={40} color="white" />}
              style={{ flex: 1, width: '100%' }}
              label={'Conéctate con Facebook'}
              labelStyle={{ marginRight: scale(15) }}
              colors={['#3b5998', '#3b5998']}
            />
          </View>
        </View>
        <View style={{ paddingVertical: scale(7), justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
            <Label text="By signing in, I agree with" style={{ fontSize: scale(11), color: appColors.gray }} />
            <Label text=" Terms of Use" style={{ fontSize: scale(13) }} />
            <Label text=" and " style={{ fontSize: scale(11), color: appColors.gray }} />
          </View>
          <Label text="Privacy Policy" style={{ fontSize: scale(13) }} />
        </View>
      </Container>
    );
  }