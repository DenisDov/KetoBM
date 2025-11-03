import { Text, View } from "@/components/Themed";
import { Image } from 'expo-image';
import { StyleSheet } from "react-native";

export default function LandingScreen() {
  return (
    <View style={styles.container}>
        <Image
        style={styles.image}
        source="https://picsum.photos/seed/696/3000/2000"
        // placeholder={{ blurhash }}
        contentFit="cover"
        transition={1000}
      />
      <Text>Landing Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    image: {
      flex: 1,
      width: '100%',
      backgroundColor: '#0553',
    },
  });
