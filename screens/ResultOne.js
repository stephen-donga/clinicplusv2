import React,{useState, useEffect} from 'react'
import { View,ScrollView,Picker,Dimensions,ToastAndroid,TouchableOpacity,TextInput, Text } from 'react-native'
import {connect} from 'react-redux'


const window = Dimensions.get('window')
const screen = Dimensions.get('screen')

const ResultOne = ({currentUser,staff,route, navigation}) => {

    const item = route.params;

    console.log(item)

    const [dimensions, setDimensions] = useState({ window, screen });
    const onChange = ({ window, screen }) => {
        setDimensions({ window, screen });
      }

      const capitalize = (name)=>{
        return name.charAt(0).toUpperCase()+name.slice(1)
    }

    const showToastWithGravity = () => {
        ToastAndroid.showWithGravity(
          "Result Saved",
          ToastAndroid.BOTTOM,
          ToastAndroid.BOTTOM
        );
      };

    const [resultOptions, setResultOptions] = useState([])
    const [result, setResult] = useState(null)
    const [resultComment, setResultComment] = useState('')

    const selected = item.test


     //staff /technician
     const [selectedStaff, setSelectedStaff] = useState(null);

     const saveResult =() =>{
        fetch(`https://clinicplusug.com/app/api/add_defined/${currentUser.test_id}`,{
            method:'POST',
            headers:{
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body:JSON.stringify({
                cost:item.cost,
                description:resultComment,
                request_id:item.order_id,
                result_value:result,
                tecnichian:selectedStaff,
                test_id:item.test_id,
                test_name:item.test,
                visit_id: item.visit_id
            })
        })
        .then(res => res.json())
        .then(res =>console.warn(res))
        .catch(err => console.log(err))
        .finally(()=>{
            showToastWithGravity()
            navigation.navigate('TestList')
        })
     }

     useEffect(() => {
        let test_id = item.test_id
        fetch(`https://clinicplusug.com/app/api/result_options/${test_id}`,{
            method:'GET',
            headers:{
                Accept: "application/json",
                "Content-Type": "application/json"
            }
        })
        .then(res=>res.json())
        .then(res =>setResultOptions(res))
        .catch(err => console.log(err))
          
         return () => {
          }
     }, [])

    return (
        <View style={{flex:1}}>
             <View style={{width:'100%',padding:10, height:"100%",backgroundColor:'#fff'}}>
                <View style={{width:'100%'}}>
                <Text style={{fontSize:14,fontWeight:'bold'}}>Add Result for {selected.toUpperCase()}</Text>
                </View>
                <ScrollView contentContainerStyle={{width:'100%', height:'100%'}}>
                <ScrollView  style={{width:'100%',height:'100%'}}>
                    <Text style={{marginTop:50}}>Select Result</Text>
                
                    <View style={{width:'100%',borderWidth:1,borderColor:'#ccc',borderRadius:3,marginVertical:15}}> 
                    <Picker
                        selectedValue={result}
                        onValueChange={(itemValue, itemIndex) =>{
                        setResult(itemValue)
                    }
                    }>
                        <Picker.Item label=' ' value=''/>
                    {
                        resultOptions.map(member =>(
                        <Picker.Item label={capitalize(member.result_name.toLowerCase())} value={member.id} key={member.id} />
                        
                        ))
                    }
                    </Picker>
                    </View>

                {
                    result !=null?(
                    <View style={{width:'100%'}}>
                <Text style={{marginTop:20,fontWeight:'bold'}}>Select Technician ( Who exactly made the spacemen examination)</Text>
                    <View style={{width:'100%',borderWidth:1,borderColor:'#ccc',borderRadius:3,marginVertical:15}}> 

                    <Picker
                        selectedValue={selectedStaff}
                        onValueChange={(itemValue, itemIndex) =>
                        setSelectedStaff(itemValue)
                    }>
                        <Picker.Item label=' ' value=''/>
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
                        style={{width:dimensions.window.width-80,height:70,marginTop:5,borderWidth:0.5}}
                        onChangeText={(e)=>setResultComment(e)}
                        />
                    </View>
                    ):null
                }
                <TouchableOpacity
                style={{width:dimensions.window.width/1.2+40, height:40,backgroundColor:'#fff',borderWidth:1,borderRadius:20,justifyContent:'center',alignSelf:'center',marginTop:10}}
                onPress={()=>{
                    navigation.navigate('Test')                    
                }}
                >
                    <Text style={{alignSelf:'center'}}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                style={{width:dimensions.window.width/1.2+40, height:40,backgroundColor:result !=null?'teal':'#eee',borderRadius:20,justifyContent:'center',alignSelf:'center',marginTop:10}}
                onPress={()=>result !=null?saveResult():null}
                >
                    <Text style={{alignSelf:'center',color:result !=null?'#fff':'black'}}>Save Result</Text>
                </TouchableOpacity>
                
                </ScrollView>
                </ScrollView>
                </View>
                               
        </View>
    )
}

const mapStateToProps =({staff,user}) =>({
    staff: staff.staffList,
    currentUser: user.currentUser
})
export default connect(mapStateToProps)(ResultOne)
