// import { View, Text, SafeAreaView } from "react-native";
// import React, { useEffect, useState } from "react";
// import { router } from "expo-router";
// import { BreathingCircle } from "@/components/BreathingCircle";
// import ControlBar from "@/components/ControlBar";

// const CountdownScreen = () => {
//   const [countdown, setCountdown] = useState(3);

//   let timerId: NodeJS.Timeout;

//   useEffect(() => {
//     if (countdown > 0) {
//       timerId = setTimeout(() => {
//         setCountdown(countdown - 1);
//         console.log(countdown);
//       }, 1000);
//     }

//     if (countdown === 0) {
//       router.dismissAll();
//       router.push("/meditation");
//     }
//   }, [countdown]);

//   return (
//     <View className="flex-1 bg-white">
//       <SafeAreaView className="flex-1 items-center justify-between">
//         <Text className="text-2xl text-gray-500 my-10">{countdown}</Text>
//         <BreathingCircle isActive={false} initialSize={50} />
//         <View className="min-h-[62px]" />
//       </SafeAreaView>
//     </View>
//   );
// };

// export default CountdownScreen;
