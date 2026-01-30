# @begynn/react-native

React Native SDK for embedding Begynn onboarding flows in your mobile applications.

## Installation

```bash
npm install @begynn/react-native react-native-webview @react-native-async-storage/async-storage
# or
yarn add @begynn/react-native react-native-webview @react-native-async-storage/async-storage
# or
pnpm add @begynn/react-native react-native-webview @react-native-async-storage/async-storage
```

### Expo

```bash
npx expo install @begynn/react-native react-native-webview @react-native-async-storage/async-storage
```

### iOS (React Native CLI)

```bash
cd ios && pod install
```

## Quick Start

```tsx
import { BegynnOnboarding } from "@begynn/react-native";

function OnboardingScreen() {
  return (
    <BegynnOnboarding
      placementId="your-placement-id"
      onComplete={(event) => {
        console.log("Onboarding completed!", event.payload);
      }}
    />
  );
}
```

The SDK automatically generates and persists a unique user ID using AsyncStorage. This ID is maintained across app sessions to ensure consistent user tracking and A/B testing.

### Preview Mode

Use `isPreview` to test your onboarding without affecting analytics:

```tsx
<BegynnOnboarding placementId="your-placement-id" isPreview />
```

## Props

| Prop             | Type                 | Required | Description                                                                                           |
| ---------------- | -------------------- | -------- | ----------------------------------------------------------------------------------------------------- |
| `placementId`    | `string`             | Yes      | The placement ID from your Begynn dashboard                                                           |
| `isPreview`      | `boolean`            | No       | Enable preview mode to test without being locked on a variant and impacting quotas (default: `false`) |
| `baseUrl`        | `string`             | No       | Custom base URL (default: `https://begynn.com`)                                                       |
| `containerStyle` | `ViewStyle`          | No       | Style for the container View                                                                          |
| `webViewProps`   | `WebViewProps`       | No       | Additional props passed to the WebView                                                                |
| `renderLoading`  | `() => ReactElement` | No       | Custom loading component                                                                              |
| `debug`          | `boolean`            | No       | Enable debug logging (default: `false`)                                                               |

## Event Handlers

### Lifecycle Events

| Handler      | Event Type                | Description                                   |
| ------------ | ------------------------- | --------------------------------------------- |
| `onReady`    | `ReadyEvent`              | Fired when the onboarding is loaded and ready |
| `onStart`    | `OnboardingStartEvent`    | Fired when the user starts the onboarding     |
| `onComplete` | `OnboardingCompleteEvent` | Fired when the user completes the onboarding  |
| `onExit`     | `OnboardingExitEvent`     | Fired when the user exits before completing   |

### Navigation Events

| Handler            | Event Type            | Description                   |
| ------------------ | --------------------- | ----------------------------- |
| `onScreenView`     | `ScreenViewEvent`     | Fired when a screen is viewed |
| `onScreenLeave`    | `ScreenLeaveEvent`    | Fired when leaving a screen   |
| `onNavigationBack` | `NavigationBackEvent` | Fired when navigating back    |

### Interaction Events

| Handler            | Event Type            | Description                       |
| ------------------ | --------------------- | --------------------------------- |
| `onButtonClick`    | `ButtonClickEvent`    | Fired when a button is clicked    |
| `onChoiceSelect`   | `ChoiceSelectEvent`   | Fired when a choice is selected   |
| `onChoiceDeselect` | `ChoiceDeselectEvent` | Fired when a choice is deselected |

### Generic Handler

| Handler   | Event Type | Description                |
| --------- | ---------- | -------------------------- |
| `onEvent` | `SDKEvent` | Fired for all events       |
| `onError` | `Error`    | Fired when an error occurs |

## Event Payloads

### OnboardingCompleteEvent

```typescript
{
  type: "onboarding_complete";
  timestamp: string;
  onboarding_id: string;
  session_id: string;
  uid: string;
  placement_id: string;
  total_duration_ms: number;
  screens_viewed: number;
  payload: Record<string, string[]>; // User choices from choicelists
}
```

The `payload` object contains user responses from choicelists, keyed by choicelist ID:

```typescript
{
  "choicelist-goals": ["fitness", "nutrition"],
  "choicelist-experience": ["beginner"]
}
```

### OnboardingExitEvent

```typescript
{
  type: "onboarding_exit";
  timestamp: string;
  onboarding_id: string;
  session_id: string;
  uid: string;
  placement_id: string;
  last_screen_id: string;
  last_screen_index: number;
  progress_percentage: number;
  payload: Record<string, string[]>;
}
```

### ScreenViewEvent

```typescript
{
  type: "screen_view";
  timestamp: string;
  onboarding_id: string;
  session_id: string;
  uid: string;
  placement_id: string;
  screen_id: string;
  screen_index: number;
  screen_name: string;
  is_first: boolean;
  is_last: boolean;
}
```

## Ref Methods

Access imperative methods using a ref:

```tsx
import { useRef } from "react";
import { BegynnOnboarding, BegynnOnboardingRef } from "@begynn/react-native";

function OnboardingScreen() {
  const ref = useRef<BegynnOnboardingRef>(null);

  const handleReload = () => {
    ref.current?.reload();
  };

  return <BegynnOnboarding ref={ref} placementId="your-placement-id" />;
}
```

| Method     | Description                   |
| ---------- | ----------------------------- |
| `reload()` | Reload the onboarding WebView |

## Full Example

```tsx
import { useRef } from "react";
import { View, ActivityIndicator, Alert } from "react-native";
import {
  BegynnOnboarding,
  BegynnOnboardingRef,
  OnboardingCompleteEvent,
  OnboardingExitEvent,
} from "@begynn/react-native";

function OnboardingScreen({ onFinish }) {
  const ref = useRef<BegynnOnboardingRef>(null);

  const handleComplete = (event: OnboardingCompleteEvent) => {
    console.log("Completed in", event.total_duration_ms, "ms");
    console.log("User choices:", event.payload);
    onFinish();
  };

  const handleExit = (event: OnboardingExitEvent) => {
    Alert.alert(
      "Exit Onboarding?",
      `You're ${event.progress_percentage}% done.`,
      [
        { text: "Continue", onPress: () => ref.current?.reload() },
        { text: "Exit", onPress: onFinish },
      ],
    );
  };

  return (
    <BegynnOnboarding
      ref={ref}
      placementId="onboarding-v2"
      debug={__DEV__}
      containerStyle={{ flex: 1 }}
      renderLoading={() => (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" />
        </View>
      )}
      onComplete={handleComplete}
      onExit={handleExit}
      onError={(error) => console.error("Onboarding error:", error)}
    />
  );
}
```

## TypeScript

All types are exported from the package:

```typescript
import type {
  BegynnOnboardingProps,
  BegynnOnboardingRef,
  SDKEvent,
  SDKEventType,
  ReadyEvent,
  OnboardingStartEvent,
  OnboardingCompleteEvent,
  OnboardingExitEvent,
  ScreenViewEvent,
  ScreenLeaveEvent,
  NavigationBackEvent,
  ButtonClickEvent,
  ChoiceSelectEvent,
  ChoiceDeselectEvent,
  OnboardingPayload,
} from "@begynn/react-native";
```

## Requirements

- React Native >= 0.70.0
- React >= 18.0.0
- react-native-webview >= 13.0.0
- @react-native-async-storage/async-storage >= 1.19.0

## License

MIT
