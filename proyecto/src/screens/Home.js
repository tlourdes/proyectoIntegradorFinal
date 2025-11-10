import React, { Component } from "react";
import { View, Text, FlatList, StyleSheet, Image} from "react-native";
import { db, auth } from "../firebase/config";
import Post from "../components/Post";
import logo from "..///../assets/logo.png"; 

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
      <View style={styles.header}>
      <Image source={logo} style={styles.logo} />
    </View>
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
    flex: 1,
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 10,
    paddingTop: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1fa34a',
    marginBottom: 15,
    textAlign: 'center',
  },
  noPosts: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 40,
  },
  header: {                       
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  logo: {               
    width: 60,
    height: 60,
    marginRight: 10,
  },
});


export default Home;
