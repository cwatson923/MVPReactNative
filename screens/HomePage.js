import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

function App() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>
          Top Players
        </Text>
      </View>
    );
}

export default App;

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