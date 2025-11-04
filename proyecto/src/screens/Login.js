import React, { Component } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import {auth} from "../firebase/config";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      loggedIn: false,
      error1: ""
    };
  }
   componentDidMount() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.props.navigation.navigate("HomeMenu");
      }
    });
  }
  onSubmit(email,pass) {
    console.log("Datos ingresados:");
    console.log("Email:", this.state.email);
    console.log("Password:", this.state.password);
    auth.signInWithEmailAndPassword(email, pass)
    .then(response=>{

     
      this.setState({loggedIn: true, error1: "",}
      );
      console.log("Login exitoso:", response);
      this.props.navigation.navigate("HomeMenu"); 
    })

    .catch(error=>{
      console.log("Error en el login:", error);
      this.setState({error1: "Credenciales incorrectas"});
    });

  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Login</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          onChangeText={(text) => this.setState({ email: text })}
          value={this.state.email}

        />

               
             

        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          secureTextEntry={true}
          onChangeText={(text) => this.setState({ password: text })}
          value={this.state.password}
        />
   
        <Pressable style={styles.button} onPress={() => this.onSubmit(this.state.email, this.state.password)} >
          <Text style={styles.buttonText}>Login</Text>
        </Pressable>

  
          <Text>{this.state.error1}</Text>


        <Pressable
          style={styles.button}
          onPress={() => this.props.navigation.navigate("Register")}
        >
          <Text style={styles.buttonText}>No tengo cuenta</Text>
        </Pressable>

     
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 30,
  },
  input: {
    width: '80%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginTop: 10,
  },
  orangeButton: {
   
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  dataPreview: {
    marginTop: 30,
    alignItems: 'flex-start',
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
});

export default Login;