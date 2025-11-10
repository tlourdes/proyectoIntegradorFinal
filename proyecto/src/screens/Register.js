import React, { Component } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Image} from "react-native";
import { db, auth } from "../firebase/config";
import logo from "..///../assets/logo.png"; 

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      username: "",
      password: "",
      registered: false,
      error1: "",
      error2: "",
      error3: "",
      error4: "",
    };
  }

  onSubmit(email, pass, username) {
      if (username.length < 5) {
        this.setState({ error4: "El nombre de usuario debe tener al menos 5 caracteres." });
        return; //frena la funcion, no crea usuario hasta que se llene el campo.
    }else{
      this.setState({ error4: "" });
    }

    auth
      .createUserWithEmailAndPassword(email, pass)
      .then((response) => {
        this.setState({ registered: true });
        console.log("Usuario registrado exitosamente:", response);
        

        db.collection("users")
          .add({
            email: this.state.email,
            username: this.state.username,
            createdAt: Date.now(),
          })
          .then(() => {
            console.log(db.collection("users"));
             this.props.navigation.navigate("Login");

            this.setState({
              loggedIn: true,
              
            });
          })
          .catch((error) => {
           

            console.log( error);
          });
      })
      .catch((error) => {
        console.log(error.message);
        if (error.message === "The email address is badly formatted.") {
          this.setState({ error1: "Email mal formateado" });
        } else {
          this.setState({ error1: "" });
        }
        if (error.message.includes("exists")) {
          this.setState({ error2: "Email ya está en uso" });
        } else {
          this.setState({ error2: "" });
        }if (error.message.includes("6 characters")) {
          this.setState({
            error3: "La password debe tener una longitud mínima de 6 caracteres"
          });
        }else {
          this.setState({ error3: "" });
        }


        console.log("Error en el registro:", error);
      });
  }

  render() {
    return (
      <View style={styles.container}>
         <View style={styles.header}>
              <Image source={logo} style={styles.logo} />
            </View>
        <Text style={styles.title}>Crear cuenta</Text>

        <View style={styles.formBox}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          onChangeText={(text) => this.setState({ email: text })}
          value={this.state.email}
        />

        <Text>{this.state.error1}</Text>
        <Text>{this.state.error2}</Text>

        <TextInput
          style={styles.input}
          placeholder="Nombre de usuario"
          onChangeText={(text) => this.setState({ username: text })}
          value={this.state.username}
        />

         <Text>{this.state.error4}</Text>

        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          secureTextEntry={true}
          onChangeText={(text) => this.setState({ password: text })}
          value={this.state.password}
        />

        <Text>{this.state.error3}</Text>

        <Pressable
          style={[styles.button, styles.buttonSec]}
          onPress={() =>
            this.onSubmit(
              this.state.email,
              this.state.password,
              this.state.username
            )
          }
        >
          <Text style={styles.buttonText}>Registrate</Text>
        </Pressable>

        <Pressable
          style={styles.button}
          onPress={() => this.props.navigation.navigate("Login")}
        >
          <Text style={styles.buttonText}>Ya tengo cuenta</Text>
        </Pressable>
      </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 20,
    paddingTop: 20,             
  },
  header: {                       
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start', 
    marginBottom: 10,           
  },
  logo: {               
    width: 60,
    height: 60,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1fa34a',
    textAlign: 'center',        
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
    alignSelf: 'center',         
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
    fontWeight: '600',
  },
});


export default Register;
