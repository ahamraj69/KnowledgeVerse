import { View, Text } from "react-native";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
export default function CoursesAnalytics() {
  return <ProtectedRoute allow={["admin"]}><View style={{flex:1,backgroundColor:"#0B1220",padding:24}}><Text style={{color:"white",fontSize:20,fontWeight:"bold"}}>Curriculum Metrics Summary</Text></View></ProtectedRoute>;
}
