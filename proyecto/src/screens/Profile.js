import React, { Component } from "react";
import { View, Text, FlatList, Pressable, StyleSheet, Image, ActivityIndicator} from "react-native";
import { auth, db } from "../firebase/config";
import Post from "../components/Post";
import logo from "..///../assets/logo.png"; 

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

        db.collection("users")
          .where("email", "==", usuario.email)
          .onSnapshot(
           (docs) => {
            let usuarios = [];
            docs.forEach((doc) => {
              usuarios.push({
                id: doc.id,
                data: doc.data(),
              });
             this.setState({ username: usuarios[0].data.username });
          })})
         

      } else {
        this.props.navigation.navigate("Login");
      }
    });
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
          <ActivityIndicator size="small" color="#1fa34a" />
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
        <View style={styles.header}>
              <Image source={logo} style={styles.logo} />
            </View>
        <Text style={styles.titulo}>Mi Perfil</Text>

        <View style={styles.infoUsuario}>
          <Text style={styles.texto}>{this.state.username}</Text> {/* quedaria más lindo agrndarle la letra */}
          <Text style={styles.texto}> {usuario.email}</Text>
        </View>

        <Text style={styles.subtitulo}>Mis posteos</Text>

        {posts.length === 0 ? (
          <Text style={styles.texto}>No tenés posteos aún.</Text>
        ) : (
          <FlatList style= {styles.post}
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
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    paddingTop: 20,
    paddingHorizontal: 20,
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
    marginTop: 80,               
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
  post: {
    width: '65%',
  },
});



export default Profile;
