import React,{useState, useEffect} from 'react'
import { View,ScrollView, Text, ActivityIndicator, TouchableOpacity,TextInput, Dimensions,StyleSheet} from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Modal from 'react-native-modal';
import {urlConnection} from '../url'


const window = Dimensions.get('window')
const screen = Dimensions.get('screen')

const ResetPassword = ({route,navigation}) => {

    const result = route.params;

    const [dimensions, setDimensions] = useState({ window, screen });
    const onChange = ({ window, screen }) => {
        setDimensions({ window, screen });
    }

    const [password, setPassword] = useState('')
    const [confirmPassword, setComfirmPassword] = useState('')
    const [border, setBorder] = useState('#32c5d2')
    const [loading, setLoading] = useState(false)
    const [mismatchError, setMismatchError] = useState('')

    // modal state..
    const [modalVisible, setModalVisible] = useState(false)

    const handleReset = ()=>{
        if(password.length < 5){
            setMismatchError('Password must be 6-8 characters long !')
            return;
        }
        if(password !==confirmPassword){
            setMismatchError('Passwords don\'t match !')
            return;
        }
        setMismatchError('')
        setLoading(true)
        
        fetch(urlConnection(`password_reset`),{
            method:'POST',
            headers:{
                'Content-type':'application/json'
            },
            body:JSON.stringify({
                user_id:result.user_id,
                pwd1:password,
                pwd2:confirmPassword,
                token:result.token
            })
        })
        .then(res =>res.json())
        .then(res =>{
            setModalVisible(true)
            setLoading(false)
            setModalVisible(true)
            console.log(res)
        })

    }

    useEffect(() => {
        Dimensions.addEventListener("change", onChange)
        return () => {
            Dimensions.removeEventListener("change", onChange)
            setModalVisible(false)
        }
    }, [])

    return (
        <ScrollView
        showsVerticalScrollIndicator={false}
         style={{height:'100%',width:'100%',backgroundColor:'#fff'}}>
             <View style={{width:'100%',flexDirection:'row',paddingTop:10,height:40,backgroundColor:'#92D1C6',justifyContent:'space-between'}}>
                
                <TouchableOpacity
                >
                </TouchableOpacity>
                <Text style={{fontSize:16,color:'#fff' ,fontWeight:'bold'}}>Reset Password</Text>
                <Text></Text>
            </View>
            <View>
            <View style={{width:'100%',height:'30%',justifyContent:'center',alignItems:'center'}}>
                <AntDesign name='lock' size={70} style={{paddingLeft:10,color:'#10093E'}} />

            </View>
            <Text style={{alignSelf:'center',color:'red'}}>{mismatchError}</Text>
            <View style={{width:'100%',height:'90%',backgroundColor:'#fff',alignItems:'center'}}>
               
                <TextInput 
                    placeholder='Password'
                    value={password}
                    onChangeText={e =>setPassword(e)}
                    secureTextEntry={true}
                    style={{width:dimensions.window.width/2+80,borderBottomWidth:1,borderBottomColor:border,margin:15,backgroundColor:'#dde3ec',paddingHorizontal:10}}
                    />

                 <TextInput 
                    placeholder='Confirm Password'
                    value={confirmPassword}
                    onChangeText={e =>setComfirmPassword(e)}
                    secureTextEntry={true}
                    style={{width:dimensions.window.width/2+80,borderBottomWidth:1,borderBottomColor:border,margin:15,backgroundColor:'#dde3ec',paddingHorizontal:10}}
                    />

                <TouchableOpacity
                    onPress={handleReset}
                    style={{width:dimensions.window.width/2+80,height:50,backgroundColor:'#32c5d2',alignSelf:'center', borderRadius:30,margin:10,alignItems:'center',justifyContent:'center'}}
                    >
                    {
                        loading ?(
                            <ActivityIndicator size='large' color="#fff" style={{position:'absolute',alignSelf:'center'}}/>

                        )
                        :
                        (
                            <Text style={{fontSize:16,color:'#fff'}}>Reset</Text>
                        )
                    }
                 </TouchableOpacity>
                 <TouchableOpacity
                 style={{width:'100%',height:130,backgroundColor:'#fff'}}
                 >

                 </TouchableOpacity>
                 </View>
            </View>
            <Modal
            isVisible={modalVisible}
            >
                <ScrollView 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{width:'100%',height:'80%' ,alignSelf:'center',alignItems:'center',justifyContent:'center',padding:15,backgroundColor:'#fff'}}
                >
                    <View
                            style={{position:'absolute',width:50,height:50,backgroundColor:'#fff',flexDirection:'row',justifyContent:'flex-end',top:10,right:10}} 
                            >
                                <TouchableOpacity
                                onPress={()=>{
                                    setModalVisible(false)
                                    navigation.navigate('Login')


                                }}
                                >
                                    <MaterialIcons name='cancel' color='#10093E' size={35}/>
                                </TouchableOpacity>

                            </View>
                    
                    <View
                    style={{width:dimensions.window.width/2,height:dimensions.window.width/2,borderRadius:(dimensions.window.width/2)/2,backgroundColor:'#9FE8EE',justifyContent:'center',alignItems:'center'}} 
                    >
                    <View style={{width:dimensions.window.width/3,height:dimensions.window.width/3,borderRadius:(dimensions.window.width/3)/2,backgroundColor:'#32c5d2',justifyContent:'center',alignItems:'center',}}>

                    <Text style={{fontSize:35,color:'#fff'}}>Done !</Text>
                    </View>
                    </View>
                    <Text style={{marginVertical:15,fontSize:16,color:'black',fontWeight:'bold'}}> Login with new Password !</Text>
                </ScrollView>

            </Modal>
        </ScrollView>
    )
}

export default ResetPassword
