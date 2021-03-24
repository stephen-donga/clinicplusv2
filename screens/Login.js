import React,{useState, useEffect } from 'react'
import { View,SafeAreaView, ScrollView,Image,ActivityIndicator, Dimensions, Text,StyleSheet, TouchableOpacity,TextInput } from 'react-native'
import Modal from 'react-native-modal';
import Ionicons from 'react-native-vector-icons/Ionicons'
import {
    CodeField,
    Cursor,
    useBlurOnFulfill,
    useClearByFocusCell,
  } from 'react-native-confirmation-code-field';
  import AntDesign from 'react-native-vector-icons/MaterialIcons'
  


import {connect} from 'react-redux'
import {setCurrentUser} from '../redux/user/userActions'
import {urlConnection} from '../url'


const checkIfValidEmail = require('../utils')

const window = Dimensions.get('window')
const screen = Dimensions.get('screen')

const CELL_COUNT = 6;

const Login = ({setLoggedInUser,navigation}) => {


    const [dimensions, setDimensions] = useState({ window, screen });
    const onChange = ({ window, screen }) => {
        setDimensions({ window, screen });
    }

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [emailChecking,setEmailChecking] = useState('')
    const [loginMsg,setLoginMsg] = useState('')
    const [loading, setLoading] = useState(false)
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [emailErrorMessage, setEmailErrorMessage] = useState("")
    const [passwordErrorMessage, setPasswordErrorMessage] = useState("")
    const [openResetModal, setOpenResetModal] = useState(false);
    const [resetSuccess, setResetSuccess] = useState(false)
    const [resetCodeModal, setResetCodeModal] = useState(false)
    const [emailReset, setEmailReset] = useState(true)
    const [confirmLoading, setConfirmLoading] =useState(false)
    const [resetError, setResetError] = useState('')

    const [resetResults, setResetResults] = useState({}) 
    const [loadingReset, setLoadingReset] = useState(false)
    const [resultErrorMessage, setResultErrorMessage] = useState({})

    //reset code 

    const [value, setValue] = useState('');
    const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
      value,
      setValue,
    });

    const [emailForesetPassword, setEmailForResetPassword] = useState('')
    const [border, setBorder] = useState('#32c5d2')


    const loginToSystem = ()=>{

        fetch(urlConnection('login') ,{
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
                setLoading(false)
                setLoginMsg('Wrong email or password !')
            }else if(res.user_id){
                setEmail("")
                setPassword("")
                setEmailErrorMessage("")
                setPasswordErrorMessage("")
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
            setLoading(true)
                loginToSystem()
           

        }else{
            setIsModalVisible(true)
            setEmailChecking('Incorrect email format !')
            
        }
    }

    const resetHandler = ()=>{
        if(checkIfValidEmail(emailForesetPassword)){
            setBorder('#32c5d2')
        }else{
            setBorder('red')
            setEmailForResetPassword('')
            return;
        }
        setLoadingReset(true)
       
        fetch(urlConnection(`send_user_mail/${emailForesetPassword}`),{
            method:'GET',
            headers:{
                'Content-type': 'application/json'
            }
        })
        .then((response)=>response.json())
        .then(response => {
                if(response.code){
                    setResetResults(response)
                    setLoadingReset(false)
                    setEmailReset(false)
                    setResetSuccess(false)
                    setResetCodeModal(true)
                    setResultErrorMessage({})
                }else{
                    setResultErrorMessage(response)
                    setLoadingReset(false)
                }
                
        })
        .catch(e=>console.log(e))

    }

    const cancelPasswordReset = ()=>{
        setOpenResetModal(false)
        setResetCodeModal(false)
        setResetError('')
        setEmailReset(true)
    }

    const handleConfirmCode = ()=>{
         
        if(parseInt(value)!==parseInt(resetResults.code)){
            
            setResetError('Invalid code !')
            setValue('')
            return
        }
        setResetError('')
        setConfirmLoading(true)

        setTimeout(()=>{
            setConfirmLoading(false)
            setResetCodeModal(false)
            setResetSuccess(true)
        },3000)

    }

    useEffect(() => {
        return () => {
            setIsModalVisible(false)
             
        }
    }, [])

    useEffect(() => {
        Dimensions.addEventListener("change", onChange)
        return () => {
            Dimensions.removeEventListener("change", onChange)
            handleLogin()
            setLoading(false)
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
                    {
                        loading ?(
                            <ActivityIndicator size='large' color="grey" style={{position:'absolute',alignSelf:'center'}}/>

                        )
                        :
                        (
                            <Text style={{fontSize:16,color:'#fff'}}>Login</Text>
                        )
                    }
                 </TouchableOpacity>


                 <TouchableOpacity
                 onPress={()=>setOpenResetModal(true)}
                    style={{width:'80%', alignSelf:'center', borderRadius:30,alignItems:'center',justifyContent:'center',alignSelf:'center',margin:5,marginTop:15,marginBottom:15}}
                    >
                     <Text style={{fontSize:15,color:'#fff',paddingLeft:10}}>Forgot Password ?</Text>
                 </TouchableOpacity>

                 <Modal 
                 isVisible={openResetModal}
                 >

                     {
                         resetCodeModal ?( 
                             <ScrollView 
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{width:'100%',height:dimensions.window.height/1.5,alignItems:'center', backgroundColor:'#fff',justifyContent:'center',alignItems:'center',borderRadius:5}}
                            >
                            <View
                            style={{position:'absolute',width:50,height:50,backgroundColor:'#fff',flexDirection:'row',justifyContent:'flex-end',top:10,right:10}} 
                            >
                                <TouchableOpacity
                                onPress={cancelPasswordReset}
                                >
                                    <AntDesign name='cancel' color='#10093E' size={35}/>
                                </TouchableOpacity>

                            </View>
                     
                            <SafeAreaView style={styles.root}>
                                <Text style={styles.title}>Verify code</Text>
                                <Text style={{fontSize:15}}>Please enter the code sent to you via SMS</Text>
                                <CodeField
                                    ref={ref}
                                    {...props}
                                    value={value}
                                    onChangeText={setValue}
                                    cellCount={CELL_COUNT}
                                    rootStyle={styles.codeFieldRoot}
                                    keyboardType="number-pad"
                                    textContentType="oneTimeCode"
                                    renderCell={({index, symbol, isFocused}) => (
                                    <Text
                                        key={index}
                                        style={[styles.cell, isFocused && styles.focusCell]}
                                        onLayout={getCellOnLayoutHandler(index)}>
                                        {symbol || (isFocused ? <Cursor /> : null)}
                                    </Text>
                                    )}
                                />

                   <TouchableOpacity
                            onPress={handleConfirmCode}
                            style={{width:dimensions.window.width-150,height:50,backgroundColor:'#10093E',alignSelf:'center', borderRadius:30,margin:20,alignItems:'center',justifyContent:'center'}}
                    >
                    {
                        confirmLoading ?(
                            <ActivityIndicator size='large' color="grey" style={{position:'absolute',alignSelf:'center'}}/>

                        )
                        :
                        (
                            <Text style={{fontSize:16,color:'#fff',marginHorizontal:25}}>Confirm </Text>
                        )
                    }
                 </TouchableOpacity>
                 <Text style={{color:'red',fontSize:15}}>{resetError}</Text>
                                </SafeAreaView>

                         </ScrollView>):null
                     }
                    {
                        resetSuccess ?(
                        <ScrollView 
                           contentContainerStyle={{width:'100%',height:dimensions.window.height/1.2,padding:15,alignItems:'center',alignItems:'center',justifyContent:'space-evenly', backgroundColor:'#fff',borderRadius:5}}
                            >
                             <View style={{width:'100%',backgroundColor:'#fff'}}>

                            <Text style={{fontSize:21,fontWeight:'bold',color:'#32c5d2',alignSelf:'center'}}>Success !</Text>
                              </View>
                            <View style={{left:-15}} >
                                <View style={{...StyleSheet.absoluteFillObject, width:100, height:100, borderRadius:50, backgroundColor:'#9FE8EE',alignSelf:'center'}}/>
                                <View style={{width:70,height:70, borderRadius:35,backgroundColor:'#32c5d2',top:15,left:15,justifyContent:'center',alignItems:'center'}}>
                                    <Ionicons name='checkmark-done' color='#fff' size={60}  />
                                </View>
                               

                            </View>
                            <TouchableOpacity
                                  onPress={()=>{
                                    setOpenResetModal(false)
                                    setValue('')
                                    setResetSuccess(false)
                                    setEmailReset(true)
                                    navigation.navigate('ChangePassword',resetResults)
                                }}
                                  style={{width:dimensions.window.width-150,height:50,marginVertical:10,backgroundColor:'#10093E',alignSelf:'center', borderRadius:30,margin:20,alignItems:'center',justifyContent:'center'}}
                              >
                                  <Text style={{color:'#fff',fontSize:15}}>Reset password</Text>
                        </TouchableOpacity>
                        </ScrollView>): null
           
        
                    }

{
                            emailReset ?                 (
                                <View 
                                style={{width:'100%',height:'100%',padding:15, backgroundColor:'#fff',borderRadius:5}}
                                >

                                <View
                                    style={{position:'absolute',width:50,height:50,backgroundColor:'#fff',flexDirection:'row',justifyContent:'flex-end',top:10,right:10}} 
                                    >
                                <TouchableOpacity
                                onPress={()=>{
                                           setOpenResetModal(false)
                                           setBorder('#32c5d2')
                                           setEmailForResetPassword('')
                                }}
                                >
                                    <AntDesign name='cancel' color='#10093E' size={35}/>
                                </TouchableOpacity>

                            </View>

                                   <View
                                   style={{width:'100%',height:'35%',alignItems:'center',justifyContent:'center'}}
                                   >
                                       <Text style={{fontSize:17,fontWeight:'bold'}}>Forgot Password ?</Text>
           
                                   </View>
           
                                   <View
                                   style={{width:'100%',height:'65%'}} 
                                   >
                                   <Text>Enter your e-mail address below to reset your password.</Text>
           
                                   <TextInput 
                                   placeholder='Your email here '
                                   onChangeText={(e)=>setEmailForResetPassword(e)}
                                   style={{width:'100%',borderBottomWidth:1,paddingHorizontal:15,borderBottomColor:border,marginVertical:5,backgroundColor:'#dde3ec'}}
           
                                   />
           
                                   <View 
                                        style={{width:'100%',justifyContent:'center',marginTop:20}}
                                        >
           
                                    <TouchableOpacity 
                                       onPress={resetHandler}
                                       style={{width:dimensions.window.width-80,height:50,borderRadius:15,padding:10,justifyContent:'center',alignSelf:'center',alignItems:'center',backgroundColor:'#27a4b0'}}
                                       >
                                           {
                                               loadingReset ?(
                                                <ActivityIndicator size='large' color="#fff" style={{position:'absolute',alignSelf:'center'}}/>
                                               ):(
                                                   <Text style={{color:'#fff',fontSize:16}}>Submit</Text>

                                               )
                                           }
                                    </TouchableOpacity>
                                    <Text style={{fontSize:15,color:'red',alignSelf:'center',marginVertical:15}}>{resultErrorMessage.message ?resultErrorMessage.message:''}</Text>
           
                                   </View>
           
           
                                   </View>
           
                                </View>
           
                           ):null
                        }

                 </Modal>

                
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


const styles = StyleSheet.create({
    root: {flex: 1, padding: 20,justifyContent:'center',alignItems:'center'},
    title: {textAlign: 'center', fontSize: 30},
    codeFieldRoot: {marginTop: 20},
    cell: {
      width: 40,
      height: 40,
      lineHeight: 38,
      fontSize: 24,
      borderWidth: 1,
      margin:0.2,
      borderColor: '#00000030',
      textAlign: 'center',
    },
    focusCell: {
      borderColor: '#000',
    },
  });

 

const mapDispatchToProps = dispatch =>({
    setLoggedInUser: user=>dispatch(setCurrentUser(user))
})

export default connect(null, mapDispatchToProps)(Login)
