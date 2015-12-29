export default function (state, action) {
  return state.updateIn(['matches', '0', 'portfolio', 'stocks'], () => action.updatedStockArray);
}


