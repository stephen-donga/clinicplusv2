import React,{useState,useEffect} from 'react'
import { View, Text,Dimensions, Picker,ToastAndroid,TextInput, StyleSheet, TouchableOpacity, } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'
import {urlConnection} from '../url'
import {connect} from 'react-redux'


const window = Dimensions.get('window')
const screen = Dimensions.get('screen')

const ResultCommenEntry = ({staff,currentUser,route,navigation}) => {

    let item = route.params;
    const selected = item.test;

    const capitalize = (name)=>{
        return name.charAt(0).toUpperCase()+name.slice(1)
    }

    const [comment, setComment] = useState('')
    const [selectedStaff,setSelectedStaff]= useState(null)

    const [dimensions, setDimensions] = useState({ window, screen });
    const onChange = ({ window, screen }) => {
        setDimensions({ window, screen });
    }

    const showEmpty = () => {
        ToastAndroid.showWithGravity(
          "Please enter result comment !",
          ToastAndroid.BOTTOM,
          ToastAndroid.BOTTOM
        );
      };

      const showSaveSuccess = () => {
        ToastAndroid.showWithGravity(
          "Result Saved",
          ToastAndroid.BOTTOM,
          ToastAndroid.BOTTOM
        );
      };

      const staffSelectionHandler = () => {
        ToastAndroid.showWithGravity(
          "Please select Technician !",
          ToastAndroid.BOTTOM,
          ToastAndroid.BOTTOM
        );
      };

    const saveResult = ()=>{    
        if(selectedStaff===null){
            staffSelectionHandler()
            return;
        }
        if(comment ==='' || null){
            showEmpty()
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
                description:comment,
                request_id:item.order_id,
                tecnichian:selectedStaff,
                test_id:item.test_id,
                cost:item.cost,
                test_name:item.test,
                visit_id: item.visit_id
            })
        })
        .then(response => response.json())
        .then(res => {
            res.status === 200 ? navigation.navigate('TestList'): null
            res.status === 200 ? showSaveSuccess():null
            console.log(res)
        })
        .catch(err =>console.log(err))


    }

    useEffect(() => {
        Dimensions.addEventListener("change", onChange)
        return () => {
            Dimensions.removeEventListener("change", onChange)
        setComment('')

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
                <Text style={{fontSize:15,color:'#fff',marginLeft:-35,fontWeight:'bold'}}>{selected.toUpperCase()}</Text>
                <Text></Text>
            </View>
            <View style={styles.inputarea} >

            <Text style={{marginTop:20,fontWeight:'bold'}}>Select Technician ( Who exactly made the spacemen examination)</Text>
                    <View style={{width:'100%',borderWidth:1,borderColor:'#ccc',borderRadius:3,marginVertical:15}}> 

                    <Picker
                        selectedValue={selectedStaff}
                        onValueChange={(itemValue, itemIndex) =>
                        setSelectedStaff(itemValue)
                    }>
                        <Picker.Item label='- - Select - - ' value={null}/>
                    {
                        staff.map(member =>(
                        <Picker.Item label={capitalize(member.name.toLowerCase())} value={member.id} key={member.id} />
                        
                        ))
                    }
                    </Picker>
                    </View>
                <Text style={styles.text}>Result comment.</Text>
                <TextInput 

                    multiline={true}
                    value={comment}
                    onChangeText={e =>setComment(e)}
                    
                    style={{
                        borderWidth:1,
                        borderColor:'#ccc',
                        height:100,
                        padding:10,
                        width:dimensions.window.width-30}}
                    />

        <View style={{width:'100%',flexDirection:'row',alignItems:'center',marginTop:25}}>
              
              <TouchableOpacity
                style={{width:dimensions.window.width-25, height:40,alignSelf:'center',backgroundColor:'teal' ,borderRadius:20,justifyContent:'center',alignSelf:'center',marginTop:10}}
                onPress={saveResult}
                >
                  <Text style={{alignSelf:'center',color:'#fff'}}>Save Result</Text>
              </TouchableOpacity>

              </View>
              <TouchableOpacity
                style={{width:dimensions.window.width/1.2+40, height:50 }}
                >

              </TouchableOpacity>

            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    inputarea:{
        width:'100%',
        height:'100%',
        backgroundColor:'#fff',
        paddingHorizontal:15,
        paddingVertical:15
    } ,
    text:{
        fontSize:16,
        color:'#10093E',
        marginVertical:5
    }
})

const mapStateToProps =({user,staff})=>({
    currentUser: user.currentUser,
    staff: staff.staffList
})
export default connect(mapStateToProps)(ResultCommenEntry);
