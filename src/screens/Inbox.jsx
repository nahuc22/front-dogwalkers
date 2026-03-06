import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import React from 'react'
import Container from '../components/Container'
import SearchField from '../components/SearchField'
import AvatarImage from '../components/AvatarImage'
import Label from '../components/Label'
import { scale } from 'react-native-size-matters'
import { appColors } from '../utils/appColors'
import { inboxList } from '../utils/MockData'
import { useNavigation } from '@react-navigation/native'

export default function Inbox() {
  const navigation = useNavigation()

  const InboxCard = ({item})=>{
      const { name , msg , isRead , img } =item
      return <TouchableOpacity 
        style={{  flexDirection:'row', justifyContent:'space-between', alignItems:'center', padding:scale(10), borderBottomColor:appColors.gray, borderBottomWidth:1 }}
        onPress={() => navigation.navigate('ChatScreen', { 
          contact: { name, image: img, status: 'online' }
        })}
      >
        <AvatarImage source={img} size={scale(45)} />
        <View  style={{flex:1,   paddingHorizontal:scale(10)}}>
            <Label text={name}  bold style={{fontSize:scale(20)}} />
            <Label text={msg}  style={{fontSize:scale(10)}} />
        </View>

        {!isRead && <View style={{backgroundColor:appColors.primary , height:scale( 10), width: scale(10), borderRadius:scale(5) }} />}
      </TouchableOpacity>
  }  
  return (
    <Container>
      <View style={{ marginTop:scale(20), paddingHorizontal:scale(7) , paddingVertical:scale(-10)}}>
      <Label text="Chats" bold style={{  fontSize: scale(34) }}/>
      <SearchField placeholder="Search"/> 
      </View>
      <FlatList
      data={inboxList}
      // ItemSeparatorComponent={()=> <View style={{padding:scale(10), backgroundColor:'blue'}} />}
      renderItem={({item,index})=> <InboxCard  item={item} key={index}/> }
      />
    </Container>
  )
}