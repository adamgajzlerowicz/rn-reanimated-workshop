import React, { PureComponent } from 'react'
import { StyleSheet } from 'react-native'
import { PanGestureHandler, State } from 'react-native-gesture-handler'
import Animated from 'react-native-reanimated'
import { colors } from './themes'

const {
  greaterThan,
  Value,
  debug,
  event,
  View,
  block,
  set,
  cond,
  eq
} = Animated

export default class App extends PureComponent {
  dragX = new Value(0)
  dragY = new Value(0)

  transX = new Value(0)
  transY = new Value(0)

  gestureState = new Value(-1)

  onGestureEvent = event([
    {
      nativeEvent: {
        translationX: this.dragX,
        translationY: this.dragY,
        state: this.gestureState
      }
    }
  ])

  constructor(props) {
    super(props)

    this.transX = cond(
      eq(this.gestureState, State.ACTIVE),
      cond(greaterThan(this.dragX, 100), new Value(100), this.dragX),
      new Value(0)
    )

    this.transY = cond(
      eq(this.gestureState, State.ACTIVE),
      this.dragY,
      new Value(0)
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <PanGestureHandler
          onGestureEvent={this.onGestureEvent}
          onHandlerStateChange={this.onGestureEvent}
        >
          <View
            style={[
              styles.box,
              {
                transform: [
                  {
                    translateX: this.transX,
                    translateY: this.transY
                  }
                ]
              }
            ]}
          />
        </PanGestureHandler>
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
