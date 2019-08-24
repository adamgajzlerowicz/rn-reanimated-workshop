import React, { PureComponent } from 'react'
import { StyleSheet } from 'react-native'
import { PanGestureHandler, State } from 'react-native-gesture-handler'
import Animated, { Easing } from 'react-native-reanimated'
import { colors } from './themes'

const {
  and,
  Value,
  call,
  debug,
  event,
  View,
  Code,
  block,
  set,
  startClock,
  cond,
  eq,
  stopClock,
  timing,
  clockRunning,
  Clock
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

  clock = new Clock()

  clockState = {
    finished: new Value(0),
    position: new Value(0),
    time: new Value(0),
    frameTime: new Value(0)
  }

  clockConfig = {
    duration: new Value(1000),
    toValue: new Value(0),
    easing: Easing.inOut(Easing.ease)
  }

  constructor(props) {
    super(props)

    this.transY = cond(
      eq(this.gestureState, State.ACTIVE),
      this.dragY,
      new Value(0)
    )
  }

  render() {
    const { clock, clockState, clockConfig, gestureState, dragX, transX } = this

    return (
      <View style={styles.container}>
        <Code>
          {() =>
            block([
              cond(
                and(
                  eq(gestureState, State.END),
                  eq(clockRunning(clock), false)
                ),
                [
                  set(clockState.finished, 0),
                  set(clockState.time, 0),
                  set(clockState.frameTime, 0),
                  set(clockState.position, dragX),
                  startClock(clock)
                ],
                set(transX, dragX)
              ),

              cond(clockRunning(clock), [
                timing(clock, clockState, clockConfig),
                set(transX, clockState.position),
                cond(clockState.finished, [
                  stopClock(clock),
                  call([dragX], console.log)
                ])
              ])
            ])
          }
        </Code>

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
