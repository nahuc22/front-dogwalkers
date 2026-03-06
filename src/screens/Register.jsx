import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Label from '../components/Label.jsx';
import { scale } from 'react-native-size-matters';
import { appColors } from '../utils/appColors.js';
import CustomInput from '../components/CustomInput';
import Container from '../components/Container.jsx';
import CustomButton from '../components/CustomButton.jsx';
import { useNavigation } from '@react-navigation/native';
import BackButton from '../components/BackButton.jsx';
import { register } from '../redux/actions/users/userAction.jsx'; // Importa tu action

export default function Register() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { loading, error } = useSelector((state) => state.user.registerStatus); // Accede al estado de register desde Redux

  const [formValues, setFormValues] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleInputChange = (name, value) => {
    setFormValues({ ...formValues, [name]: value });
  };

  const fields = [
    {
      name: 'name',
      placeholder: 'Nombre',
    },
    {
      name: 'email',
      placeholder: 'Email',
    },
    {
      name: 'password',
      placeholder: 'Contraseña',
      secureTextEntry: true,
    },
  ];

  const handleRegister = () => {
    // if (!formValues.name || !formValues.email || !formValues.password) {
    //   Alert.alert('Formulario incompleto', 'Por favor, completa todos los campos.');
    //   return;
    // }
  
    dispatch(register(formValues))
      .unwrap()
      .then(() => {
        setTimeout(() => {
          navigation.navigate('Login');
        }, 2000);
      })
      .catch((err) => {
        return err
      });
  };

  return (
    <Container style={{ paddingHorizontal: scale(10), marginTop: scale(30) }}>
      <BackButton destination="Login"/>
      <View style={{ paddingVertical: scale(10), left: scale(5) }}>
        <Label text="¡Regístrate!" style={{ fontSize: scale(34) }} bold />
        <Label
          text="Crea tu cuenta ingresando tus datos"
          style={{ fontSize: scale(17), marginTop: scale(10), color: appColors.gray }}
        />
      </View>

      <View style={{ paddingVertical: scale(5), justifyContent: 'center' }}>
        {fields.map((field, index) => (
          <View style={{ paddingVertical: scale(7) }} key={index}>
            <CustomInput
              placeholder={field.placeholder}
              {...field}
              value={formValues[field.name]}
              onChangeText={(value) => handleInputChange(field.name, value)}
            />
          </View>
        ))}
      </View>

      <View style={{ paddingVertical: scale(20), alignItems: 'center', width: '100%' }}>
        <CustomButton
          onPress={handleRegister}
          label={loading ? 'Registrando...' : 'Registrarme'}
          colors={[appColors.primary, appColors.primaryTwo]}
          style={{ width: scale(320) }}
        />
      </View>
    </Container>
  );
}
