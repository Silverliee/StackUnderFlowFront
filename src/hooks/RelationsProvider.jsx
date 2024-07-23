import { createContext, useReducer, useEffect, useContext } from "react";
import AxiosRq from "../Axios/AxiosRequester.js";
import { useAuth } from "../hooks/AuthProvider.jsx";

const RelationsContext = createContext();

const friendsReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_FRIEND':
            return [...state, action.payload];
        case 'REMOVE_FRIEND':
            return state.filter(friend => friend.userId !== action.payload.userId);
        case 'SET_FRIENDS':
            return action.payload;
        default:
            return state;
    }
};

const groupsReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_GROUP':
            return [...state, action.payload];
        case 'REMOVE_GROUP':
            return state.filter(group => group.groupId !== action.payload.groupId);
        case 'SET_GROUPS':
            return action.payload;
        default:
            return state;
    }
};

const followingReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_FOLLOW':
            return [...state, action.payload];
        case 'REMOVE_FOLLOW':
            return state.filter(follow => follow.id !== action.payload.id);
        case 'SET_FOLLOWS':
            return action.payload;
        default:
            return state;
    }
};

const friendRequestsReducer = (state, action) => {
    switch (action.type) {
        case 'REMOVE_FRIEND_REQUEST':
            return state.filter(fr => fr.userId !== action.payload.friendId);
        case 'SET_FRIEND_REQUESTS':
            return action.payload;
        default:
            return state;
    }
};

const groupRequestsReducer = (state, action) => {
    switch (action.type) {
        case 'REMOVE_GROUP_REQUEST':
            return state.filter(gr => gr.groupId !== action.payload.groupId);
        case 'SET_GROUP_REQUESTS':
            return action.payload;
        default:
            return state;
    }
};

const RelationsProvider = ({ children }) => {
    const { authData } = useAuth();
    const initialFriendsState = [];
    const initialGroupsState = [];
    const initialFollowingState = [];
    const initialFriendRequestsState = [];
    const initialGroupRequestsState = [];

    const [myFriends, dispatchFriends] = useReducer(friendsReducer, initialFriendsState);
    const [myGroups, dispatchGroups] = useReducer(groupsReducer, initialGroupsState);
    const [myFollows, dispatchFollows] = useReducer(followingReducer, initialFollowingState);
    const [friendRequests, dispatchFriendRequests] = useReducer(friendRequestsReducer, initialFriendRequestsState);
    const [groupRequests, dispatchGroupRequests] = useReducer(groupRequestsReducer, initialGroupRequestsState);

    const fetchFollows = async () => {
        try {
            const follows = await AxiosRq.getInstance().getFollows();
            dispatchFollows({ type: 'SET_FOLLOWS', payload: follows });
        } catch (error) {
            console.error(error);
        }
    };

    const fetchGroups = async () => {
        try {
            const groups = await AxiosRq.getInstance().getGroups();
            dispatchGroups({ type: 'SET_GROUPS', payload: groups });
        } catch (error) {
            console.error(error);
        }
    };

    const fetchFriends = async () => {
        try {
            const friends= await AxiosRq.getInstance().getFriends();
            dispatchFriends({ type: 'SET_FRIENDS', payload: friends });
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (authData && authData.token) {
            const fetchFriendAndGroupRequests = async () => {
                try {
                    const [friendRequests, groupRequests] = await Promise.all([
                    AxiosRq.getInstance().getFriendRequests(),
                    await AxiosRq.getInstance().getGroupRequests(),
                    ]);
                    dispatchFriendRequests({ type: 'SET_FRIEND_REQUESTS', payload: friendRequests });
                    dispatchGroupRequests({ type: 'SET_GROUP_REQUESTS', payload: groupRequests });
                } catch (error) {
                    console.error(error);
                }
            };
            fetchFriendAndGroupRequests();
            const fetchFriendsGroupsFollows = async () => {
                try {
                    await Promise.all([
                        fetchFriends(),
                        fetchGroups(),
                        fetchFollows(),
                    ]);
                } catch (error) {
                    console.error(error);
                }
            };
            fetchFriendsGroupsFollows();
        }
    }, [authData]);

    return (
        <RelationsContext.Provider
            value={{
                myFriends,
                dispatchFriends,
                myGroups,
                dispatchGroups,
                myFollows,
                dispatchFollows,
                friendRequests,
                dispatchFriendRequests,
                groupRequests,
                dispatchGroupRequests,
                fetchFriends,
                fetchGroups,
                fetchFollows
            }}
        >
            {children}
        </RelationsContext.Provider>
    );
};

export default RelationsProvider;

export const useRelations = () => {
    return useContext(RelationsContext);
};
