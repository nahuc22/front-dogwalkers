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

export default function Register({ route }) {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const userState = useSelector((state) => state.user);
  const { loading, error } = userState?.registerStatus || { loading: false, error: null };
  const userType = route.params?.userType || 'owner'; // Default a 'owner' si no viene

  console.log('User state:', userState);
  console.log('Loading:', loading);

  const [formValues, setFormValues] = useState({
    name: '',
    lastname: '',
    age: '',
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
      name: 'lastname',
      placeholder: 'Apellido',
    },
    {
      name: 'age',
      placeholder: 'Edad',
      keyboardType: 'numeric',
    },
    {
      name: 'email',
      placeholder: 'Email',
      keyboardType: 'email-address',
    },
    {
      name: 'password',
      placeholder: 'Contraseña (mínimo 6 caracteres)',
      secureTextEntry: true,
    },
  ];

  const handleRegister = async () => {
    // Validación básica
    if (!formValues.name || !formValues.email || !formValues.password) {
      Alert.alert('Formulario incompleto', 'Por favor, completa al menos nombre, email y contraseña.');
      return;
    }

    if (formValues.password.length < 6) {
      Alert.alert('Contraseña inválida', 'La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    try {
      // Preparar datos para enviar al backend
      const userData = {
        name: formValues.name.trim(),
        email: formValues.email.trim(),
        password: formValues.password.trim(),
        role: userType, // ← Agregar el rol desde Choice
      };

      // Agregar campos opcionales solo si tienen valor
      if (formValues.lastname && formValues.lastname.trim()) {
        userData.lastname = formValues.lastname.trim();
      }
      
      if (formValues.age && formValues.age.trim()) {
        userData.age = parseInt(formValues.age);
      }

      console.log('Datos a enviar:', userData);
      console.log('Registrando como:', userType);

      await dispatch(register(userData)).unwrap();
      
      // Registro exitoso, navegar al login después de 2 segundos
      setTimeout(() => {
        navigation.navigate('Login');
      }, 2000);
    } catch (err) {
      console.error('Error en registro:', err);
      Alert.alert('Error', err || 'Hubo un problema al registrarte. Intenta de nuevo.');
    }
  };

  return (
    <Container style={{ paddingHorizontal: scale(10), marginTop: scale(30) }}>
      <BackButton />
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
