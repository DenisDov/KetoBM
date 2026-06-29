import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useVideoPlayer, VideoView } from "expo-video";
import { Platform, StyleSheet } from "react-native";
import { FontAwesome } from "@react-native-vector-icons/fontawesome";
import { PressableBox } from "@/components/primitives";

const VIDEO_URI = "https://www.w3schools.com/tags/mov_bbb.mp4";

export default function HelpVideoScreen() {
  const router = useRouter();
  const player = useVideoPlayer(VIDEO_URI, (player) => {
    player.play();
  });

  return (
    <>
      <StatusBar hidden />
      <VideoView
        player={player}
        style={styles.video}
        contentFit="contain"
        nativeControls
      />
      <PressableBox
        position="absolute"
        top={Platform.OS === "ios" ? 50 : 16}
        right={16}
        height={48}
        width={48}
        justifyContent="center"
        alignItems="center"
        borderRadius="xl"
        backgroundColor="neutral900"
        opacity={0.8}
        onPress={() => router.back()}>
        <FontAwesome name="close" size={24} color="white" />
      </PressableBox>
    </>
  );
}

const styles = StyleSheet.create({
  video: {
    flex: 1,
    backgroundColor: "black",
  },
});
