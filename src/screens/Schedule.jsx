import React, { useState } from 'react';
import { ImageBackground, Pressable, View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { scale } from 'react-native-size-matters';
import Label from '../components/Label';
import { appColors } from '../utils/appColors';
import CustomButton from '../components/CustomButton';
import BackButton from '../components/BackButton';
import MiniMap from '../components/MiniMap';
import Reviews from '../components/Reviews';
import { useRoute } from '@react-navigation/native';

export default function Schedule() {
    const route = useRoute();
    const { item } = route.params;
    console.log(item)
    const [activeTab, setActiveTab] = useState("About");
    const [expanded, setExpanded] = useState(false);

    const toggleExpand = () => {
        setExpanded(!expanded);
    };

    const Card = ({ hideBorder, label, subLabel, showDollarSign  }) => {
        return (
            <View style={{ paddingHorizontal: scale(10), borderLeftWidth: scale(hideBorder ? 0 : 0.7), flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <Label style={{ fontSize: scale(13) }} text={showDollarSign ? `$${label}` : label}/>
                <Label style={{ fontSize: scale(13), paddingHorizontal: scale(5), color: appColors.gray }} text={subLabel ? subLabel : "hr"} />
            </View>
        );
    };

    const Badge = ({ label, isActive, onPress }) => {
        return (
            <Pressable onPress={onPress} style={{ justifyContent: 'center', alignItems: 'center', borderRadius: scale(14), backgroundColor: isActive ? appColors.black : appColors.lightGray, padding: scale(12), height: scale(44), width: scale(99) }}>
                <Label style={{ fontSize: scale(13), color: appColors.white }} text={label} bold></Label>
            </Pressable>
        );
    };

    const Tabs = ({ activeTab, setActiveTab }) => {
        return (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: scale(5) , marginBottom:scale(10)}}>
                <Badge isActive={activeTab === "About"} label={"About"} onPress={() => setActiveTab("About")} />
                <Badge isActive={activeTab === "Location"} label={"Location"} onPress={() => setActiveTab("Location")} />
                <Badge isActive={activeTab === "Reviews"} label={"Reviews"} onPress={() => setActiveTab("Reviews")} />
            </View>
        );
    };

    const renderContent = () => {
        if (activeTab === "About") {
            return (
                <View>
                    <View style={{ flexDirection: 'row', paddingVertical: scale(10) }}>
                        <View style={{ height: scale(46) }}>
                            <Label text="Age" style={{ fontSize: scale(13), color: appColors.gray }} />
                            <Label text="27 years" style={{ paddingVertical: scale(5), fontSize: scale(17) }} bold />
                        </View>
                        <View style={{ marginLeft: scale(20), height: scale(46) }}>
                            <Label text="Experience" style={{ fontSize: scale(13), color: appColors.gray }} />
                            <Label text="11 Months" style={{ paddingVertical: scale(5), fontSize: scale(17) }} bold />
                        </View>
                    </View>
                    <View>
                        <Label
                            text="Alex has loved dogs since childhood. He is currently a veterinary student with a life in the small town city, have a nice feeling with the animals Alex has loved dogs since childhood. He is currently a veterinary student with a life in the small town city, have a nice feeling with the animals"
                            style={{ paddingVertical: scale(5), fontSize: scale(13), color: appColors.gray }}
                            numberOfLines={expanded ? undefined : 3}  
                        />
                        <TouchableOpacity onPress={toggleExpand}>
                            <Text style={{ fontSize: 13, color: appColors.primary }}>
                                {expanded ? "Show less" : "Read more"}
                            </Text>
                        </TouchableOpacity>
                        <CustomButton label={"Agendar"} />
                    </View>
                </View>
            );
        } else if (activeTab === "Location") {
            return <MiniMap />;
        } else if (activeTab === "Reviews") {
            return <Reviews />;
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <ImageBackground
                resizeMode="cover"
                source={item.img}
                style={styles.imageBackground}
            >
                <BackButton style={styles.backButton} />
            </ImageBackground>
            <View style={styles.content}>
                <FlatList
                    data={[{ key: 'content' }]}  
                    renderItem={() => (
                        <View>
                            <View style={styles.header}>
                                <Label text={item.name} style={styles.headerText} bold />
                                <View style={styles.cardsContainer}>
                                    <Card hideBorder label={item.price} showDollarSign={true} />
                                    <Card label={item.distance} subLabel={"km"}/>
                                    <Card label={item.rating} subLabel={"⭐"} />
                                    <Card label={"450"} subLabel={"Walks"} />
                                </View>
                            </View>
                            <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
                            {renderContent()}
                        </View>
                    )}
                    keyExtractor={(item) => item.key}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: appColors.white,
    },
    imageBackground: {
        width: scale(350),
        height: scale(450),
    },
    backButton: {
        marginTop: scale(20),
        padding: scale(10),
    },
    content: {
        flex: 1,
        paddingHorizontal: scale(20),
        backgroundColor: appColors.white,
        borderTopLeftRadius: scale(20),
        borderTopRightRadius: scale(20),
        marginTop: -50,
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: scale(20),
    },
    header: {
        paddingVertical: scale(10),
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomColor: appColors.gray,
        borderBottomWidth: 1,
        marginTop: scale(5)
    },
    headerText: {
        fontSize: scale(28),
    },
    cardsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
});
