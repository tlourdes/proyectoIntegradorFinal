import React, { Component } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { db, auth } from "../firebase/config";

class NuevoPost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mensaje: "",
      error: "",
    };
  }

  componentDidMount() {
    auth.onAuthStateChanged((user) => {
      if (!user) {
        this.props.navigation.navigate("Login");
      }
    });
  }

  onSubmit() {
     
    if (this.state.mensaje.length < 5) {
      this.setState({error: "El post debe tener al menos 5 caracteres." });
    }else  {
      this.setState({error: ""});

      db.collection("posts")
        .add({
          mensaje: this.state.mensaje,
          email: auth.currentUser.email,
          createdAt: Date.now(),
          likes: [],
        })
        .then(() => {
          this.setState({mensaje: "" });
          this.props.navigation.navigate("Home");
        })
        .catch((error) => {
          console.log(error);
          this.setState({
            error: "Hubo un error al intentar crear el post.",
          });
        });
    }
  }

  render() {


    return (
      <View style={styles.container}>
        <Text style={styles.titulo}>Crear nuevo post</Text>

        <TextInput
          style={styles.input}
          placeholder="Escribí tu post..."
          onChangeText={(text) => this.setState({mensaje: text})}
          value={this.state.mensaje}
        />

      
        {this.state.error !== "" ? (<Text style={styles.error}>{this.state.error}</Text>) : null}

        <Pressable style={styles.boton} onPress={() => this.onSubmit()}>
    <Text style={styles.textoBoton}>Publicar</Text>
        </Pressable>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
  },
  titulo: {
  },
  input: {},
  boton: {},
  textoBoton: {},
  error: {

  },
});

export default NuevoPost;