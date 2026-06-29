import Markdown from "react-native-marked";

const PRIVACY_POLICY = `
# KetoBM LLC Privacy Policy

Last updated: June 16, 2025, 09:05 AM

This Privacy Policy explains how KetoBM LLC ("we," "us," or "our") collects, uses, protects, and shares your information when you use our KetoBM mobile application (the "App"). The App connects to your ketone meter (and potentially glucose meter) to display your readings and stores this data in the cloud for your convenience, accessible only to you.

## 1. Information We Collect

We collect the following information:

- **Health Data**: Ketone and glucose readings from your connected meter.
- **Device Information**: Device identifiers, such as Bluetooth IDs.
- **Usage Data**: Information about how you use the App (e.g., frequency of use, features accessed).

## 2. How We Use Your Information

We use your information to:

- Display your ketone and glucose readings in the App.
- Enable cross-device access by securely storing data in the cloud, accessible only to you.
- Improve the App's performance and user experience.
- Provide customer support.
- Comply with legal obligations.

## 3. Sharing Your Information

We do not share your health data with third parties.

We may share anonymized usage data with analytics providers to improve our services.

## 4. Data Security

Your health data is stored securely in the cloud using encryption (AES-256) both at rest and in transit (via HTTPS/TLS).

We implement secure access controls, including user authentication, to ensure only you can access your data.

We use industry-standard security measures to protect your information from unauthorized access or breaches.

## 5. Your Rights and Choices

You can access, review, and delete your health data through the App's settings.

You may request a copy of your data or request its deletion at any time by contacting us at support@ketobm.com.

If you are in the European Economic Area (EEA) or California, you have additional rights under GDPR and CCPA, including the right to data portability and the right to opt-out of certain data practices.

## 6. Children's Privacy

The App is not intended for children under 13. We do not knowingly collect data from children under 13.

## 7. Changes to This Policy

We may update this Privacy Policy. Significant changes will be notified through the App or via email.

## 8. Data Storage and Transfer

Your data is stored in the cloud to provide access across your devices. This data remains under your control and is not shared with third parties.

Data may be transferred to and processed in countries outside your location, including the United States. We ensure appropriate safeguards (e.g., Standard Contractual Clauses) are in place for transfers from the EEA, in compliance with GDPR.

## 9. Compliance with GDPR and CCPA

**GDPR (European Users)**: We obtain your explicit consent for data collection and cloud storage. You have the right to withdraw consent, request access to your data, rectify inaccuracies, erase data, restrict processing, object to processing, and data portability. Contact us at support@ketobm.com to exercise these rights.

**CCPA (California Residents)**: You have the right to know what personal information is collected, request deletion, opt-out of sales (none occur here), and not be discriminated against for exercising these rights. We do not sell your data.

## 10. Contact Us

For questions about this Privacy Policy, contact us at support@ketobm.com.

## Disclaimer

The App is not intended to diagnose, treat, cure, or prevent any disease. Consult your healthcare provider for medical advice.
`;

export default function PolicyScreen() {
  return (
    <Markdown
      value={PRIVACY_POLICY}
      flatListProps={{
        contentContainerStyle: { paddingHorizontal: 16 },
      }}
    />
  );
}
