import React,{useState,useEffect} from 'react'
import { View, Text,LogBox, FlatList, TextInput, TouchableOpacity } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler';
import Modal from 'react-native-modal';
import DropDownPicker from 'react-native-dropdown-picker'
import AntDesign from 'react-native-vector-icons/AntDesign'
import {connect} from 'react-redux'
import {setTestList} from '../redux/tests/testAction'


 

const Test = ({testList,route, setList,navigation}) => {
    const patient = route.params;

    const [resultOptions, setResultOptions] = useState([])
    const [result, setResult] = useState(null)
    const[modalVisible, setModalVisible] = useState(false)
    const [selected, setSelected] = useState('')

    const capitalize = (name)=>{
        return name.charAt(0).toUpperCase()+name.slice(1)
    }


  

    const handleTestRequest = (item)=>{
        let test_id = item.test_id
        fetch(`https://clinicplusug.com/app/api/result_options/${test_id}`,{
            method:'GET',
            headers:{
                Accept: "application/json",
                "Content-Type": "application/json"
            }
        })
        .then(res=>res.json())
        .then(res=>setResultOptions(res))
        .catch(err=>console.log(err))
        .finally(()=>setModalVisible(true))
    }

    const checkIfResultType = (item)=>{
        if(item.result_type =='1'){
            return 'pluscircleo'
        }else if(item.result_type=='2'){
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
             <View style={{width:'100%',height:40,flexDirection:'row', backgroundColor:'#92D1C6'}}>
                 <TouchableOpacity
                 onPress={()=>navigation.navigate('TestList')}
                  >
                     <AntDesign name='arrowleft' size={21} style={{marginTop:8,paddingLeft:10,color:'grey'}} />
                 </TouchableOpacity>
                <Text style={{fontSize:17,fontWeight:'bold', marginLeft:10,marginTop:8,color:'#fff'}}>{patient.patient}</Text>
            </View>

            <ScrollView 
            showsVerticalScrollIndicator={false}
            style={{marginTop:10, width:'100%',alignSelf:'center'}}>
                <FlatList 
                    data={patient.pending_tests}
                    keyExtractor={(item,idx)=>idx.toString()}
                    showsVerticalScrollIndicator={false}
                    renderItem={({item})=>(
                        <View style={{width:'95%',flexDirection:'row',justifyContent:'space-between',height:50,padding:15,elevation:3,alignSelf:'center' ,backgroundColor:'#fff',margin:5}}>
                              <Text style={{fontSize:12}}>{capitalize(item.test)}</Text>
                                <TouchableOpacity
                                onPress={()=>{
                                    setSelected(item.test)
                                    handleTestRequest(item)
                                    // setModalVisible(!modalVisible)
                                }} 
                                >
                              <AntDesign name={checkIfResultType(item)}  color='#10093E' size={24} />
                              </TouchableOpacity>
                            </View>
                    )}
            

            />
            </ScrollView>
            <Modal 
              isVisible={modalVisible}>
                  
                            <View style={{width:'100%',padding:10, height:"90%",backgroundColor:'#eee'}}>
                                <Text>Add Result for {selected}</Text>
                               <View style={{alignSelf:'center',marginTop:50}}>
                                <Text>Select Result</Text>
                               <DropDownPicker 
                                    items={resultOptions}
                                    defaultValue={result}
                                    containerStyle={{height:40,width:250}}
                                    style={{backgroundColor:'#fff'}}
                                    itemStyle={{justifyContent: 'flex-start'}}
                                    onChangeItem={item=>setResult(item.value)}
                                />
                               </View>
                                <TouchableOpacity
                                style={{width:100, height:40,backgroundColor:'teal',alignSelf:'center',marginTop:60}}
                                onPress={()=>{
                                    setResultOptions([])
                                    setModalVisible(!modalVisible)
                                }}
                                >
                                    <Text style={{alignSelf:'center'}}>Cancel</Text>
                                </TouchableOpacity>
                            </View>

            </Modal>
            <Modal
            isVisible={false}
            >

            </Modal>

        </View>
    )
}

const mapStateToProps =({test})=>({
    testList: test.patients
})

const mapDispatchToProps = dispatch =>({
    setList: patients =>dispatch(setTestList(patients))
})
export default connect(mapStateToProps, mapDispatchToProps)(Test)
