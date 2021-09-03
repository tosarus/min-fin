import { AjaxCallActionTypes, BEGIN_AJAX_CALL, STOP_AJAX_CALL } from '../actions';

interface AjaxStatusState {
  count: number;
  messages: string[];
}
const initialState: AjaxStatusState = { count: 0, messages: [] };

export default function ajaxStatusReduser(state = initialState, action: AjaxCallActionTypes) {
  if (action.type === BEGIN_AJAX_CALL) {
    const count = state.count + 1;
    const messages = [...state.messages, action.message];
    return { count, messages };
  }

  if (action.type === STOP_AJAX_CALL) {
    const count = Math.max(state.count - 1, 0);
    const messages = count ? [...state.messages.filter((msg) => msg !== action.message)] : [];
    return { count, messages };
  }

  return state;
}
