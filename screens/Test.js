import React,{useState,useEffect} from 'react'
import { View, Text,LogBox, FlatList,Picker,TextInput,TouchableOpacity} from 'react-native'
import { ScrollView } from 'react-native-gesture-handler';
import Modal from 'react-native-modal';
import DropDownPicker from 'react-native-dropdown-picker'
import AntDesign from 'react-native-vector-icons/AntDesign'
import {connect} from 'react-redux'
import {setTestList} from '../redux/tests/testAction'

 

const Test = ({ currentUser,route,navigation}) => {
    const patient = route.params;

    const [resultOptions, setResultOptions] = useState([])
    const [result, setResult] = useState(null)
    const[modalVisible, setModalVisible] = useState(false)
    const [selected, setSelected] = useState('')
    const [staff, setStaff] = useState([])
    const [selectedStaff, setSelectedStaff] = useState(null);
    const [showStaffList, setStaffList] = useState(false)
    const [resultFour, setResultFour] = useState(false)

    const [resultFourComment, setResultFourComment] = useState('')
    const [resultOneComment, setResultOneComment] = useState('')
    const [resultOfFour, setResultOfFour] = useState('')


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
        .finally(()=>{
            if(item.result_type==='4'){
                setResultFour(true)
            }else{
                setModalVisible(true)
            }
        })

        let id = currentUser.user_id

        fetch(`https://clinicplusug.com/app/api/staffs/${id}`,{
            method:'GET',
            headers:{
                Accept: "application/json",
                "Content-Type": "application/json"
            }

        })
        .then(res=>res.json())
        .then(res=>setStaff(res))
        .catch(err =>console.log(err))
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
                <Text style={{fontSize:17,fontWeight:'bold', marginLeft:10,marginTop:8,color:'#fff'}}>{capitalize(patient.patient.toLowerCase())}</Text>
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
                  
                            <View style={{width:'100%',padding:10, height:"100%",backgroundColor:'#fff'}}>
                                <View style={{width:'100%'}}>
                                <Text style={{fontSize:14,fontWeight:'bold'}}>Add Result for {selected.toUpperCase()}</Text>
                                </View>
                              <ScrollView contentContainerStyle={{width:'100%', height:'100%'}}>
                              <ScrollView  style={{width:'100%',height:'100%'}}>
                                 <Text style={{marginTop:50}}>Select Result</Text>
                               <DropDownPicker 
                                    items={resultOptions}
                                    defaultValue={result}
                                    containerStyle={{height:40,width:300}}
                                    style={{backgroundColor:'#fff',position:'absolute',}}
                                    itemStyle={{justifyContent: 'flex-start'}}
                                    onChangeItem={item=>{
                                        setStaffList(true)
                                        setResult(item.value)
                                    }}
                                />

                               {
                                   showStaffList?(
                                    <View style={{width:'100%',paddingHorizontal:5}}>
                                 <View style={{width:'100%',borderWidth:0.2,borderRadius:3,marginVertical:15}}> 
                                    <Picker
                                    defaultValue='--select--'
                                     selectedValue={selectedStaff}
                                     onValueChange={(itemValue, itemIndex) =>
                                        setSelectedStaff(itemValue)
                                    }>
                                    {
                                        staff.map(member =>(
                                        <Picker.Item label={capitalize(member.name.toLowerCase())} value={member.id} key={member.id} />
                                        
                                        ))
                                    }
                                    </Picker>
                                    </View>
                                    <Text style={{fontSize:15}}>Any other comment on the result</Text>
                                    <TextInput 
                                        multiline
                                        maxLength={200}
                                        style={{width:295,height:70,marginTop:5,borderWidth:0.5}}
                                        value={resultOneComment}
                                        onChangeText={(e)=>setResultOneComment(e)}
                                        />
                                    </View>
                                   ):null
                               }
                               <View style={{width:300}}>
                               <TouchableOpacity
                                style={{width:300, height:40,backgroundColor:'#fff',borderWidth:0.2,borderRadius:20,justifyContent:'center',alignSelf:'center',marginTop:10}}
                                onPress={()=>{
                                    setResultOptions([])
                                    setModalVisible(!modalVisible)
                                    setStaffList(false)
                                }}
                                >
                                    <Text style={{alignSelf:'center'}}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                style={{width:300, height:40,backgroundColor:showStaffList?'teal':'#eee',borderRadius:20,justifyContent:'center',alignSelf:'center',marginTop:10}}
                                onPress={()=>showStaffList ?alert('active'):alert('in-active')}
                                >
                                    <Text style={{alignSelf:'center',color:showStaffList?'#fff':'black'}}>Save Result</Text>
                                </TouchableOpacity>
                               </View>
                                
                               </ScrollView>
                              </ScrollView>
                                </View>
                               
            </Modal>
             <Modal
             isVisible={resultFour}
             >
                 <View style={{width:'100%',padding:10,backgroundColor:'#fff'}}>
                     <Text style={{fontSize:15,fontWeight:'bold'}}>Add Result for {selected.toUpperCase()}</Text>
                     <ScrollView contentContainerStyle={{width:'100%',height:'100%',backgroundColor:'#fff'}}>
                    <ScrollView 
                    showsVerticalScrollIndicator={false}
                    >
                     <Text style={{marginTop:20}}>Select Technician ( Who exactly made the spacemen examination)</Text>
                     <View style={{width:'100%',borderWidth:0.2,borderRadius:3,marginVertical:5}}>
                     <Picker
                            selectedValue={selectedStaff}
                            onValueChange={(itemValue, itemIndex) =>
                            setSelectedStaff(itemValue)
                        }>
                        {
                            staff.map(member =>(
                            <Picker.Item label={capitalize(member.name.toLowerCase())} value={member.id} key={member.id} />
                            
                            ))
                        }
                        </Picker>
                     </View>
                       {
                           selectedStaff ? (
                            <View style={{width:'100%',marginBottom:10}}>
                            <View style={{width:'100%',flexDirection:'row',borderWidth:0.2}}>
                               <View style={{width:'40%',height:30,borderLeftWidth:0.2,alignItems:'center',justifyContent:'center'  }}>
                                   <Text style={{fontSize:15,fontWeight:'bold'}}>Test</Text>
                               </View>
                               <View style={{width:'20%',height:30,borderLeftWidth:0.5,alignItems:'center',justifyContent:'center' }}>
                               <Text style={{fontSize:15,fontWeight:'bold'}}>Result</Text>
                               </View>
                               <View style={{width:'40%',height:30,borderLeftWidth:0.5,alignItems:'center',justifyContent:'center'  }}>
                               <Text style={{fontSize:15,fontWeight:'bold'}}>comment</Text>
                               </View>
                            </View>
                             

                        </View>
                           ):null
                       }
                        
                        {
                           selectedStaff ?(

                            <FlatList 
                            data={resultOptions}
                            showsVerticalScrollIndicator={false}
                            keyExtractor={(item)=>item.result_type}
                            renderItem={({item})=>(
                                <View style={{width:'100%',height:70,marginVertical:5}}>
                                    <View style={{width:'100%',flexDirection:'row',borderWidth:0.3}}>
                                       <View style={{width:'40%',height:70,borderLeftWidth:0.3,padding:5,alignItems:'center',justifyContent:'center' }}>
                                           <Text>{item.result_name}</Text>
                                       </View>
                                       <View style={{width:'20%',height:70,borderLeftWidth:0.3,alignItems:'center',justifyContent:'center' }}>
                                           <TextInput 
                                           style={{width:'90%',borderWidth:0.2}}
                                           keyboardType='number-pad'
                                           height={55}
                                           value={resultOfFour}
                                           onChangeText={(e)=>setResultOfFour(e)}

                                           />
                                       </View>
                                       <View style={{width:'40%',height:70,borderLeftWidth:0.3,alignItems:'center',justifyContent:'center' }}>
                                           <TextInput 
                                           style={{width:'90%',borderWidth:0.2}}
                                           multiline
                                           maxLength={200}
                                           height={55}
                                           placeholder='comment'
                                           value={resultFourComment}
                                           onChangeText={(e)=>setResultFourComment(e)}

                                           />
                                       </View>
                                    </View>
                                     
   
                                </View>
                            )}
                            />
                           ) :null
                        }
                         
                                <View style={{width:300}}>
                                <TouchableOpacity
                                 style={{width:'100%', height:40,backgroundColor:'#fff',borderWidth:0.5,borderRadius:20,justifyContent:'center',alignSelf:'center',marginTop:10}}
                                 onPress={()=>{
                                     setResultOptions([])
                                     setResultFour(false)
                                     setSelectedStaff(null)
                                 }}
                                 >
                                     <Text style={{alignSelf:'center'}}>Cancel</Text>
                                 </TouchableOpacity>
                                 <TouchableOpacity
                                 style={{width:'100%', height:40,backgroundColor:'teal',borderRadius:20,justifyContent:'center',alignSelf:'center',marginTop:10}}
                                 onPress={()=>null}
                                 >
                                     <Text style={{alignSelf:'center',color:'#fff'}}>Save Result</Text>
                                 </TouchableOpacity>
                                </View>
                             

                     </ScrollView>
                     </ScrollView>

                 </View>

            </Modal>
             
             

        </View>
    )
}

const mapStateToProps =({test,user})=>({
    testList: test.patients,
    currentUser: user.currentUser
})

const mapDispatchToProps = dispatch =>({
    setList: patients =>dispatch(setTestList(patients))
})
export default connect(mapStateToProps, mapDispatchToProps)(Test)
