import React, { Component } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { db, auth } from "../firebase/config";

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
    };
  }

  onSubmit(email, pass, username) {
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
          this.setState({ error2: "l email ya está en uso" });
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
        <Text style={styles.title}>Crear cuenta</Text>

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

        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          secureTextEntry={true}
          onChangeText={(text) => this.setState({ password: text })}
          value={this.state.password}
        />

        <Text>{this.state.error3}</Text>

        <Pressable
          style={styles.button}
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
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {},
  input: {},
  button: {},
  buttonText: {},
});

export default Register;
