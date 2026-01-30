import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
} from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { WebView, WebViewMessageEvent, WebViewProps } from 'react-native-webview';

import {
  ButtonClickEvent,
  ChoiceDeselectEvent,
  ChoiceSelectEvent,
  NavigationBackEvent,
  OnboardingCompleteEvent,
  OnboardingExitEvent,
  OnboardingStartEvent,
  ReadyEvent,
  ScreenLeaveEvent,
  ScreenViewEvent,
  SDKEvent,
  SDKMessage,
} from './types';

const DEFAULT_BASE_URL = 'https://begynn.com';

export interface BegynnOnboardingRef {
  reload: () => void;
}

export interface BegynnOnboardingProps {
  placementId: string;
  uid: string;
  baseUrl?: string;
  containerStyle?: ViewStyle;
  webViewProps?: Omit<WebViewProps, 'source' | 'onMessage'>;
  renderLoading?: () => React.ReactElement;
  debug?: boolean;
  onReady?: (event: ReadyEvent) => void;
  onStart?: (event: OnboardingStartEvent) => void;
  onComplete?: (event: OnboardingCompleteEvent) => void;
  onExit?: (event: OnboardingExitEvent) => void;
  onScreenView?: (event: ScreenViewEvent) => void;
  onScreenLeave?: (event: ScreenLeaveEvent) => void;
  onNavigationBack?: (event: NavigationBackEvent) => void;
  onButtonClick?: (event: ButtonClickEvent) => void;
  onChoiceSelect?: (event: ChoiceSelectEvent) => void;
  onChoiceDeselect?: (event: ChoiceDeselectEvent) => void;
  onEvent?: (event: SDKEvent) => void;
  onError?: (error: Error) => void;
}

export const BegynnOnboarding = forwardRef<
  BegynnOnboardingRef,
  BegynnOnboardingProps
>(
  (
    {
      placementId,
      uid,
      baseUrl = DEFAULT_BASE_URL,
      containerStyle,
      webViewProps,
      renderLoading,
      debug = false,
      onReady,
      onStart,
      onComplete,
      onExit,
      onScreenView,
      onScreenLeave,
      onNavigationBack,
      onButtonClick,
      onChoiceSelect,
      onChoiceDeselect,
      onEvent,
      onError,
    },
    ref
  ) => {
    const webViewRef = useRef<WebView>(null);

    useImperativeHandle(ref, () => ({
      reload: () => {
        webViewRef.current?.reload();
      },
    }));

    const url = `${baseUrl}/render/${encodeURIComponent(placementId)}?uid=${encodeURIComponent(uid)}`;

    const handleMessage = useCallback(
      (event: WebViewMessageEvent) => {
        try {
          const data = JSON.parse(event.nativeEvent.data) as SDKMessage;

          if (data.source !== 'begynn-onboarding') {
            return;
          }

          const sdkEvent = data.event;

          if (debug) {
            console.log('[Begynn SDK]', sdkEvent.type, sdkEvent);
          }

          onEvent?.(sdkEvent);

          switch (sdkEvent.type) {
            case 'ready':
              onReady?.(sdkEvent);
              break;
            case 'onboarding_start':
              onStart?.(sdkEvent);
              break;
            case 'onboarding_complete':
              onComplete?.(sdkEvent);
              break;
            case 'onboarding_exit':
              onExit?.(sdkEvent);
              break;
            case 'screen_view':
              onScreenView?.(sdkEvent);
              break;
            case 'screen_leave':
              onScreenLeave?.(sdkEvent);
              break;
            case 'navigation_back':
              onNavigationBack?.(sdkEvent);
              break;
            case 'button_click':
              onButtonClick?.(sdkEvent);
              break;
            case 'choice_select':
              onChoiceSelect?.(sdkEvent);
              break;
            case 'choice_deselect':
              onChoiceDeselect?.(sdkEvent);
              break;
          }
        } catch (error) {
          if (debug) {
            console.error('[Begynn SDK] Error parsing message:', error);
          }
          onError?.(error instanceof Error ? error : new Error(String(error)));
        }
      },
      [
        debug,
        onEvent,
        onReady,
        onStart,
        onComplete,
        onExit,
        onScreenView,
        onScreenLeave,
        onNavigationBack,
        onButtonClick,
        onChoiceSelect,
        onChoiceDeselect,
        onError,
      ]
    );

    const handleError = useCallback(
      (syntheticEvent: { nativeEvent: { description: string } }) => {
        const error = new Error(syntheticEvent.nativeEvent.description);
        if (debug) {
          console.error('[Begynn SDK] WebView error:', error);
        }
        onError?.(error);
      },
      [debug, onError]
    );

    return (
      <View style={[styles.container, containerStyle]}>
        <WebView
          ref={webViewRef}
          source={{ uri: url }}
          onMessage={handleMessage}
          onError={handleError}
          javaScriptEnabled
          domStorageEnabled
          startInLoadingState={!!renderLoading}
          renderLoading={renderLoading}
          {...webViewProps}
          style={[styles.webView, webViewProps?.style]}
        />
      </View>
    );
  }
);

BegynnOnboarding.displayName = 'BegynnOnboarding';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webView: {
    flex: 1,
  },
});
