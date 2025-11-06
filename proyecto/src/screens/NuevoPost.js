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
       
        <View style={styles.formBox}>
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
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  titulo: {
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
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: 'center',
    shadowOpacity: 0.06,
  },
  input: {
    width: '90%',
    minHeight: 80,          
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: 'green',
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    marginBottom: 10,
    textAlignVertical: 'top',
  },
  boton: {
    width: '90%',
    height: 36,
    backgroundColor: '#1fa34a',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  textoBoton: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  error: {
    width: '90%',
    color: '#c62828',
    fontSize: 13,
    marginBottom: 6,
  },
});


export default NuevoPost;