import React from 'react'
import { Text, View } from 'react-native';

const checking = (...arr) =>{
    return arr.join(' ');
}

const Testing = (props) => {
  return (
    <View>
        <Text>Hello Naveen {checking('Naveen','Sinduja','Pragnya','Praneetha')}. Good to see you all</Text>
        <Text>This is {props.firstName} {props.lastName}</Text>
    </View>
  )
}

export default Testing