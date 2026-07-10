import { PermissionsAndroid, Platform } from "react-native";

export async function requestBluetoothPermissions(): Promise<boolean> {
  if (Platform.OS === "android") {
    const permissions: string[] = [];
    if (Platform.Version >= 23 && Platform.Version <= 30) {
      permissions.push(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
    } else if (Platform.Version >= 31) {
      permissions.push(
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      );
    }

    if (permissions.length === 0) {
      return true;
    }
    const granted = await PermissionsAndroid.requestMultiple(
      permissions as any,
    );
    return Object.values(granted).every(
      (result) => result === PermissionsAndroid.RESULTS.GRANTED,
    );
  }
  return true;
}
