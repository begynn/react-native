export type SDKEventType =
  | 'ready'
  | 'onboarding_start'
  | 'onboarding_complete'
  | 'onboarding_exit'
  | 'screen_view'
  | 'screen_leave'
  | 'navigation_back'
  | 'button_click'
  | 'choice_select'
  | 'choice_deselect';

export type OnboardingPayload = Record<string, string[]>;

export interface BaseSDKEvent {
  type: SDKEventType;
  timestamp: string;
  onboarding_id: string;
  session_id: string;
  uid: string;
  placement_id: string;
}

export interface ReadyEvent extends BaseSDKEvent {
  type: 'ready';
  total_screens: number;
}

export interface OnboardingStartEvent extends BaseSDKEvent {
  type: 'onboarding_start';
  first_screen_id: string;
  total_screens: number;
}

export interface OnboardingCompleteEvent extends BaseSDKEvent {
  type: 'onboarding_complete';
  total_duration_ms: number;
  screens_viewed: number;
  payload: OnboardingPayload;
}

export interface OnboardingExitEvent extends BaseSDKEvent {
  type: 'onboarding_exit';
  last_screen_id: string;
  last_screen_index: number;
  progress_percentage: number;
  payload: OnboardingPayload;
}

export interface ScreenViewEvent extends BaseSDKEvent {
  type: 'screen_view';
  screen_id: string;
  screen_index: number;
  screen_name: string;
  is_first: boolean;
  is_last: boolean;
}

export interface ScreenLeaveEvent extends BaseSDKEvent {
  type: 'screen_leave';
  screen_id: string;
  screen_index: number;
  duration_ms: number;
}

export interface NavigationBackEvent extends BaseSDKEvent {
  type: 'navigation_back';
  from_screen_id: string;
  to_screen_id: string;
}

export interface ButtonClickEvent extends BaseSDKEvent {
  type: 'button_click';
  button_id: string;
  button_text: string;
  screen_id: string;
  action: 'navigate' | 'none';
  target_screen_id?: string;
}

export interface ChoiceSelectEvent extends BaseSDKEvent {
  type: 'choice_select';
  choicelist_id: string;
  option_id: string;
  option_title: string;
  screen_id: string;
  mode: 'single' | 'multiple';
  all_selected: string[];
}

export interface ChoiceDeselectEvent extends BaseSDKEvent {
  type: 'choice_deselect';
  choicelist_id: string;
  option_id: string;
  option_title: string;
  screen_id: string;
  all_selected: string[];
}

export type SDKEvent =
  | ReadyEvent
  | OnboardingStartEvent
  | OnboardingCompleteEvent
  | OnboardingExitEvent
  | ScreenViewEvent
  | ScreenLeaveEvent
  | NavigationBackEvent
  | ButtonClickEvent
  | ChoiceSelectEvent
  | ChoiceDeselectEvent;

export interface SDKMessage {
  source: 'begynn-onboarding';
  version: '1.0';
  event: SDKEvent;
}
