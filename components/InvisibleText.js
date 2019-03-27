import React from 'react'
import { PERFORMANCE_PHASES } from '../constants'

export default class InvisibleText extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    const { performancePhase } = this.props
    return (
      <div className="invisible-text-container">
        { performancePhase == PERFORMANCE_PHASES.CENTRALIZED &&
          <div className="invisible-text">
            <p>The first scene is the Creature forming from lines into a blob.</p>

            <p>Quick, gestural hand drawing with teal ink on white background: the foreground is a roughly circular clump of short teal lines arranged playfully and the background or “the Garden” is suggested by 4 cartoon trees in the top right corner. There is no depth of field.</p>

            <p>The background or “Garden” is consistent. In the foreground the lines clumped in a rough circle are now morphing into squiggles with a form, “the Creature,” emerging from the ground.</p>

            <p>The Creature is emerging in the Garden and now has eyes and a mouth. Its shape is becoming more distinct, which is like a stretched droplet with a square-ish bottom.</p>

            <p>The Creature has now fully condensed from the the clump of lines into its final form, which is the aforementioned stretched droplet with square bottom. It has simple lines for arms and fingers, legs, and tiny feet, with two dots for eyes and a line for a mouth. Its arms are raised up and it is wearing a faint smile.</p>
          </div>
        }

        { performancePhase == PERFORMANCE_PHASES.DECENTRALIZED &&
          <div className="invisible-text">
            <p>In the second scene, we are in the Garden now. Participants can water the Garden by tapping on their mobile device, which makes plants grow. Creature may be able to come in and out. </p>

            <p>Image on white background with hand drawn teal lines in a childlike, cartoon style. The Creature enters the Garden, which now resembles a series of short lines that form a suggested landscape.</p>

            <p>The Garden begins to grow and the series of lines begin to condense into three small trees in the foreground/bottom right hand corner, and a small mushroom and evergreen tree in the background. Creature resides in the middle-right of the composition.</p>

            <p>The Garden is watered with fluorescent pink droplets that rain in a cone formation on top of the plants. The plants grow taller and bigger.</p>

            <p>>The Creature stands in the Garden and looks significantly smaller now that the surrounding plants have grown to a large size. Pink rain continues to shower a large mushroom that has now eclipsed the size of the Creature.</p>
          </div>
        }

        { performancePhase == PERFORMANCE_PHASES.DISTRIBUTED &&
          <div className="invisible-text">
            <p>In the third scene, the plants in the garden have grown to fill the screen. </p>

            <p>Cartoon-style drawing with teal ink on white background. The Garden has a large mushroom in the right-side foreground, 4 trees in the left-side middle ground, and mushrooms and a tall evergreen in the background.</p>

            <p>Creature is a blobby square with a long tapered hump pointing up like a droplet, with a simple face of dots for eyes and a line for an impassive smile. Its arms are upraised and it teeters on little line legs and feet. There are multiple Creatures.</p>

          </div>
        }

      </div>
    )
  }
}