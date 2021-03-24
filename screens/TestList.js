import React,{useState,useEffect, useRef} from 'react'
import { View,Text,FlatList, ActivityIndicator,ScrollView, } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import {connect} from 'react-redux'
import {setTestList} from '../redux/tests/testAction'
import {setCurrentUser} from '../redux/user/userActions'
import Feather from 'react-native-vector-icons/Feather'
import Loading from 'react-native-whc-loading'
import {urlConnection} from '../url'
import PushNotification from 'react-native-push-notification'
import SoundPlayer from 'react-native-sound-player'



const TestList = ({currentUser,setUser,pendingTests,navigation}) => {
    
    const loading = useRef(null)
    const [tests, setTests] = useState([])
    const [showProfile, setShowProfile] = useState(false)
    const [isLoading, setIsloading] = useState(false)
    const [counter, setCounter] = useState(0)
    
    const capitalize = (name)=>{
        return name.charAt(0).toUpperCase()+name.slice(1)
    }
    
    const id = currentUser.user_id;


    //notifications section
    let notificationsCount=0
    let varyingnotificationCounter=0
    
    const notificationValidator = async() =>{
        if(varyingnotificationCounter > notificationsCount){
            PushNotification.localNotification({
            channelId:'clinic+',
            id:1,
            title: "New test requests",
            message: `Added ${varyingnotificationCounter} test requests`,
            soundName:'tone.mp3'
        })
            try{
            SoundPlayer.playSoundFile('tone','mp3')
                console.log('playing...')
            }catch(err){
                console.log('cannot play sound')
            }
            notificationsCount = varyingnotificationCounter;

        }
        
    }

    const fetchPendingTests = ()=>{
        fetch(urlConnection(`pending/${id}`),{
            method:'GET',
            headers:{
                Accept: "application/json",
                "Content-Type": "application/json"
            }
        })
        .then(res => res.json())
        .then(res =>{
            pendingTests(res)
            setIsloading(false)
            setTimeout(()=>{
                setTests(res)
            },300)
        })
        .catch(err =>{
            console.log(err)
            setIsloading(false)
        } )
    }

    
    useEffect(() => {

        setInterval(() => {
            fetch(urlConnection(`nitify_count/${id}`),{
                method:'GET',
                headers:{
                    Accept: "application/json",
                    "Content-Type": "application/json"
                }
            })
            .then(res => res.json())
            .then(res => {
                varyingnotificationCounter = res;
                notificationValidator()
                setCounter(res)
                console.log(res)

            })
            .catch(err=>console.log(err))

        },15000);
    
        
        return () => {
            onNotificationCheck
        }
    }, [])


    useEffect(() => {
            setIsloading(true)
            fetchPendingTests()
            return ()=>{
                setShowProfile(false)
                loading.current.close()
                clearInterval()
            }
    }, [pendingTests,counter])

    function onNotificationCheck (){
        fetch(urlConnection(`update_count/${id}`),{
            method:'POST',
            headers:{
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body:id
        })
        .then(res => res.json())
        .then(res => console.log(res))
        .catch(err => console.log(err))

        //reseting notification validation values 
        setCounter(0)
        notificationsCount =0
        varyingnotificationCounter=0
        
    }

    const logOut =()=>{
        loading.current.show()
        setTimeout(()=>{
            setUser({})
            navigation.navigate('Login')

        },1000)
    }

    
    return (
        
        <View style={{flex:1, backgroundColor:'#fff'}}>
            
            <View style={{width:'100%',height:40, backgroundColor:'#92D1C6',justifyContent:'center'}}>
                <View style={{flex:1,flexDirection:'row',justifyContent:'space-between',paddingHorizontal:5,paddingVertical:5}}>
               
                <TouchableOpacity 

                onPress= {()=>{
                    counter ? onNotificationCheck():null
                    navigation.navigate('Notifications',id)
                }}

                style={{width:30,height:30,borderRadius:15,alignItems:'center',justifyContent:'center'}}
                >
                 <Feather name='bell' color={counter?'red':'#10093E'} backgroundColor='red' size={24} />
                 
                    <Text style={{position:'absolute',color:'#fff',fontWeight:'bold',top:-5,right:2}}>{counter ?counter:null}</Text>
                    
                </TouchableOpacity>

                <Text style={{fontSize:15,top:5,fontWeight:'bold',color:'#fff'}}>{currentUser.clinicName ?currentUser.clinicName.toUpperCase(): null}</Text>
                <TouchableOpacity 
                onPress={()=>setShowProfile(!showProfile)}
                style={{width:30,height:30,borderRadius:15,alignItems:'center',justifyContent:'center'}}
                >
                    <Feather name='more-vertical'color='#fff' size={25} />
                </TouchableOpacity>

                </View>

            </View>
            <Loading ref={loading}/>
            {
                tests.length < 1 && !isLoading? 
                   (
                       <Text style={{alignSelf:'center',marginTop:50,color:'grey'}}>No tests pending.</Text>
                   )
                 :null
            }
            {
                isLoading&&(
                       <View style={{width:'100%',height:'100%',backgroundColor:'#fff',alignSelf:'center',alignItems:'center',paddingTop:50}}>
                             <ActivityIndicator size="large" color="grey" />
                       </View>

                )
            }
            
             
            <FlatList
                   data={tests}
                   style={{position:'relative'}}
                   keyExtractor={(item,idx)=>idx.toString()}
                   showsVerticalScrollIndicator={false}
                   renderItem={({item})=>(
                   item.pending_tests.length > 0 ?
                        <TouchableOpacity
                            onPress={()=>{
                                navigation.navigate('Test',item)
                                setShowProfile(false)
                            }}
                        >
                            <View style={{width:'95%',height:50,elevation:3,backgroundColor:'#fff', borderRadius:0,marginVertical:5,padding:5, flexDirection:'row', alignSelf:'center'}}>
                                <View style={{width:'70%',justifyContent:'center',paddingLeft:10}}>
                                    <Text style={{fontSize:15}}>{capitalize(item.patient.toLowerCase())}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                   
                   
                   :null
               )}

            />
         
            {
                showProfile&&(
                    <View style={{position:'absolute',width:'60%',padding:10,top:60,right:15,elevation:3,backgroundColor:'#eee'}}>
                            <Text style={{fontSize:15,color:'#10093E',fontWeight:'bold',alignSelf:'center'}}>{currentUser.name}</Text>
                            <View style={{width:'100%',borderBottomWidth:1,marginVertical:5}} />
                        <ScrollView
                        contentContainerStyle={{width:'100%', height:'100%'}}
                        >
                            <ScrollView
                            showsVerticalScrollIndicator={false} 
                            >
                           
                            <TouchableOpacity
                            onPress={()=>{
                                setShowProfile(false)
                                navigation.navigate('UserProfile')
                            }} 
                            style={{marginVertical:5,borderWidth:0.8,borderColor:'#fff',paddingHorizontal:5,bottom:5}}
                            >
                                <Text style={{fontSize:15,color:'#10093E',marginVertical:5}}>View Profile</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                            onPress={logOut} 
                            style={{flexDirection:'row',marginVertical:5,borderWidth:0.8,borderColor:'#fff',paddingHorizontal:5,bottom:5}}
                            >
                                <Feather name='log-out' size={20} style={{marginVertical:5}}/>
                                <Text style={{fontSize:15,color:'#10093E',marginLeft:5,marginVertical:5}}>Logout</Text>
                            </TouchableOpacity>

                            </ScrollView>
                        </ScrollView>

                    </View>
                )
            }
        </View>
    )
}
const mapStateToProps = ({user,test})=>({
    currentUser: user.currentUser,
})

const mapDispatchToProps = dispatch => ({
    pendingTests: list =>dispatch(setTestList(list)),
    setUser: action =>dispatch(setCurrentUser(action))
})

export default connect(mapStateToProps, mapDispatchToProps)(TestList)
