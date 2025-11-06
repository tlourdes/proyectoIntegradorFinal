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
  
        <View style={styles.formBox}>
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
  
          <Pressable
            style={styles.button}
            onPress={() => this.onSubmit(this.state.email, this.state.password)}
          >
            <Text style={styles.buttonText}>Login</Text>
          </Pressable>
  
          <Text>{this.state.error1}</Text>
  
          <Pressable
            style={[styles.button, styles.buttonSec]}
            onPress={() => this.props.navigation.navigate("Register")}
          >
            <Text style={styles.buttonText}>No tengo cuenta</Text>
          </Pressable>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "white"
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1fa34a',
    marginBottom: 15,
  },
  formBox: {
    width: '80%',
    maxWidth: 400,
    backgroundColor: '#f0f0f0', 
    borderWidth: 1.5,
    borderColor: '#d0d0d0',
    borderRadius: 8,
    paddingVertical: 18,
    paddingHorizontal: 18,
    alignItems: 'center',
    shadowOpacity: 0.06,
  },
  input: {
    width: '90%',       
    height: 32,  
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'green',
    borderRadius: 4,
    paddingHorizontal: 8,
    fontSize: 13,
    marginBottom: 10,
  },
  button: {
    width: '90%',   
    height: 34,     
    backgroundColor: '#1fa34a',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  buttonSec: {
    backgroundColor: '#199446',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600'
  },
});


export default Login;