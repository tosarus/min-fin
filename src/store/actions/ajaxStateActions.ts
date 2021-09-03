export const BEGIN_AJAX_CALL = 'BEGIN_AJAX_CALL';
export const STOP_AJAX_CALL = 'STOP_AJAX_CALL';

interface BeginAjaxCallAction {
  type: typeof BEGIN_AJAX_CALL;
  message: string;
}

interface StopAjaxCallAction {
  type: typeof STOP_AJAX_CALL;
  message: string;
}

export type AjaxCallActionTypes = BeginAjaxCallAction | StopAjaxCallAction;

export const beginAjaxCall = (message: string) => ({ type: BEGIN_AJAX_CALL, message });
export const stopAjaxCall = (message: string) => ({ type: STOP_AJAX_CALL, message });
