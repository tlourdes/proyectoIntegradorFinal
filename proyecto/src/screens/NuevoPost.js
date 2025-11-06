import React, { Component } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { db, auth } from "../firebase/config";
import Post from "../components/Post";

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
};



export default NuevoPost;