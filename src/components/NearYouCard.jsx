import React from 'react'
import { View , Text, ImageBackground} from 'react-native'
import { scale } from 'react-native-size-matters'
import Label from './Label'
import { appColors } from '../utils/appColors'
import { MaterialIcons } from '@expo/vector-icons'

export default function NearYouCard({item}) {
    const {
        name,
        img,
        distance,
        price,
        rating,
    } = item;


    const _renderRating = () => {
        return <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'center', backgroundColor:'rgba(229,229,243,0.2)',  position:'absolute', top: scale(10) , right: scale(10), padding:scale(10)}}>
            <MaterialIcons name="star" color={appColors.primary} />
            <Label text={rating} bold style={{color:appColors.primary, fontSize:scale(10), marginTop: scale(2.5), marginLeft: scale(2)}}></Label>
        </View>
    }
  return (
    <View style={{ borderRadius: scale(14), justifyContent: 'center' , alignItems: 'center'}}>
        <ImageBackground resizeMode='cover' source={img} style={{ height:scale(176), width: scale(200), borderRadius: scale(14), overflow:'hidden'}}/>
        {_renderRating()}
            <View style={{width:scale(200) , paddingVertical:scale(20), flexDirection:'row', justifyContent:'space-between' , alignItem: 'center'}}>
                <View>
                    <Label text={name} bold />
                    <View style={{flexDirection:'row', justifyContent:'center', alignItem:'center'}}>
                    <MaterialIcons name="place" style={{marginTop: scale(1)}} / >
                    <Label text={`${distance} km from you`} style={{fontSize: scale(10), marginLeft: scale(5)}} />
                    </View>
                </View>
                <View backgroundColor="black" style={{ paddingVertical:scale(8), paddingHorizontal:scale(5)}} borderRadius={scale(7)} >
                    <Label text={`$${price}/h`}  style={{color:appColors.white, paddingHorizontal:scale(10)}} bold /> 
                </View>
            </View>
    </View>
  )
}
