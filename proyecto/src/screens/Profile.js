import React, { Component } from "react";
import { View, Text, FlatList, Pressable, StyleSheet } from "react-native";
import { auth, db } from "../firebase/config";
import Post from "../components/Post";

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usuario: null,
      username: "",
      posts: [],
      cargando: true,
    };
  }

  componentDidMount() {
    
    auth.onAuthStateChanged((usuario) => {
      if (usuario) {
        console.log("Usuario detectado:", usuario.email);
        this.setState({usuario: usuario});
        this.obtenerPosteos(usuario);
        db.collection("users")
          .where("email", "==", usuario.email)
          .get()
           .then((docs) => {
              const userData = docs.docs[0].data(); //no me acuerdo si esto lo vimos asi
              this.setState({ username: userData.username }); 
          })
          .catch((error) => console.log("Error al obtener username:", error));

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
          this.setState({ posts: posts, cargando: false });
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
    const usuario = this.state.usuario;
    const posts = this.state.posts;
    const cargando = this.state.cargando;

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
          <Text style={styles.texto}>{this.state.username}</Text> {/* quedaria más lindo agrndarle la letra */}
          <Text style={styles.texto}> {usuario.email}</Text>
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
                navigation={this.props.navigation} //medio raros los estilos de esta parte.
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
    backgroundColor: 'white',
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  titulo: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1fa34a',
    marginBottom: 15,
  },
  infoUsuario: {
    backgroundColor: '#f0f0f0', 
    borderWidth: 1,
    borderColor: 'green',
    borderRadius: 8,
    width: '40%', 
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginBottom: 20,
    shadowOpacity: 0.06,
  },
  texto: {
    fontSize: 14,
    color: 'black',
  },
  subtitulo: {
    fontSize: 23,
    marginTop: 10,
    marginBottom: 5,
    color: '#1fa34a',
    alignSelf: 'center',
  },
  botonCerrar: {
    backgroundColor: '#e53935',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 6,
    marginTop: 25,
    width: 'auto', 
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoBoton: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});


export default Profile;
