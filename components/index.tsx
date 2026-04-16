// import { bootstrapAuth } from "@/scripts/bootstrapLogin";
// import { useRouter } from "expo-router";
// import { useEffect } from "react";
// import { ActivityIndicator, View } from "react-native";

// export default function Index() {
//     const router = useRouter();

//     useEffect(() => {
//         async function init() {
//             const isAuth = await bootstrapAuth();

//             if (isAuth) {
//                 router.replace("/(tabs)/Dashboard");
//             } else {
//                 router.replace("/Login");
//             }
//         }

//         init();
//     }, []);

//     return (
//         <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//             <ActivityIndicator size="large" />
//         </View>
//     );
// }