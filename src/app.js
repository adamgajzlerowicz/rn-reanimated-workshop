import React, { PureComponent } from 'react'
import { StyleSheet } from 'react-native'
import Animated from 'react-native-reanimated'
import { colors } from './themes'

const { View, Value } = Animated

export default class App extends PureComponent {
  opacity = new Value(1)

  constructor(props) {
    super(props)
    setTimeout(() => {
      this.opacity.setValue(0.4)
    }, 1000)
  }

  render() {
    return (
      <View style={styles.container}>
        <View
          style={[
            styles.box,
            {
              opacity: this.opacity
            }
          ]}
        />
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
