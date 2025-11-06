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
    this.props.navigation.navigate("Comentarios", { postId: this.props.id });
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
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginVertical: 10,
    marginHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  mensaje: {
    fontSize: 16,
    color: '#222',
    marginBottom: 10,
    lineHeight: 22,
  },
  email: {
    fontSize: 13,
    color: '#777',
    marginBottom: 15,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '500',
  },
  likes: {
    marginTop: 10,
    fontSize: 14,
    color: '#555',
    fontWeight: '500',
  },
});


export default Post;