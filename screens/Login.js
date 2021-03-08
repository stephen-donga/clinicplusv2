import React,{useState, useEffect, useRef} from 'react'
import { View,ScrollView, Text, TouchableOpacity,TextInput } from 'react-native'
import Modal from 'react-native-modal';
import Loading from 'react-native-whc-loading'


import {connect} from 'react-redux'
import {setCurrentUser} from '../redux/user/userActions'


const checkIfValidEmail = require('../utils')

const Login = ({setLoggedInUser,navigation}) => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [emailChecking,setEmailChecking] = useState('')
    const [ loginMsg,setLoginMsg] = useState('')

    const [isModalVisible, setIsModalVisible] = useState(false)

    const [emailErrorMessage, setEmailErrorMessage] = useState("")
    const [passwordErrorMessage, setPasswordErrorMessage] = useState("")

    const loading = useRef(null)

    const loginToSystem = ()=>{
        fetch('https://clinicplusug.com/app/api/login',{
            method:'POST',
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body:JSON.stringify({
                email:email,
                password:password,
            })
            
        })
        .then(res=> res.json())
        .then(res=>{
            if(res.msg){
                setIsModalVisible(!isModalVisible)
                setLoginMsg('Failed to Login !')
            }else if(res.user_id){
                setLoggedInUser(res)
                navigation.navigate('TestList')
            }else{
                setIsModalVisible(!isModalVisible)
                setLoginMsg('An error ocurred')
            }
        })
        .catch(error=>console.warn(error))
    }

    const handleEmailChange = (text)=>{
        setEmail(text)
    }

    const handlePasswordChange = (text)=>{
        setPassword(text)
    }

    const handleLogin = ()=>{
        if(email ==''){
            setEmailErrorMessage('Email is required !')
            return;
        } 
        if(password ==''){
            setPasswordErrorMessage('Password is required !')
            return;
        } 
        if(checkIfValidEmail(email)){

            loading.current.show()
            setTimeout(()=>{
                loading.current.close()
                loginToSystem()
                setEmail("")
                setPassword("")
                setEmailErrorMessage("")
                setPasswordErrorMessage("")
            },2000)

        }else{
            setIsModalVisible(true)
            setEmailChecking('Incorrect email format !')
            
        }
    }

    return (
        <ScrollView contentContainerStyle={{flex:1, backgroundColor:'#92D1C6'}}>
             <View style={{width:'100%',height:'30%',alignItems:'center',justifyContent:'center'}}>
                 <Text style={{fontSize:25,fontWeight:'bold',color:'#fff'}}>Clinicplus</Text>

             </View>
             <ScrollView 
             containerContentStyle={{width:'100%',height:'60%'}}>
                 <TextInput
                 placeholder='Email'
                 value={email}
                 onChangeText={handleEmailChange}
                 style={{width:'70%',borderWidth:1,borderRadius:30,paddingHorizontal:25,backgroundColor:'#eee',alignSelf:'center',margin:15}}
                 />
                 <View style={{width:'60%',alignSelf:'center'}}>
                 <Text style={{color:'red'}}>{email ?"":emailErrorMessage}</Text>
                 </View>
                 
                  <TextInput
                    placeholder='Password'
                    value={password}
                    secureTextEntry={true}
                    onChangeText={handlePasswordChange}
                    style={{width:'70%',borderWidth:1,borderRadius:30,paddingHorizontal:25,backgroundColor:'#eee',alignSelf:'center',margin:15}}
                    />
                 <View style={{width:'60%',alignSelf:'center'}}>
                 <Text style={{color:'red'}}>{password?"":passwordErrorMessage}</Text>
                 </View>
               
                 <TouchableOpacity
                    onPress={handleLogin}
                    style={{width:'50%',height:50,backgroundColor:'#10093E',alignSelf:'center', borderRadius:30,alignItems:'center',justifyContent:'center',marginTop:15}}
                    >
                     <Text style={{fontSize:16,color:'#fff'}}>Login</Text>
                 </TouchableOpacity>

                 <TouchableOpacity
                    style={{width:'70%' , borderRadius:30,justifyContent:'center',alignSelf:'center',margin:5,marginLeft:10}}
                    >
                     <Text style={{fontSize:16,color:'#fff'}}>Forgot Password ?</Text>
                 </TouchableOpacity>

                 <Loading ref={loading}/>

                 <Modal
                    isVisible={isModalVisible}
                 >
                     <View style={{width:'80%',height:'50%',borderRadius:5,padding:20,alignItems:'center',justifyContent:'center', backgroundColor:'#92D1C6',alignSelf:'center'}}>
                        <View style={{height:'70%',justifyContent:'center'}}>
                        <Text style={{fontSize:17,color:'red'}}>{emailChecking}</Text>
                        <Text style={{fontSize:17,color:'red'}}>{loginMsg}</Text>
                        </View>
                         <View style={{height:'30%'}}>
                         <TouchableOpacity
                         onPress={()=>{
                            setIsModalVisible(false)
                            setEmailChecking('')
                            setLoginMsg('')
                         }}
                          style={{height:40, width:100,justifyContent:'center',borderWidth:1,borderColor:'#fff',borderRadius:20,alignItems:'center',justifyContent:'center'}}>
                             <Text style={{fontSize:15}}>close</Text>
                         </TouchableOpacity>
                         </View>

                     </View>

                 </Modal>
                 
             </ScrollView>
        </ScrollView>
    )
}

 

const mapDispatchToProps = dispatch =>({
    setLoggedInUser: user=>dispatch(setCurrentUser(user))
})

export default connect(null, mapDispatchToProps)(Login)
