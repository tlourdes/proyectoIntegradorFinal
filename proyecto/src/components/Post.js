import React, { Component } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import firebase from "firebase"; 
import { db, auth } from "../firebase/config";

class Post extends Component {
  constructor(props) {
    super(props);
let likeado = false;

let contador = 0;

if (this.props.data.likes) {
  contador = this.props.data.likes.length;

  if (auth.currentUser && this.props.data.likes.includes(auth.currentUser.email)) {
    likeado = true;
  }
}
    this.state = {
      likes: contador,
      likeado: likeado
    };
  }

  likePost() {
    db.collection("posts")
      .doc(this.props.id)
      .update({
        likes: firebase.firestore.FieldValue.arrayUnion(auth.currentUser.email),
      })
      .then(() => {
        this.setState({
          likes: this.state.likes + 1,
          likeado: true,
        });
      })
      .catch((err) => console.log(err));
  }


  unlikePost() {
    db.collection("posts")
      .doc(this.props.id)
      .update({
        likes: firebase.firestore.FieldValue.arrayRemove(auth.currentUser.email),
      })
      .then(() => {
        this.setState({
          likes: this.state.likes - 1,
          likeado: false,
        });
      })
      .catch((err) => console.log( err));
  }


  Comentarios() {
    this.props.navigation.navigate("MenuComentarios", {screen: "Comentarios", params: {postId: this.props.id }}); //vamos a Comentarios y le pasamos como parametro el id del post
  }

  render() {

    return (
<View style={styles.card}>
        <Text style={styles.mensaje}>{this.props.data.mensaje}</Text>
        <Text style={styles.email}>Publicado por: {this.props.data.email}</Text>

        <View style={styles.actions}>
         
          <Pressable
            style={styles.button}
            onPress={() =>
              this.state.likeado ? this.unlikePost() : this.likePost()
            }
          >
            <Text style={styles.buttonText}>Me gusta</Text>
          </Pressable>

          <Pressable style={styles.button} onPress={() => this.Comentarios()}>
            <Text style={styles.buttonText}>Comentar</Text>
          </Pressable>
        </View>

        <Text style={styles.likes}>Likes: {this.state.likes}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderWidth: 1.5,
    borderColor: '#d0d0d0',
    borderRadius: 8,
    padding: 15,
    marginVertical: 10,
    alignSelf: 'center',
    width: '65%',
    shadowOpacity: 0.06,
  },
  mensaje: {
    fontSize: 17,
    color: 'black',
    marginBottom: 6,
    lineHeight: 21,
  },
  email: {
    fontSize: 13,
    color: '#666',
    marginBottom: 12,
  },
  actions: {
    flexDirection: 'column', 
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8, 
  },
  button: {
    backgroundColor: '#1fa34a',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 4,
    alignItems: 'center',
    width: '40%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  likes: {
    marginTop: 10,
    fontSize: 16,
    color: 'grey',
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default Post;