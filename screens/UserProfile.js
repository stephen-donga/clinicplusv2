import React from 'react'
import { View,ScrollView, Text,TouchableOpacity } from 'react-native'
import Feather from 'react-native-vector-icons/Feather'
import AntDesign from 'react-native-vector-icons/AntDesign'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import {connect} from 'react-redux'

const UserProfile = ({currentUser,navigation}) => {

    const capitalize = (name)=>{
        return name.charAt(0).toUpperCase()+name.slice(1)
    }
    
    return (
        <View style={{flex:1}}>
             <View style={{width:'100%',flexDirection:'row',paddingTop:10,height:40,backgroundColor:'#92D1C6',justifyContent:'space-between'}}>
                
                <TouchableOpacity
                onPress={()=>navigation.goBack()}
                >
                <AntDesign name='arrowleft' size={21} style={{paddingLeft:10,color:'#fff'}} />
                </TouchableOpacity>
                <Text style={{fontSize:17,color:'#fff',marginLeft:-35,fontWeight:'bold'}}>User Profile</Text>
                <Text></Text>
            </View>
            <View style={{width:'100%',height:'30%',backgroundColor:'#92D1C6',justifyContent:'center',alignItems:'center'}}>
                <Feather name='user' color='#fff' size={60}/>
                <Text style={{fontSize:17,fontWeight:'bold',color:'#fff',margin:10}}>{capitalize(currentUser.name.toLowerCase())}</Text>

            </View>
            <ScrollView 
            contentContainerStyle={{width:'100%',padding:10,height:'100%',backgroundColor:'#fff'}}
            >
                <ScrollView
                showsVerticalScrollIndicator={false} 
                >
                     <View style={{flexDirection:'row',margin:10}}>
                        <Feather name='mail' color='#92C1C2' size={24} />
                        <Text style={{fontSize:15,color:'#10093E',fontWeight:'bold',marginLeft:10}}>{currentUser.email}</Text>
                     </View>

                     <View style={{flexDirection:'row',margin:10}}>
                        <Feather name='phone' color='#92C1C2' size={24} />
                        <Text style={{fontSize:15,color:'#10093E',fontWeight:'bold',marginLeft:10}}>+256{' '}{currentUser.contact}</Text>
                     </View>

                     <View style={{flexDirection:'row',margin:10}}>
                        <Feather name='map-pin' color='#92C1C2' size={24} />
                        <Text style={{fontSize:15,color:'#10093E',fontWeight:'bold',marginLeft:10}}>{capitalize(currentUser.address.toLowerCase())}</Text>
                     </View>

                     <View style={{flexDirection:'row',margin:10}}>
                        <MaterialIcon name='admin-panel-settings' color='#92C1C2' size={24} />
                        <Text style={{fontSize:15,color:'#10093E',fontWeight:'bold',marginLeft:10}}>{capitalize(currentUser.position.toLowerCase())}</Text>
                     </View>
                     

                    </ScrollView>
            </ScrollView>
             
        </View>
    )
}

const mapStateToProps = ({user})=>({
    currentUser: user.currentUser
})

export default connect(mapStateToProps)(UserProfile)
