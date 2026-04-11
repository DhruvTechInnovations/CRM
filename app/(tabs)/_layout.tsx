import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { Drawer } from "expo-router/drawer";
import CustomDrawerContent from '../CustomDrawerContent';



export default function DrawerLayout() {
  const colorScheme = useColorScheme();

  return (
    <Drawer drawerContent={(props) => { return <CustomDrawerContent {...props} /> }}>
      <Drawer.Screen
        name="Dashboard"
        options={{
          title: "Personal Dashboard",
          headerTitle: "My Dashboard",
          drawerIcon: ({ color }) => (
            <Ionicons size={24} name="folder" color={color} />
          ),
        }}
      />
    </Drawer>
  );
}
