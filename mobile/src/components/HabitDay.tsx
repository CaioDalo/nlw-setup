import { Dimensions, TouchableOpacity, TouchableOpacityProps } from "react-native";

const week_days = 7
const screenHorizontalPadding = (32 * 2) / 5

export const dayMarginBetween = 8
export const daySize = (Dimensions.get('screen').width / week_days) - (screenHorizontalPadding + 5)

interface Props extends TouchableOpacityProps {}
export function HabitDay({...rest}) {
    return (
        <TouchableOpacity 
            className="bg-zinc-900 rounded-lg border-2 m-1 border-zinc-800"
            style = {{width: daySize, height: daySize}}
            activeOpacity={0.7}
            {...rest}
        />
    )
}