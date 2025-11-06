import React, { Component } from "react";
import { View, Text, FlatList, Pressable, StyleSheet } from "react-native";
import { auth, db } from "../firebase/config";
import Post from "../components/Post";

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usuario: null,
      posts: [],
      cargando: true,
    };
  }

  componentDidMount() {
    console.log("Montando Perfil...");
    auth.onAuthStateChanged((usuario) => {
      if (usuario) {
        console.log("Usuario detectado:", usuario.email);
        this.setState({ usuario }, () => this.obtenerPosteos(usuario));
      } else {
        this.props.navigation.navigate("Login");
      }
    });
  }

  obtenerPosteos(usuario) {
    db.collection("posts")
      .where("email", "==", usuario.email)
      .onSnapshot(
        (docs) => {
          let posts = [];
          docs.forEach((doc) => {
            posts.push({
              id: doc.id,
              data: doc.data(),
            });
          });
          this.setState({ posts, cargando: false });
        },
        (error) => {
          console.log("Error Firestore:", error);
          this.setState({ cargando: false });
        }
      );
  }

  cerrarSesion() {
    auth
      .signOut()
      .then(() => {
        console.log("Sesión cerrada correctamente");
        this.props.navigation.navigate("Login");
      })
      .catch((error) => console.log("Error al cerrar sesión:", error));
  }

  render() {
    const { usuario, posts, cargando } = this.state;

    if (cargando) {
      return (
        <View style={styles.container}>
          <Text style={styles.titulo}>Cargando perfil...</Text>
        </View>
      );
    }

    if (!usuario) {
      return (
        <View style={styles.container}>
          <Text style={styles.titulo}>No hay usuario autenticado.</Text>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <Text style={styles.titulo}>Mi Perfil</Text>

        <View style={styles.infoUsuario}>
          <Text style={styles.texto}>📧 {usuario.email}</Text>
        </View>

        <Text style={styles.subtitulo}>Mis posteos</Text>

        {posts.length === 0 ? (
          <Text style={styles.texto}>No tenés posteos aún.</Text>
        ) : (
          <FlatList
            data={posts}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Post
                data={item.data}
                id={item.id}
                navigation={this.props.navigation}
              />
            )}
          />
        )}

        <Pressable style={styles.botonCerrar} onPress={() => this.cerrarSesion()}>
          <Text style={styles.textoBoton}>Cerrar sesión</Text>
        </Pressable>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    alignItems: "center",
    padding: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#222",
    marginVertical: 10,
  },
  infoUsuario: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    width: "90%",
    alignItems: "center",
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  texto: {
    fontSize: 16,
    color: "#333",
  },
  subtitulo: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 5,
    color: "#444",
    alignSelf: "flex-start",
  },
  botonCerrar: {
    backgroundColor: "#FF3B30",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginTop: 20,
  },
  textoBoton: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default Profile;
