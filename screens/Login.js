import React,{useState, useEffect, useRef} from 'react'
import { View,ScrollView,Image, Text, TouchableOpacity,TextInput } from 'react-native'
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
                loading.current.close()
                setLoginMsg('Wrong email or password !')
            }else if(res.user_id){
                setEmail("")
                setPassword("")
                setLoggedInUser(res)
                setEmailErrorMessage("")
                setPasswordErrorMessage("")
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
                loginToSystem()
           

        }else{
            setIsModalVisible(true)
            setEmailChecking('Incorrect email format !')
            
        }
    }

    useEffect(() => {
        return () => {
            loading.current.close()
        }
    }, [])

    useEffect(() => {
        return () => {
            setIsModalVisible(false)
             
        }
    }, [])
    
    useEffect(() => {
        return () => {
            loginToSystem()
        }
    }, [])
    return (
        <ScrollView contentContainerStyle={{flex:1, backgroundColor:'#92D1C6'}}>
             <View style={{width:'100%',height:'30%',alignItems:'center',justifyContent:'center'}}>
                 <Image style={{width:80,height:80,borderRadius:40}} source={require('../assets/logo.png')} />

             </View>
             <ScrollView 
             showsVerticalScrollIndicator={false}
             containerContentStyle={{width:'100%',height:'60%'}}>
                 <View style={{height:80}} />
                 <TextInput
                 placeholder='Email'
                 value={email}
                 onChangeText={handleEmailChange}
                 style={{width:'80%',borderWidth:0,borderRadius:30,paddingHorizontal:25,backgroundColor:'#eee',alignSelf:'center',margin:10}}
                 />
                 <View style={{width:'60%',alignSelf:'center'}}>
                 <Text style={{color:'red'}}>{email ?"":emailErrorMessage}</Text>
                 </View>
                 
                  <TextInput
                    placeholder='Password'
                    value={password}
                    secureTextEntry={true}
                    onChangeText={handlePasswordChange}
                    style={{width:'80%',borderWidth:0,borderRadius:30,paddingHorizontal:25,backgroundColor:'#eee',alignSelf:'center',margin:10}}
                    />
                 <View style={{width:'60%',alignSelf:'center'}}>
                 <Text style={{color:'red'}}>{password?"":passwordErrorMessage}</Text>
                 </View>
               
                 <TouchableOpacity
                    onPress={handleLogin}
                    style={{width:'60%',height:50,backgroundColor:'#10093E',alignSelf:'center', borderRadius:30,margin:10,alignItems:'center',justifyContent:'center'}}
                    >
                     <Text style={{fontSize:16,color:'#fff'}}>Login</Text>
                 </TouchableOpacity>

                 <TouchableOpacity
                    style={{width:'80%', alignSelf:'center', borderRadius:30,alignItems:'center',justifyContent:'center',alignSelf:'center',margin:5,marginTop:15,marginBottom:15}}
                    >
                     <Text style={{fontSize:15,color:'#fff',paddingLeft:10}}>Forgot Password ?</Text>
                 </TouchableOpacity>

                 <Loading ref={loading}/>

                 <Modal
                    isVisible={isModalVisible}
                 >
                     <View style={{width:'80%',height:'50%',borderRadius:5,padding:20,alignItems:'center',justifyContent:'center', backgroundColor:'#92D1C6',alignSelf:'center'}}>
                        <View style={{height:'70%',justifyContent:'center'}}>
                        <Text style={{fontSize:15,color:'red'}}>{emailChecking}</Text>
                        <Text style={{fontSize:15,color:'red'}}>{loginMsg}</Text>
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
