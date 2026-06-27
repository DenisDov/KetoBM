These components are created using the `createBox` and `createText` functions from `shopify-restyle` to provide Restyle props to base React Native components.

## Usage

Instead of using regular React Native components with StyleSheet:

```jsx
// Before
<View style={styles.container}>
  <Text style={styles.title}>Hello World</Text>
</View>

// After
<Box backgroundColor="background" padding="m" borderRadius="s">
  <Text variant="header">Hello World</Text>
</Box>
```
