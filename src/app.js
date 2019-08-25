import React, { PureComponent } from 'react'
import { StyleSheet, View } from 'react-native'
import { colors } from './themes'

export default class App extends PureComponent {
  render() {
    return (
      <View style={styles.container}>
        <View style={[styles.box]} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'stretch',
    justifyContent: 'center',
    flex: 1
  },
  box: {
    width: 130,
    height: 130,
    backgroundColor: colors.primary
  }
})
