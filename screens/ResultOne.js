import React,{useState, useEffect} from 'react'
import { View,ScrollView,Picker,Dimensions,ToastAndroid,TouchableOpacity,TextInput, Text } from 'react-native'
import {connect} from 'react-redux'
import AntDesign from 'react-native-vector-icons/AntDesign'
import {urlConnection} from '../url'


const window = Dimensions.get('window')
const screen = Dimensions.get('screen')

const ResultOne = ({currentUser,staff,route, navigation}) => {

    const item = route.params;


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

      const showEmptyMsg = () => {
        ToastAndroid.showWithGravity(
          "Please ! select result and Technician",
          ToastAndroid.BOTTOM,
          ToastAndroid.BOTTOM
        );
      };

      const showSaveError = () => {
        ToastAndroid.showWithGravity(
          "Error saving result. please try again.",
          ToastAndroid.BOTTOM,
          ToastAndroid.BOTTOM
        );
      };

    const [resultOptions, setResultOptions] = useState([])
    const [result, setResult] = useState(null)
    const [resultComment, setResultComment] = useState('')

    const selected = item.test

     const [selectedStaff, setSelectedStaff] = useState(null);

     const saveResult =() =>{
         if(result==null){
             showEmptyMsg()
             return;

         }
         if(selectedStaff===null){
             showEmptyMsg()

             return;

         }
         
        
        fetch(urlConnection(`add_defined/${currentUser.user_id}`),{
            method:'POST',
            headers:{
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body:JSON.stringify({
                user_id:currentUser.user_id,
                cost:item.cost,
                description:resultComment,
                request_id:item.order_id,
                tecnichian:selectedStaff,
                result_id:result,
                test_id:item.test_id,
                test_name:item.test,
                visit_id: item.visit_id
            })
        })
        .then(res => res.json())
        .then(res =>{
            showToastWithGravity()
            navigation.navigate('TestList')
            console.log(res)
        })
        .catch(err =>{
            showSaveError()
            console.log(err)
        })
     }

     useEffect(() => {
        let test_id = item.test_id
        fetch(urlConnection(`result_options/${test_id}`),{
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

     useEffect(() => {
        Dimensions.addEventListener("change", onChange)
         return () => {
            Dimensions.removeEventListener("change", onChange)
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
                <Text style={{fontSize:17,marginLeft:-20,color:'#fff',fontWeight:'bold'}}>{selected.toUpperCase()}</Text>
                <Text></Text>
            </View>
             <View style={{width:'100%',padding:10, height:"100%",backgroundColor:'#fff'}}>
                <View style={{width:'100%'}}>
                </View>
                <ScrollView contentContainerStyle={{width:'100%', height:'100%'}}>
                <ScrollView 
                showsVerticalScrollIndicator={false}
                 style={{width:'100%',height:'100%'}}>
                    <Text style={{marginTop:15}}>Select Result</Text>
                
                    <View style={{width:'100%',borderWidth:1,borderColor:'#ccc',borderRadius:3,marginVertical:15}}> 
                    <Picker
                        selectedValue={result}
                        onValueChange={(itemValue, itemIndex) =>{
                        setResult(itemValue)
                    }
                    }>
                        <Picker.Item label='- - Select - - ' value={null}/>
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
                        <Picker.Item label='- - Select - -  ' value={null}/>
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
                        style={{width:dimensions.window.width-20,height:70,marginTop:5,borderWidth:0.5}}
                        onChangeText={(e)=>setResultComment(e)}
                        />
                    </View>
                    ):null
                }
               <View style={{width:'100%',flexDirection:'row',alignItems:'center',marginTop:25}}>
              
                <TouchableOpacity
                style={{width:dimensions.window.width-25, height:40,alignSelf:'center',backgroundColor:result !=null?'teal':'#eee',borderRadius:20,justifyContent:'center',alignSelf:'center',marginTop:10}}
                onPress={()=>result !=null?saveResult():null}
                >
                    <Text style={{alignSelf:'center',color:result !=null?'#fff':'black'}}>Save Result</Text>
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

const mapStateToProps =({staff,user}) =>({
    staff: staff.staffList,
    currentUser: user.currentUser
})
export default connect(mapStateToProps)(ResultOne)
