import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default class LoadingScreen extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>
          (Place icon here)
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: '40%',
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  title: {
    fontSize: 40,
  }
});