import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState, } from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { getOrCreateUID } from './uid';
const DEFAULT_BASE_URL = 'https://begynn.com';
export const BegynnOnboarding = forwardRef(({ placementId, isPreview = false, baseUrl = DEFAULT_BASE_URL, containerStyle, webViewProps, renderLoading, debug = false, onReady, onStart, onComplete, onExit, onScreenView, onScreenLeave, onNavigationBack, onButtonClick, onChoiceSelect, onChoiceDeselect, onEvent, onError, }, ref) => {
    const webViewRef = useRef(null);
    const [resolvedUid, setResolvedUid] = useState(isPreview ? "preview" : null);
    useEffect(() => {
        if (isPreview) {
            setResolvedUid("preview");
            return;
        }
        getOrCreateUID().then(setResolvedUid);
    }, [isPreview]);
    useImperativeHandle(ref, () => ({
        reload: () => {
            webViewRef.current?.reload();
        },
    }));
    if (!resolvedUid) {
        if (renderLoading) {
            return <View style={[styles.container, containerStyle]}>{renderLoading()}</View>;
        }
        return <View style={[styles.container, containerStyle]}/>;
    }
    const url = `${baseUrl}/render/${encodeURIComponent(placementId)}?uid=${encodeURIComponent(resolvedUid)}`;
    const handleMessage = useCallback((event) => {
        try {
            const data = JSON.parse(event.nativeEvent.data);
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
        }
        catch (error) {
            if (debug) {
                console.error('[Begynn SDK] Error parsing message:', error);
            }
            onError?.(error instanceof Error ? error : new Error(String(error)));
        }
    }, [
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
    ]);
    const handleError = useCallback((syntheticEvent) => {
        const error = new Error(syntheticEvent.nativeEvent.description);
        if (debug) {
            console.error('[Begynn SDK] WebView error:', error);
        }
        onError?.(error);
    }, [debug, onError]);
    return (<View style={[styles.container, containerStyle]}>
        <WebView ref={webViewRef} source={{ uri: url }} onMessage={handleMessage} onError={handleError} javaScriptEnabled domStorageEnabled startInLoadingState={!!renderLoading} renderLoading={renderLoading} {...webViewProps} style={[styles.webView, webViewProps?.style]}/>
      </View>);
});
BegynnOnboarding.displayName = 'BegynnOnboarding';
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    webView: {
        flex: 1,
    },
});
//# sourceMappingURL=BegynnOnboarding.js.map