import React,{useState,useEffect, useRef} from 'react'
import { View,Text,FlatList, } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import {connect} from 'react-redux'
import {setTestList} from '../redux/tests/testAction'
import {setCurrentUser} from '../redux/user/userActions'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Loading from 'react-native-whc-loading'



const TestList = ({currentUser,setUser,pendingTests,testList,navigation}) => {

    const [tests, setTests] = useState([])

    const capitalize = (name)=>{
        return name.charAt(0).toUpperCase()+name.slice(1)
    }

    const id = currentUser.user_id;

    const loading = useRef(null)
 

    useEffect(() => {

            fetch(`https://clinicplusug.com/app/api/pending/${id}`,{
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
    }, [])

    const logOut =()=>{
        loading.current.show()
        setTimeout(()=>{
            setUser({})
            loading.current.close()
            navigation.navigate('Login')

        },1000)
    }
    
    return (
        <View style={{flex:1, backgroundColor:'#fff'}}>
            <View style={{width:'100%',height:50, backgroundColor:'#92D1C6',justifyContent:'center'}}>
                <View style={{flex:1,flexDirection:'row',justifyContent:'space-between',paddingHorizontal:5,paddingVertical:5}}>
                <Text style={{fontSize:15,marginLeft:10,color:'#10093E'}}>{currentUser.name}</Text>
                <TouchableOpacity 
                onPress={logOut}
                style={{width:30,height:30,borderRadius:15,backgroundColor:'#D83972',alignItems:'center',justifyContent:'center'}}
                >
                    <AntDesign name='logout'color='#fff' size={20} />
                </TouchableOpacity>

                </View>

            </View>
            <Loading ref={loading}/>
            <Text style={{margin:10,fontSize:17,fontWeight:'bold',color:'#10093E'}}>Pending Tests</Text>
            {
                tests.length < 1 ? 
                   (
                       <View style={{width:'100%',height:'100%',backgroundColor:'#fff',alignSelf:'center',alignItems:'center',paddingTop:50}}>
                            <Text style={{fontSize:16}}>No tests pending !</Text>
                       </View>
                   )
                 :null
            }
            
             
            <FlatList
                   data={tests}
                   keyExtractor={(item,idx)=>idx.toString()}
                   showsVerticalScrollIndicator={false}
                   renderItem={({item})=>(
                   item.pending_tests.length > 0 ?
                   <TouchableOpacity
                       onPress={()=>navigation.navigate('Test',item)}
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
        </View>
    )
}
const mapStateToProps = ({user,test})=>({
    currentUser: user.currentUser,
    testList : test.patients
})

const mapDispatchToProps = dispatch =>({
    pendingTests: list =>dispatch(setTestList(list)),
    setUser: action =>dispatch(setCurrentUser(action))
})

export default connect(mapStateToProps, mapDispatchToProps)(TestList)
