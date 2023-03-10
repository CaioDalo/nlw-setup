import { useNavigation, useFocusEffect } from "@react-navigation/native";
import dayjs from "dayjs";
import { useCallback, useState } from "react";
import { View, Text, ScrollView, Alert } from "react-native";
import { HabitDay, daySize } from "../components/HabitDay";
import { Header } from "../components/Header";
import { Loading } from "../components/Loading";

import { api } from "../libs/axios";
import generateDatesFromYearBeginning from '../utils/generate-dates-from-year-beginning'

const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S',]
const datesFromYearStarts = generateDatesFromYearBeginning()
const minimumSummaryDatesSizes = 18 * 5
const amountOfDaysToFill = minimumSummaryDatesSizes - datesFromYearStarts.length

type SummaryProps = Array<{
    id: string,
    date: string,
    amount: number,
    completed: number,
}>

export function Home() {
    const { navigate } = useNavigation()

    const [loading, setLoading] = useState(true)
    const [summary, setSummary] = useState<SummaryProps | null>(null)

    async function fetchData() {
        try {
            setLoading(true)
            const response = await api.get('summary')
            setSummary(response.data)
        } catch (error) {
            Alert.alert('Ops', 'Não foi possivel carregar o sumário de hábitos')
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useFocusEffect(useCallback(() => {
        fetchData()
    }, []))

    if(loading) {
        return  (
            <Loading />
        )
    }

    return (
        <View className='flex-1 bg-background px-8 pt-16'>
            <Header />

            <View className="flex-row justify-between mt-6 mb-2">
                {
                    weekDays.map((day, index) => (
                        <Text 
                            key={`${day}-${index}`}
                            className='text-zinc-400 text-xl font-bold text-center mx-1'
                            style={{width: daySize}}
                        >
                            {day}
                        </Text>
                    ))
                }
            </View>
            
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 50}}>
                {
                    summary &&
                    <View className="flex-row flex-wrap">
                        {
                            datesFromYearStarts.map(date => {
                                const dayWithHabits = summary.find(day => {
                                    return dayjs(date).isSame(day.date, 'day')
                                })

                                return (
                                    <HabitDay 
                                        key={date.toISOString()}
                                        date={date}
                                        amountOfHabits={dayWithHabits?.amount}
                                        amountCompleted={dayWithHabits?.completed}
                                        onPress={() => navigate('habit', { date: date.toISOString()})}
                                    />
                                )
                            })
                        }

                        {
                            amountOfDaysToFill > 0 && Array.from({ length: amountOfDaysToFill }).map((_, index) => {
                                return (
                                    <View 
                                        key={index} 
                                        className="bg-zinc-900 rounded-lg border-2 m-1 border-zinc-800 opacity-40"
                                        style={{width: daySize, height: daySize}}
                                    />
                                )
                            }) 
                        }
                    </View>
                }
            </ScrollView>
        </View>
    )
}