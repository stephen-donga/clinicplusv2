import React, {useState,useEffect} from 'react'
import { View,ScrollView,TouchableOpacity,ToastAndroid,TextInput,FlatList,Dimensions,Picker,Text } from 'react-native'
import {connect} from 'react-redux'
import AntDesign from 'react-native-vector-icons/AntDesign'
import {urlConnection} from '../url'

const window = Dimensions.get('window')
const screen = Dimensions.get('screen')

const ResultFourType = ({staffList,currentUser,route, navigation}) => {

    const item = route.params;

    const capitalize = (name)=>{
        return name.charAt(0).toUpperCase()+name.slice(1)
    }
    
    const [dimensions, setDimensions] = useState({ window, screen });
    const onChange = ({ window, screen }) => {
        setDimensions({ window, screen });
    }
    
    const [testParams, setTestParams] = useState([])

    const [selectedStaff, setSelectedStaff] = useState(null)
    
    const [results,setResults] = useState([])
    const [resultComment, setResultComment] = useState('')
    const [resultOfFour, setResultOfFour] = useState('')

    const [resultSelected, setResultSelected] = useState({})
    
    const selected = item.test

    const parameterValue =(val)=>{
        let value = testParams.find(item =>item.parameter_name === val.result_name)
        return value.parameter_result
    }

    const showToastWithGravity = () => {
        ToastAndroid.showWithGravity(
          "Result Saved",
          ToastAndroid.BOTTOM,
          ToastAndroid.BOTTOM
        );
      };

      const showEmpty = () => {
        ToastAndroid.showWithGravity(
          "Please enter result !",
          ToastAndroid.BOTTOM,
          ToastAndroid.BOTTOM
        );
      };


      const handleSelectedResult =(item)=>{
          setResultSelected(item)
      }

    const saveResult =()=>{
        if(resultOfFour==''||null){
            showEmpty()
            return
        }

        fetch(urlConnection(`add_parameter/${currentUser.test_id}`),{
            method:'POST',
            headers:{
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body:JSON.stringify({
                cost:item.cost,
                parameter_result: resultOfFour,
                parameter_comment:resultComment,
                parameter_value:resultSelected.id,
                request_id:item.order_id,
                tecnichian:selectedStaff,
                test_id:item.test_id,
                test_name:item.test,
                visit_id: item.visit_id
            })
        })
        .then(res => res.json())
        .then(res =>console.log(res))
        .catch(err => console.log(err))
        .finally(()=>{
            showToastWithGravity()
            navigation.navigate('TestList')
        })
    }
        
    useEffect(() => {
         
        fetch(urlConnection(`testparameter/${item.test_id}`),{
            method:'GET',
            headers:{
                Accept: "application/json",
                "Content-Type": "application/json"
            }
         })
         .then(response => response.json())
         .then(response =>setTestParams(response))
         .catch(err =>console.log(err))
         return () => {
        }
    },[])
    
    useEffect(() => {
        Dimensions.addEventListener("change", onChange)
        return () => {
            Dimensions.removeEventListener("change", onChange)
        }
    }, [])

    useEffect(() => {
        fetch(urlConnection(`result_options/${item.test_id}`),{
            method:'GET',
            headers:{
                Accept: "application/json",
                "Content-Type": "application/json"
            }
        })
        .then(res => res.json())
        .then(res => setResults(res))
        .catch(err =>console.log(err))
        return () => {
        }
    }, [])
    
    return (
         <View style={{flex:1}}>

               <View style={{width:'100%',flexDirection:'row',paddingTop:10,height:40,backgroundColor:'#92D1C6',justifyContent:'space-between'}}>
                
                <TouchableOpacity
                onPress={()=>navigation.goBack()}
                >
                <AntDesign name='arrowleft' size={21} style={{paddingLeft:10,color:'#fff'}} />
                </TouchableOpacity>
                <Text style={{fontSize:17,color:'#fff',fontWeight:'bold'}}>{selected.toUpperCase()}</Text>
                <Text></Text>
            </View>
            <View style={{flex:1,padding:10,backgroundColor:'#fff'}}>
              
                <ScrollView contentContainerStyle={{width:'100%',height:'100%',backgroundColor:'#fff'}}>
               
                <ScrollView 
                 showsVerticalScrollIndicator={false}
                 >
                <Text style={{marginTop:20,}}>Select Technician ( Who exactly made the spacemen examination)</Text>
                <View style={{width:'100%',borderWidth:0.8,borderRadius:3,marginVertical:10}}>
                <Picker
                       selectedValue={selectedStaff}
                       onValueChange={(itemValue, itemIndex) =>setSelectedStaff(itemValue)
                       
                   }>
                       <Picker.Item label='' value={null}/>
                   {
                       staffList.map(member =>(
                       <Picker.Item label={capitalize(member.name.toLowerCase())} value={member.id} key={member.id} />
                       
                       ))
                   }
                   </Picker>
                </View>
                  {
                      selectedStaff ? (
                       <View style={{width:'100%',marginBottom:10}}>
                       <View style={{width:'100%',flexDirection:'row',borderWidth:0.5}}>
                          <View style={{width:'40%',height:40,borderLeftWidth:0.5,alignItems:'center',justifyContent:'center'  }}>
                              <Text style={{fontSize:15,fontWeight:'bold'}}>Test</Text>
                          </View>
                          <View style={{width:'20%',height:40,borderLeftWidth:0.5,alignItems:'center',justifyContent:'center' }}>
                          <Text style={{fontSize:15,fontWeight:'bold'}}>Result</Text>
                          </View>
                          <View style={{width:'40%',height:40,borderLeftWidth:0.5,alignItems:'center',justifyContent:'center'  }}>
                          <Text style={{fontSize:15,fontWeight:'bold'}}>comment</Text>
                          </View>
                       </View>
                        

                   </View>
                      ):null
                  }
                   
                   {
                      selectedStaff ?(

                   <FlatList 
                       data={results}
                       showsVerticalScrollIndicator={false}
                       keyExtractor={(item,idx)=>idx.toString()}
                       renderItem={({item})=>(
                           <View style={{width:'100%',height:70,marginVertical:5}}>
                               <View style={{width:'100%',flexDirection:'row',borderWidth:1}}>
                                  <View style={{width:'40%',height:70,padding:5,alignItems:'center',justifyContent:'center' }}>
                                      <Text>{item.result_name}</Text>
                                  </View>
                                  <View style={{width:'20%',height:70,borderLeftWidth:1,alignItems:'center',justifyContent:'center' }}>
                                      <TextInput 
                                            style={{width:'90%',borderWidth:1,textAlign:'center'}}
                                            keyboardType="numeric"
                                            height={55}
                                            placeholder={parameterValue(item)}
                                            onChangeText={(e)=>{
                                                setResultOfFour(e)
                                                handleSelectedResult(item)
                                            }}

                                       />
                                  </View>
                                  <View style={{width:'40%',height:70,borderLeftWidth:1,alignItems:'center',justifyContent:'center' }}>
                                      <TextInput 
                                            style={{width:'90%',borderWidth:1}}
                                            multiline
                                            maxLength={200}
                                            height={55}
                                            placeholder='comment'
                                            onChangeText={(e)=>{
                                                setResultComment(e)
                                            }}

                                       />
                                  </View>
                               </View>
                                

                           </View>
                       )}
                       />
                      ) :null
                   }
                           
                           <View style={{width:'100%',height:15}}>

                           </View>
                           <View style={{width:'100%',flexDirection:'row',alignItems:'center',marginTop:25}}>
              
                                <TouchableOpacity
                                style={{width:dimensions.window.width-25, height:40,alignSelf:'center',backgroundColor:selectedStaff?'teal':'#eee',borderRadius:20,justifyContent:'center',alignSelf:'center',marginTop:10}}
                                onPress={()=>selectedStaff?saveResult():null}
                                >
                                    <Text style={{alignSelf:'center',color:selectedStaff?'#fff':'black'}}>Save Result</Text>
                                </TouchableOpacity>

                                </View>
                                <TouchableOpacity
                                style={{width:dimensions.window.width/1.2+40, height:50 }}
                                >

                                </TouchableOpacity>
                        

                </ScrollView>
                </ScrollView>
                </View>
            </View>
 
    )
}

const mapStateToProps = ({user,staff}) =>({
    currentUser: user.currentUser,
    staffList: staff.staffList,
})

export default connect(mapStateToProps)(ResultFourType)
