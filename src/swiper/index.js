/**
 * @flow
 */

import React from 'react'
import { StyleSheet, Image } from 'react-native'
import { PanGestureHandler, State } from 'react-native-gesture-handler'
import Animated from 'react-native-reanimated'

import { colors } from '../themes'
import { dragInteraction, noAction } from './animations'
import { distanceToSkip, distanceToVote } from './constants'
import { reaction } from './helpers'

import Overlay from './overlay'

const {
  View,
  event,
  Value,
  not,
  greaterThan,
  multiply,
  cond,
  eq,
  and,
  abs,
  lessThan
} = Animated

class App extends React.Component {
  gestureState = new Value(-1)

  dragX = new Value(0)
  dragY = new Value(0)
  transXValue = new Value(0)
  transYValue = new Value(0)

  state = {
    items: []
  }

  onGestureEvent = event([
    {
      nativeEvent: {
        translationX: this.dragX,
        translationY: this.dragY,
        state: this.gestureState
      }
    }
  ])

  nextSlide = () => {
    // eslint-disable-next-line no-unused-vars
    const [_oldTopItem, ...items] = this.state.items

    this.setState(
      {
        items
      },
      () => {
        this.transXValue.setValue(0)
        this.transYValue.setValue(0)
      }
    )
  }

  constructor(props) {
    super(props)
    const { gestureState, dragX, dragY } = this

    const { callback, items } = this.props

    this.state.items = items

    this.translateX = dragInteraction({
      dragX,
      dragY,
      gestureState,
      reaction: reaction({ callback, item: this.state.items[0] }),
      nextSlide: this.nextSlide,
      transYValue: this.transYValue,
      transXValue: this.transXValue
    })

    this.translateY = this.transYValue

    this.isLikingOpacity = cond(
      and(
        eq(gestureState, State.ACTIVE),
        not(noAction(dragX, dragY)),
        greaterThan(dragX, distanceToVote)
      ),
      [new Value(1)],
      [new Value(0)]
    )

    this.isSkippingOpacity = cond(
      and(
        eq(gestureState, State.ACTIVE),
        and(greaterThan(abs(dragY), distanceToSkip), lessThan(dragY, 0))
      ),
      [new Value(1)],
      [new Value(0)]
    )

    this.isDislikingOpacity = cond(
      and(
        not(noAction(dragX, dragY)),
        eq(gestureState, State.ACTIVE),
        lessThan(dragX, -distanceToVote)
      ),
      [new Value(1)],
      [new Value(0)]
    )
  }

  render() {
    const [interactiveItem, backgroundItem] = this.state.items

    return (
      <View style={styles.container}>
        <PanGestureHandler
          onGestureEvent={this.onGestureEvent}
          onHandlerStateChange={this.onGestureEvent}
        >
          <View style={styles.container}>
            <View style={[styles.box]}>
              <Image
                source={{
                  uri: backgroundItem.url
                }}
                style={styles.background}
              />
            </View>

            <View
              style={[
                styles.likeInfo,
                styles.dislikingInfo,
                {
                  opacity: this.isDislikingOpacity
                }
              ]}
            />

            <View
              style={[
                styles.likeInfo,
                styles.likingInfo,
                {
                  opacity: this.isLikingOpacity
                }
              ]}
            />

            <View
              style={[
                styles.likeInfo,
                styles.skippingInfo,
                {
                  opacity: this.isSkippingOpacity
                }
              ]}
            />

            <View
              style={[
                styles.box,
                {
                  transform: [
                    {
                      translateX: multiply(this.translateX, 1.5),
                      translateY: this.translateY,
                      rotate: multiply(this.translateX, 0.0009)
                    }
                  ]
                }
              ]}
            >
              <Image
                source={{
                  uri: interactiveItem.url
                }}
                style={styles.background}
              />
            </View>
            <Overlay
              style={styles.skippingInfo}
              opacity={this.isSkippingOpacity}
              text="Skip it"
            />
            <Overlay
              style={styles.dislikingInfo}
              opacity={this.isDislikingOpacity}
              text="Leave it"
            />
            <Overlay
              style={styles.likingInfo}
              opacity={this.isLikingOpacity}
              text="Take it"
            />
          </View>
        </PanGestureHandler>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  likeInfo: {
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    position: 'absolute'
  },
  likingInfo: {
    backgroundColor: colors.green
  },
  dislikingInfo: {
    backgroundColor: colors.red
  },
  skippingInfo: {
    backgroundColor: colors.blue
  },
  likingOverlay: {
    backgroundColor: colors.green
  },
  dislikingOverlay: {
    backgroundColor: colors.red
  },
  background: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover'
  },
  container: {
    position: 'relative',
    alignItems: 'stretch',
    justifyContent: 'center',
    flex: 1
  },
  box: {
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    position: 'absolute'
  }
})

export default App
