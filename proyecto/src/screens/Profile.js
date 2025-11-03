import React, { Component } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { db, auth } from "../firebase/config";
import Post from "../components/Post";

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      loading: true,
      user: null,
    };
  }};

export default Profile;