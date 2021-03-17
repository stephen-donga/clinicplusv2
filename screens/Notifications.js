import React,{useState, useEffect} from 'react'
import { View,FlatList, Text,Dimensions,TouchableOpacity,} from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'
import {urlConnection} from '../url'

const window = Dimensions.get('window')
const screen = Dimensions.get('screen')

const Notifications = ({route,navigation}) => {

    const [dimensions, setDimensions] = useState({ window, screen });
    const onChange = ({ window, screen }) => {
        setDimensions({ window, screen });
    }

    const id = route.params;
    const [notifications, setNotifications] = useState([])

    const fetchNotifications = ()=>{

        fetch(urlConnection(`notifications/${id}`))
        .then(res => res.json())
        .then(res=> setNotifications(res))
        .catch(err=>console.log(err))
}

useEffect(() => {
    Dimensions.addEventListener("change", onChange)
    return () => {
        Dimensions.removeEventListener("change", onChange)
    }
}, [])


    useEffect(() => {
        fetchNotifications()
        return () => {
             
        }
    }, [])
    return (
        <View style={{flex:1,backgroundColor:'#fff'}}>

            <View style={{width:'100%',height:40,flexDirection:'row',justifyContent:'space-between', backgroundColor:'#92D1C6'}}>
                 <TouchableOpacity
                 onPress={()=>navigation.navigate('TestList')}
                  >
                     <AntDesign name='arrowleft' size={21} style={{marginTop:8,paddingLeft:10,color:'#fff'}} />
                 </TouchableOpacity>
                <Text style={{fontWeight:'bold',fontSize:17, marginLeft:-20,marginTop:8,color:'#fff'}}>Notifications</Text>
                <Text style={{fontWeight:'bold', marginLeft:10,marginTop:8,color:'#fff'}}></Text>
            </View>

          <View style={{flex:1,justifyContent:'center'}}>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={notifications} 
            keyExtractor={(item,idx)=>`${idx}`}
            renderItem={({item})=>(
               <View style={{width:dimensions.window.width-20,height:80,justifyContent:'space-between',backgroundColor:'#fff',alignSelf:'center',elevation:5,padding:5,margin:5,}}>
                   <Text>{item.action}</Text>
                   <View style={{flexDirection:'row'}}>
                   <Text style={{fontSize:14,color:'grey'}}>{item.time}</Text>
                   <Text> </Text>
                   </View>

               </View>
           )}
            /> 

          </View>

        </View>
    )
}

export default Notifications
