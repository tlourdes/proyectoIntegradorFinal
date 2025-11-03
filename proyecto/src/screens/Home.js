import React, { Component } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { db, auth } from "../firebase/config";
import Post from "../components/Post";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      loading: true,
      user: null,
    };
  }

  componentDidMount() {
    
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user: user });

         
        db.collection("posts")
          .orderBy("createdAt", "desc")
          .onSnapshot((docs) => {
            let posts = [];
            docs.forEach((doc) => {
              posts.push({
                id: doc.id,
                data: doc.data(),
              });
            });
            this.setState({
              posts: posts,
              loading: false,
            });
          });
      } else {
        
        this.props.navigation.navigate("Login");
      }
    });
  }

  render() {
    if (this.state.loading) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Cargando posteos...</Text>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <Text style={styles.title}>Posteos recientes</Text>

        {this.state.posts.length === 0 ? (
          <Text style={styles.noPosts}>No hay posteos disponibles</Text>
        ) : (
          <FlatList
            data={this.state.posts}
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
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
  
  },
  title: {
  
  },
  noPosts: {
   
  },
});

export default Home;
