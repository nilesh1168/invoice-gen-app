
import React, { PropsWithChildren } from "react";
import { StatusBar , View} from "react-native";
import { isAndroid } from "../../utils/platform";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { router } from "expo-router";
// create a container component that takes the current width and height substracts the status bar height 
// adds padding of 16px on the left and right side

const Container: React.FC<PropsWithChildren> = ({ children }) => {
    const statusBarHeight = () =>{
        if(isAndroid){
           return StatusBar.currentHeight 
        }
        else{
            return useSafeAreaInsets().top
        }
    }
  return (
    <View
      style={{
        flex: 1,
        padding: 16,
        paddingTop: statusBarHeight(),
        backgroundColor: "white",
      }}
    >
      {children}
    </View>
  );
};

export { Container};