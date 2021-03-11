import React,{useEffect} from 'react'
import { View, Text,LogBox, FlatList,TouchableOpacity} from 'react-native'
import { ScrollView } from 'react-native-gesture-handler';
import AntDesign from 'react-native-vector-icons/AntDesign'
import {connect} from 'react-redux'
import {setTestList} from '../redux/tests/testAction'
import {setStaffList} from '../redux/staff/staffActions'
import {urlConnection} from '../url'

 
const Test = ({setStaffLst, currentUser, route, navigation}) => {

    const patient = route.params;

    const capitalize = (name)=>{
        return name.charAt(0).toUpperCase()+name.slice(1)
    }

    const handleTestRequest = (item)=>{
       
            if(item.result_type ==='4'){
                navigation.navigate('ResultFour',item)
            }else{
                navigation.navigate('ResultOne',item)
            }
         
        let id = currentUser.user_id

        fetch(urlConnection(`staffs/${id}`),{
            method:'GET',
            headers:{
                Accept: "application/json",
                "Content-Type": "application/json"
            }

        })
        .then(res=>res.json())
        .then(res=>setStaffLst(res))
        .catch(err =>console.log(err))
    }


    const checkIfResultType = (item)=>{
        if(item.result_type ==='1'){
            return 'pluscircleo'
        }else if(item.result_type ==='2'){
            return 'pluscircle'
        }else if(item.result_type ==='3'){
            return 'plus'
        }else if(item.result_type ==='4'){
            return 'plussquare'
        }
    }


    useEffect(() => {
            LogBox.ignoreLogs(['VirtualizedLists should never be nested inside plain ScrollViews with the same orientation'])
        return () => {
        }
    }, [])

    return (
        <View style={{flex:1, backgroundColor:'#fff'}}>
             <View style={{width:'100%',height:40,flexDirection:'row',justifyContent:'space-between', backgroundColor:'#92D1C6'}}>
                 <TouchableOpacity
                 onPress={()=>navigation.navigate('TestList')}
                  >
                     <AntDesign name='arrowleft' size={21} style={{marginTop:8,paddingLeft:10,color:'#fff'}} />
                 </TouchableOpacity>
                <Text style={{fontWeight:'bold',fontSize:17, marginLeft:-20,marginTop:8,color:'#fff'}}>{capitalize(patient.patient.toLowerCase())}</Text>
                <Text style={{fontWeight:'bold', marginLeft:10,marginTop:8,color:'#fff'}}></Text>
            </View>

            <ScrollView 
            showsVerticalScrollIndicator={false}
            style={{marginTop:10, width:'100%',alignSelf:'center'}}>
                <FlatList 
                    data={patient.pending_tests}
                    keyExtractor={(item,idx)=>idx.toString()}
                    showsVerticalScrollIndicator={false}
                    renderItem={({item})=>(
                        <TouchableOpacity 
                        onPress={()=> handleTestRequest(item)}
                        >
                        <View style={{width:'95%',flexDirection:'row',justifyContent:'space-between',height:50,padding:15,elevation:3,alignSelf:'center' ,backgroundColor:'#fff',margin:5}}>
                              <Text style={{fontSize:13}}>{capitalize(item.test.toLowerCase())}</Text>
                                <TouchableOpacity
                                onPress={()=>{
                                    handleTestRequest(item)
                                }} 
                                >
                              <AntDesign name={checkIfResultType(item)}  color='#10093E' size={24} />
                              </TouchableOpacity>
                        </View>
                        </TouchableOpacity>
                    )}
            

            />
            </ScrollView>
          
              

        </View>
    )
}

const mapStateToProps =({test,user})=>({
    testList: test.patients,
    currentUser: user.currentUser
})

const mapDispatchToProps = dispatch =>({
    setList: patients =>dispatch(setTestList(patients)),
    setStaffLst: list => dispatch(setStaffList(list)),
})
export default connect(mapStateToProps, mapDispatchToProps)(Test)
