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
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 10,
  },
  loading: {
    fontSize: 16,
    color: "#555",
  },
  noComments: {
    fontSize: 16,
    color: "#666",
    marginVertical: 10,
  },
  commentCard: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  commentText: {
    fontSize: 16,
    color: "#333",
  },
  commentAuthor: {
    fontSize: 13,
    color: "#777",
    marginTop: 4,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    fontSize: 16,
    marginTop: 15,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 15,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  error: {
    color: "red",
    marginTop: 8,
  },
});

export default Comentarios;