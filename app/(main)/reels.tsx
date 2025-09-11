import { StyleSheet, Text, View } from 'react-native';

export default function ReelsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sección de Reels</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});