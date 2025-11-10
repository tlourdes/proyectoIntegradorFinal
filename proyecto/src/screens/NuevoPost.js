import React, { Component } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Image, ActivityIndicator} from "react-native";
import { db, auth } from "../firebase/config";
import logo from "..///../assets/logo.png"; 


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
          <View style={styles.header}>
              <Image source={logo} style={styles.logo} />
            </View>
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
    backgroundColor: '#F2F2F7',
    paddingTop: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },

  header: {         
    position: 'absolute',
    top: 40,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },

  logo: {                   
    width: 60,
    height: 60,
  },

  titulo: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1fa34a',
    marginTop: 90,                   // 🔼 deja espacio debajo del logo
    marginBottom: 15,
    textAlign: 'center',
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
    minHeight: 70,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#1fa34a',
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
    marginTop: 8,
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
    textAlign: 'center',
  },
});



export default NuevoPost;