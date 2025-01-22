export function Hub() {
  return (
    <View style={styles.container}>
      <View style={styles.hub}>
        // ... existing hub content
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // ... existing container styles
  },
  hub: {
    // ... existing hub styles
    backgroundColor: '#FFEB3B', // Material Design Yellow 500
    // Alternative yellow options:
    // backgroundColor: '#FDD835', // Material Design Yellow 600 (slightly darker)
    // backgroundColor: '#FFEE58', // Material Design Yellow 400 (slightly lighter)
    // backgroundColor: '#FFD700', // Classic Gold yellow
  },
}); 