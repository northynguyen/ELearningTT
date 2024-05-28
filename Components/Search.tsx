import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import Icon from 'react-native-vector-icons/AntDesign'
import database from '@react-native-firebase/database';
import { useNavigation } from '@react-navigation/native';
export default function Search() {
    const [searchText, setSearchText] = useState('');
    const [userList, setUserList] = useState([]);
    const navi = useNavigation();
    useEffect(() => {
        const fetchData = async () => {
            const usersRef = database().ref('User');
            usersRef.on('value', snapshot => {
                const data = snapshot.val();
                if (data) {
                    const formattedData = Object.keys(data).map(key => ({
                        id: key,
                        name: data[key].name,
                        photo: data[key].photo || 'https://via.placeholder.com/40', // Giả sử bạn có URL avatar trong dữ liệu
                        email: data[key].email
                    }));
                    setUserList(formattedData);
                }
            });
        };

        fetchData();
    }, []);

    const handlSearchpress = (item) => {
        setSearchText('');
        navi.navigate('profile', { friend: { userID: item.id, name: item.name, email: item.email, photo: item.photo } });
    }
    const filteredUsers = userList.filter(user =>
        user.id.startsWith(searchText)
    );
    return (
        <View style={styles.container}>
            <View style={styles.searchBox}>
                <Icon name='search1' size={30} color={'black'} style={styles.icon} />
                <TextInput placeholder='Search' placeholderTextColor={'lightgray'} style={styles.searchText} value={searchText}
                    onChangeText={setSearchText} />
            </View>
            {searchText.length > 0 && (
                <FlatList
                    style={styles.flatList}
                    data={filteredUsers}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.userItem}
                            onPress={() => handlSearchpress(item)}
                        >
                            <Image source={{ uri: item.photo }} style={styles.avatar} />
                            <View style={styles.userInfo}>
                                <Text style={styles.userName}>{item.name}</Text>
                                <Text style={styles.userId}>{item.id}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            )}
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        zIndex: 1,

    },
    searchBox: {
        height: 50,
        backgroundColor: 'white',
        marginHorizontal: 25,
        borderRadius: 20,
        elevation: 10,
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    icon: {
        width: 40,
        height: 'auto',
        paddingLeft: 10,
        marginRight: 10,
    },
    searchText: {
        color: 'black',
        flex: 1,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    userItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'lightgray',
    },
    flatList: {
        position: 'absolute',
        top: 70, // Điều chỉnh vị trí của FlatList để nằm dưới TextInput
        left: 0,
        right: 0,
        backgroundColor: 'white',
        zIndex: 2, // Đảm bảo FlatList hiển thị trên các đối tượng khác
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontWeight: 'bold',
        color: 'black'
    },
    userId: {
        color: 'gray',
    },
});
