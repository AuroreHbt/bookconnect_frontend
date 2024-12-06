import React from 'react';


export default function HomeScreen() {
    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container} >
                <View>
                    <Text>HOME</Text>
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    )
};


// attention : le StyleSheet doit bien être en dehors de la fonction!
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'powderblue',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
