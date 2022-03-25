export interface ColorState {
    color: string;
}

export enum ColorActionType {
    CHANGE_COLOR_TO_BLUE = 'CHANGE_COLOR_TO_BLUE',
    CHANGE_COLOR_TO_BLACK = 'CHANGE_COLOR_TO_BLACK'
}

export interface ColorAction {
    type: ColorActionType,
    payload: string,
}

export function testReducer(state: ColorState, action: ColorAction) {
  switch (action.type) {
    case ColorActionType.CHANGE_COLOR_TO_BLUE:
        return {
            ...state,
            color: action.payload
        }
    case ColorActionType.CHANGE_COLOR_TO_BLACK:
        return {
            ...state,
            color: action.payload
        }
    default:
      return state;
  }
}