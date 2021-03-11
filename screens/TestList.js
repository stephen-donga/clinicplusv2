import React,{useState,useEffect, useRef} from 'react'
import { View,Text,FlatList, ActivityIndicator,ScrollView, } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import {connect} from 'react-redux'
import {setTestList} from '../redux/tests/testAction'
import {setCurrentUser} from '../redux/user/userActions'
import Feather from 'react-native-vector-icons/Feather'
import Loading from 'react-native-whc-loading'
import {urlConnection} from '../url'



const TestList = ({currentUser,setUser,pendingTests,navigation}) => {

    const [tests, setTests] = useState([])
    const [showProfile, setShowProfile] = useState(false)

    const capitalize = (name)=>{
        return name.charAt(0).toUpperCase()+name.slice(1)
    }

    const id = currentUser.user_id;

    const loading = useRef(null)


    useEffect(() => {
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
                setTimeout(()=>{
                    setTests(res)
                },300)
            })
            .catch(err => console.log(err))
            return ()=>{
                setShowProfile(false)
            }
    }, [])

    useEffect(() => {
        return () => {
            loading.current.close()

        }
    }, [])
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
                style={{width:30,height:30,borderRadius:15,alignItems:'center',justifyContent:'center'}}
                >
                </TouchableOpacity>

                <Text style={{fontSize:18,fontWeight:'bold',color:'#fff'}}>{currentUser.clinicName ?currentUser.clinicName.toUpperCase(): null}</Text>
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
                tests.length < 1 ? 
                   (
                       <View style={{width:'100%',height:'100%',backgroundColor:'#fff',alignSelf:'center',alignItems:'center',paddingTop:50}}>
                             <ActivityIndicator size="large" color="grey" />
                       </View>
                   )
                 :null
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
                            <Text style={{fontSize:15,fontWeight:'bold',alignSelf:'center'}}>{currentUser.name}</Text>
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
                                <Text style={{fontSize:15,marginVertical:5}}>View Profile</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                            onPress={logOut} 
                            style={{flexDirection:'row',marginVertical:5,borderWidth:0.8,borderColor:'#fff',paddingHorizontal:5,bottom:5}}
                            >
                                <Feather name='log-out' size={20} style={{marginVertical:5}}/>
                                <Text style={{fontSize:15,marginLeft:5,marginVertical:5}}>Logout</Text>
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

const mapDispatchToProps = dispatch =>({
    pendingTests: list =>dispatch(setTestList(list)),
    setUser: action =>dispatch(setCurrentUser(action))
})

export default connect(mapStateToProps, mapDispatchToProps)(TestList)
