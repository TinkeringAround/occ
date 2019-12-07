export type TColors =
  | 'white'
  | 'whiteHover'
  | 'whiteTransparent'
  | 'lightGrey'
  | 'grey'
  | 'darkGrey'
  | 'lightblue'
  | 'lightblueHover'
  | 'red'
  | 'yellow'
  | 'green'
  | 'black'

export const colors = {
  white: 'rgb(243,246,249)',
  whiteHover: 'rgba(255,255,255,0.1)',
  whiteTransparent: 'rgba(255,255,255,0.25)',

  lightGrey: 'rgb(232,234,236)',
  grey: 'rgb(160,160,160)',
  darkGrey: 'rgb(106,111,113)',
  black: 'rgb(8, 91,10)',

  lightblue: 'rgb(19,95,246)',
  lightblueHover: 'rgba(19,95,246,0.35)',

  red: 'rgb(230, 57, 70)',
  yellow: 'rgb(230,190,30)',
  green: 'rgb(87, 192 ,56)'
}

// ==========================================================
export const sizes = {
  navigation: 75,

  windowMinHeight: 650,
  windowMinWidth: 960
}
