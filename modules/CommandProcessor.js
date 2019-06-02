let uid = 0

export const commandTypes = {
  JUMP: 'JUMP',
  TURN_AROUND: 'TURN_AROUND',
  STOP: 'STOP',
  MOVE: 'MOVE',
  ROTATE: 'ROTATE',
  CONTINUE: 'CONTINUE'
}

export const parseRawCommand = (cmdString) => {
  const str = cmdString.toLowerCase()
  let type, error = null

  if (str == 'jump') type = commandTypes.JUMP
  else if (str == 'turn around') type = commandTypes.TURN_AROUND
  else if (str == 'stop') type = commandTypes.STOP
  else if (str == 'move') type = commandTypes.MOVE
  else if (str == 'rotate') type = commandTypes.ROTATE
  else if (str == 'continue') type = commandTypes.CONTINUE
  else error = 'Invalid command!'

  return {
    type: type,
    uid: uid++,
    error
  }
}