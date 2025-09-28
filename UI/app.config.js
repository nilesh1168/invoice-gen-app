export default {
  expo: {
    entryPoint: "./index.tsx",
    scheme: "invoiceGen",
    name: "InvoiceGen",
    slug: "InvoiceGen",
    version: "1.0.0",
    orientation: "portrait",
    newArchEnabled: true,
    ios: {
      icon:{
        dark: "./assets/ios-dark.png",
        light: "./assets/ios-light.png",
        tinted: "./assets/ios-tinted.png"
      },
      supportsTablet: true,
      bundleIdentifier: "com.invoicegen.UI"
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        monochromeImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      edgeToEdgeEnabled: true,
      package: "com.invoicegen.UI"
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    plugins: [
      "expo-router",
      [
        'expo-splash-screen',
        {
          image: './assets/splash-icon-dark.png',
          dark: {
            image: "./assets/splash-icon-light.png",
            backgroundColor: "#000000"
          },
          imageWidth: 200,
          resizeMode: 'contain',
          backgroundColor: '#ffffff'
        }
      ]
    ]
  }
};