import React, { Component } from "react";
import { View, Text, TextInput, Pressable, FlatList, StyleSheet, Image } from "react-native";
import { db, auth } from "../firebase/config";
import logo from "..///../assets/logo.png"; 

class Comentarios extends Component {
  constructor(props) {
    super(props);
    this.state = {
      postId: this.props.route.params.postId, //recibimos el id del post desde la navegación (lo mandamos desde Post.js)
      comentario: "",
      comentarios: [],
      cargando: true,
      error: "",
    };
  }

  componentDidMount() {
     
    db.collection("posts")
      .doc(this.state.postId)
      .onSnapshot((doc) => {
          const data = doc.data();
          let comentarios = [];
          if (data.comentarios) {
            comentarios = data.comentarios;
          }
          this.setState({
            comentarios: comentarios,
            cargando: false,
          });
       
      });
  }


  agregarComentario() {
    if (this.state.comentario.length < 1) {
      this.setState({ error: "El comentario no puede estar vacío." });
      return;
    }

    const nuevoComentario = {
      texto: this.state.comentario,
      autor: auth.currentUser.email,
      fecha: Date.now(),
    };

    const comentariosActualizados = [nuevoComentario].concat(this.state.comentarios); // creo un array con NuevoComentario y lo junto con el array viejo (lo hago en ese orden el concat y no al reves para q primero me muestre el comentraio nuevo)

    db.collection("posts")
      .doc(this.state.postId)
      .update({
        comentarios: comentariosActualizados,
      })
      .then(() => {
        this.setState({ comentario: "", error: "" });
        console.log("Comentario agregado correctamente.");
      })
      .catch((err) => {
        console.log("Error al agregar comentario:", err);
        this.setState({ error: "Hubo un error al comentar." });
      });
  }

  render() {

    if (this.state.cargando) {
      return (
        <View style={styles.container}>
          <Text style={styles.loading}>Cargando comentarios...</Text>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <View style={styles.header}>
                      <Image source={logo} style={styles.logo} />
                    </View>
        <Text style={styles.title}>Comentarios</Text>

        
        {this.state.comentarios.length === 0 ? (
          <Text style={styles.noComments}>No hay comentarios aún.</Text>
        ) : (
          <FlatList
            data={this.state.comentarios}  
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.commentCard}>
                <Text style={styles.commentText}>{item.texto}</Text>
                <Text style={styles.commentAuthor}>Por: {item.autor}</Text>
              </View>
            )}
          />
        )}

        
        <TextInput
          style={styles.input}
          placeholder="Escribí tu comentario..."
          onChangeText={(text) => this.setState({ comentario: text })}
          value={this.state.comentario}
         
        />

 <Text style={styles.error}>{this.state.error}</Text>  

        <Pressable
          style={styles.button}
          onPress={() => this.agregarComentario()}
        >
          <Text style={styles.buttonText}>Comentar</Text>
        </Pressable>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 20,
    paddingTop: 40,
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

  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1fa34a',
    marginTop: 90,               
    marginBottom: 15,
    textAlign: 'center',
  },

  noComments: {
    fontSize: 16,
    color: '#666',
    marginVertical: 10,
    textAlign: 'center',
  },

  commentCard: {
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#d0d0d0',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    width: '80%',          
    alignSelf: 'center',
  },

  commentText: {
    fontSize: 15,
    color: '#222',
  },
  commentAuthor: {
    fontSize: 12,
    color: '#555',
    marginTop: 5,
  },

  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#1fa34a',
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    width: '80%',
    alignSelf: 'center',
    marginTop: 15,
  },

  button: {
    backgroundColor: '#1fa34a',
    paddingVertical: 10,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
    alignSelf: 'center',
    marginTop: 10,
  },

  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },

  error: {
    color: '#c62828',
    textAlign: 'center',
    fontSize: 13,
    marginTop: 6,
  },
});


export default Comentarios;