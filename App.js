import * as React from 'react';
import {useState, useEffect} from 'react';
import {
  Button,
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  Keyboard,
  ToastAndroid,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import firestore from '@react-native-firebase/firestore';
import Strings from './Strings/strings';

const Stack = createNativeStackNavigator();

function App() {
  var loginYes = false;
  // const [signupEmail, setSignUpEmail] = useState('');
  // const [signupName, setSignUpName] = useState('');
  // const [signupPhone, setSignUpPhone] = useState('');
  // const [signupPassword, setSignUpPassword] = useState('');
  const [date, setDate] = useState(new Date(1598051730000));
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  // const onChange = (event, selectedDate) => {
  //   const currentDate = selectedDate || date;
  //   setShow(Platform.OS === 'ios');
  //   setDate(currentDate);
  // };

  const showMode = currentMode => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  //Insert The Data
  // const insertData = async () => {
  //   try {
  //     await AsyncStorage.setItem(email, password);
  //     alert('Account Created successfully.');
  //   } catch (e) {
  //     alert('Failed to save the data to the storage');
  //   }
  // };
  // const onSubmit = () => {
  //   if (!email) return;

  //   insertData(email, password);
  //   setEmail('');
  //   setPass('');
  // };

  // const fetchData = async () => {
  //   try {
  //     const userEmail = await AsyncStorage.getItem(email);

  //     if (userEmail !== null) {
  //       loginYes = true;
  //       alert(
  //         'Employment Number is: ' +
  //           email +
  //           ' \n' +
  //           'Name: ' +
  //           password +
  //           loginYes,
  //       );
  //     }
  //   } catch (e) {
  //     alert('Failed to fetch the data from storage');
  //   }
  // };

  // function onChangeTextEmail(userEmail) {
  //   setSignUpEmail(userEmail);
  //   console.log('Test', userEmail);
  // }
  // // const onChangeTextName = name => setSignUpName(name);
  // const onChangeTextPass = userPass => setSignUpPassword(userPass);
  // const onChangeTextPhone = userPhone => setSignUpPhone(userPhone);
  function CTaskScreen({navigation}) {
    const [title, setTaskTitle] = useState('');
    const [taskName, setTaskName] = useState('');
    const [taskDesc, setTaskDesc] = useState('');
    const [taskStartDate, setTaskStartDate] = useState('');
    const [taskEndDate, setTaskEndDate] = useState('');
    function handleTask() {
      firestore()
        .collection(Strings.tasks)
        .add({
          title: title,
          taskName: taskName,
          taskDescription: taskDesc,
          startDate: taskStartDate,
          endDate: taskEndDate,
        })
        .then(() => {
          navigation.navigate('Success');
          ToastAndroid.show('Data Added !', ToastAndroid.SHORT);
        });
    }
    return (
      <ImageBackground
        source={require('./img/bg.png')}
        style={styles.backgroundImage}>
        <View>
          <View style={styles.loginForm}>
            <Text style={styles.titleText}>Create Task</Text>
            <TextInput
              style={styles.input}
              placeholder={'Title'}
              value={title}
              onChangeText={setTaskTitle}
            />
            <TextInput
              style={styles.input}
              placeholder={'Name'}
              onChangeText={setTaskName}
              value={taskName}
            />
            <TextInput
              style={styles.input}
              placeholder={'Description'}
              onChangeText={setTaskDesc}
              value={taskDesc}
            />
            <TextInput
              style={styles.input}
              placeholder={'Start Date'}
              onChangeText={setTaskStartDate}
              value={taskStartDate}
            />
            <TextInput
              style={styles.input}
              placeholder={'End Date'}
              onChangeText={setTaskEndDate}
              value={taskEndDate}
            />
            <TouchableOpacity onPress={() => handleTask()}>
              <Text style={styles.buttonMain}>Create task</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    );
  }

  function HomeScreen({navigation}) {
    // fetchData();
    return (
      <ImageBackground
        source={require('./img/bg.png')}
        style={styles.backgroundImage}>
        <View style={styles.containerCenter}>
          <TouchableOpacity onPress={() => navigation.navigate('CTask')}>
            <Text style={styles.buttonMain}>Create a task</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.buttonRed}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    );
  }

  function SuccessScreen({navigation}) {
    return (
      <ImageBackground
        source={require('./img/bg.png')}
        style={styles.backgroundImage}>
        <View style={styles.containerCenter}>
          <Text style={styles.titleTextSuccess}>
            Task created successfully!
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Home')}>
            <Text style={styles.buttonMain}>Back to home</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    );
  }

  function LoginScreen(props) {
    const [user, setUsers] = useState([]);
    const [emailLogin, setEmailLogin] = useState('');
    const [passwordLogin, setPasswordLogin] = useState('');
    useEffect(() => {
      const subscriber = firestore()
        .collection(Strings.signUpData)
        .onSnapshot(querySnapshot => {
          const users = [];

          querySnapshot.forEach(documentSnapshot => {
            users.push({
              ...documentSnapshot.data(),
              key: documentSnapshot.id,
            });
          });

          setUsers(users);
        });

      return () => subscriber();
    }, []);
    function validateUser(email, password) {
      user.map(item => {
        if (item.email === email && item.password === password) {
          props.navigation.navigate('Home');
        }
      });
    }
    console.log('Data', user);
    return (
      <ImageBackground
        source={require('./img/bg.png')}
        style={styles.backgroundImage}>
        <View style={styles.loginForm}>
          <Text style={styles.titleText}>LOGIN</Text>
          <TextInput
            style={styles.input}
            placeholder={'Email'}
            value={emailLogin}
            onChangeText={setEmailLogin}
          />
          <TextInput
            style={styles.input}
            placeholder={'Password'}
            value={passwordLogin}
            onChangeText={setPasswordLogin}
          />
          <TouchableOpacity
            onPress={() => validateUser(emailLogin, passwordLogin)}>
            <Text style={styles.buttonMain}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => props.navigation.navigate('AccountCreation')}>
            <Text style={styles.buttonMain}>Signup</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    );
  }

  function AccountCreationScreen({navigation}) {
    const [signupEmail, setSignUpEmail] = useState('');
    const [signupName, setSignUpName] = useState('');
    const [signupPhone, setSignUpPhone] = useState('');
    const [signupPassword, setSignUpPassword] = useState('');
    const onSignUpSubmit = () => {
      firestore()
        .collection(Strings.signUpData)
        .add({
          name: signupName,
          email: signupEmail,
          phone: signupPhone,
          password: signupPassword,
        })
        .then(() => {
          console.log('User added!');
          Alert.alert(Strings.success, Strings.userAddedSignUp);
        });
    };
    return (
      <ImageBackground
        source={require('./img/bg.png')}
        style={styles.backgroundImage}>
        <View style={styles.loginForm}>
          <Text style={styles.titleText}>Sign Up</Text>
          <TextInput
            style={styles.input}
            placeholder={'Name'}
            value={signupName}
            onChangeText={setSignUpName}
          />
          <TextInput
            style={styles.input}
            placeholder={'Email'}
            value={signupEmail}
            onChangeText={setSignUpEmail}
          />
          <TextInput
            style={styles.input}
            placeholder={'Phone'}
            value={signupPhone}
            onChangeText={setSignUpPhone}
          />
          <TextInput
            style={styles.input}
            placeholder={'Password'}
            value={signupPassword}
            onChangeText={setSignUpPassword}
          />
          <TextInput style={styles.input} placeholder={'Confirm Password'} />
          <TouchableOpacity
            onPress={() => {
              onSignUpSubmit();
            }}>
            <Text style={styles.buttonMain}>Signup</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="CTask" component={CTaskScreen} />
        <Stack.Screen
          name="AccountCreation"
          component={AccountCreationScreen}
        />
        <Stack.Screen name="Success" component={SuccessScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // or 'stretch',
    justifyContent: 'center',
  },
  loginForm: {
    marginHorizontal: 40,
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    shadowColor: '#008080',
    shadowOpacity: 0.8,
    shadowRadius: 7,
    shadowOffset: {
      height: 1,
      width: 1,
    },
  },
  titleText: {
    fontSize: 45,
    fontWeight: 'bold',
    color: '#373737',
  },
  titleTextSuccess: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#373737',
  },
  text: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  header: {
    width: '100%',
    backgroundColor: '#dcdcdc',
    padding: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    color: '#333',
    fontWeight: 'bold',
  },
  panel: {
    paddingTop: 40,
    alignItems: 'center',
  },
  input: {
    height: 40,
    marginVertical: 7,
    borderWidth: 1,
    borderRadius: 7,
    borderColor: '#373737',
    padding: 10,
    width: '65%',
    color: '#373737',
  },
  buttonMain: {
    margin: 5,
    paddingVertical: 10,
    backgroundColor: '#FEDD00',
    borderWidth: 1,
    borderRadius: 7,
    padding: 20,
    overflow: 'hidden',
    color: '#373737',
  },
  buttonRed: {
    margin: 5,
    paddingVertical: 10,
    backgroundColor: '#aa4a44',
    borderWidth: 1,
    borderRadius: 7,
    padding: 20,
    borderColor: '#fff',
    overflow: 'hidden',
    color: '#fff',
    fontWeight: 'bold',
  },
  buttonText: {
    fontSize: 18,
    color: '#444',
  },
  container: {
    flex: 1,
    paddingTop: 22,
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
  containerCenter: {
    alignItems: 'center',
  },
});

export default App;
