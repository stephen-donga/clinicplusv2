import React,{useState} from 'react'
import { View, Text } from 'react-native'
import SearchableDropdown from 'react-native-searchable-dropdown';



const items = [
    {
      id: 6,
      label: 'Python',
    },
    {
      id: 7,
      label: 'Go',
    },
    {
      id: 8,
      label: 'Swift',
    },
  ];

const tryDropDown = () => {

    const [selected, setSelected] = useState([])
    return (
        <View style={{flex:1,backgroundColor:'#fff'}}>

            <SearchableDropdown 
            multiple={true}
            selectedItems={selected}
            containerStyle={{padding:5}}
            onItemSelect={(item)=>{
                const itemz = selected
                itemz.push(item)
                setSelected(itemz)
            }}
            onRemoveItem={(item,idx)=>{
                const itm = selected.filter(selectedItm =>selectedItm.id !=item.id)
                setSelected(itm)
            }}
            itemStyle={{
                padding: 10,
                marginTop: 2,
                backgroundColor: '#fff',
                borderColor: '#bbb',
                borderWidth: 1,
                borderRadius: 5,
              }}
              itemTextStyle={{ color: '#222' }}
              itemsContainerStyle={{ maxHeight: 140 }}
              items={items}
              defaultIndex={2}
            chip={true}
            resetValue={false}
            textInputProps={
                {
                  placeholder: "placeholder",
                  underlineColorAndroid: "transparent",
                  style: {
                      padding: 12,
                      borderWidth: 1,
                      borderColor: '#ccc',
                      borderRadius: 5,
                  },
                //   onTextChange: text => alert(text)
                }
              }

              listProps={
                {
                  nestedScrollEnabled: true,
                }
              }
            
            />
        </View>
    )
}

export default tryDropDown
