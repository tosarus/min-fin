export const BEGIN_AJAX_CALL = '@@ajax/BEGIN_AJAX_CALL';
export const STOP_AJAX_CALL = '@@ajax/STOP_AJAX_CALL';

export const beginAjaxCall = (message: string) => ({ type: BEGIN_AJAX_CALL, message } as const);
export const stopAjaxCall = (message: string) => ({ type: STOP_AJAX_CALL, message } as const);
