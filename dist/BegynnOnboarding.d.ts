import React from 'react';
import { ViewStyle } from 'react-native';
import { WebViewProps } from 'react-native-webview';
import { ButtonClickEvent, ChoiceDeselectEvent, ChoiceSelectEvent, NavigationBackEvent, OnboardingCompleteEvent, OnboardingExitEvent, OnboardingStartEvent, ReadyEvent, ScreenLeaveEvent, ScreenViewEvent, SDKEvent } from './types';
export interface BegynnOnboardingRef {
    reload: () => void;
}
export interface BegynnOnboardingProps {
    placementId: string;
    isPreview?: boolean;
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
export declare const BegynnOnboarding: React.ForwardRefExoticComponent<BegynnOnboardingProps & React.RefAttributes<BegynnOnboardingRef>>;
//# sourceMappingURL=BegynnOnboarding.d.ts.map