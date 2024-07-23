import React, {createContext, useContext, useEffect, useReducer} from "react";
import AxiosRq from "../Axios/AxiosRequester";
import {useAuth} from "./AuthProvider";
import {useRelations} from "./RelationsProvider";

const ScriptsContext = createContext();

const scriptsReducer = (state, action) => {
    switch (action.type) {
        case 'SET_PIPELINES':
            console.log("SET_PIPELINES");
            console.log(action.payload);
            return {
                ...state,
                pipelines: {
                    ...state.pipelines,
                    [action.payload.pipelineId]: {
                        scriptsId: action.payload.scriptsId,
                        index: action.payload.index,
                        messages: action.payload.messages,
                        input: action.payload.input,
                        result: action.payload.result
                    }
                }
            };
        case 'SET_SCRIPTS_FOUND':
            return { ...state, scriptsFound: action.payload };
        case 'ADD_SCRIPTS':
            const updatedScriptsFound = [...state.scriptsFound, action.payload];
            return { ...state, scriptsFound: updatedScriptsFound };
        case 'SET_MY_FRIENDS_SCRIPTS':
            return { ...state, myFriendsScripts: action.payload };
        case 'SET_MY_GROUPS_SCRIPTS':
            return { ...state, myGroupsScripts: action.payload };
        case 'SET_MY_FOLLOWING_SCRIPTS':
            return { ...state, myFollowingScripts: action.payload };
        case 'SET_GROUP_MEMBERS':
            return { ...state, groupMembers: action.payload };
        case 'SET_FILTERED_SCRIPTS':
            return { ...state, filteredScripts: action.payload };
        default:
            return state;
    }
};

const initialState = {
    scriptsFound: [],
    myFriendsScripts: [],
    myGroupsScripts: [],
    myFollowingScripts: [],
    groupMembers: [],
    pipelines:{},
    filteredScripts: {
        scriptsFoundFiltered: [],
        friendsScriptsFiltered: [],
        groupsScriptsFiltered: [],
        followingScriptsFiltered: []
    }
};

const ScriptsProvider = ({ children }) => {
    const [state, dispatch] = useReducer(scriptsReducer, initialState);
    const { authData } = useAuth();
    const { myFriends: friends, myGroups: groups, myFollows: follows } = useRelations();

    useEffect(() => {
        const fetchScripts = async () => {
            if (!authData?.userId) return;

            // const scriptsLoaded = await AxiosRq.getInstance().getScripts();
            dispatch({ type: 'SET_SCRIPTS_FOUND', payload: [] });
        };
        fetchScripts();
    }, [authData?.userId]);

    useEffect(() => {
        const fetchFriends = async () => {
            if (!authData?.userId) return;

            // const friendsScripts = await Promise.all(friends?.map(async (friend) => {
            //     const friendScripts = await AxiosRq.getInstance().getScriptByUserIdAndVisiblity(
            //         friend.userId, "Friend"
            //     );
            //     return friendScripts;
            // }));
            //dispatch({ type: 'SET_MY_FRIENDS_SCRIPTS', payload: friendsScripts.flat() });
            dispatch({ type: 'SET_MY_FRIENDS_SCRIPTS', payload: [] });
        };
    fetchFriends();
    }, [authData?.userId, friends]);

    useEffect(() => {
        const fetchGroups = async () => {
            if (!authData?.userId) return;

            //const groupMembersByGroupId = await fetchGroupsAndMembers(groups);
            // const groupsScripts = await Promise.all(groups?.map(async (group) => {
            //     const groupMembers = groupMembersByGroupId.find(gp => gp.groupId === group.groupId)?.members || [];
            //     const scripts = await Promise.all(groupMembers?.map(async (member) => {
            //         return await AxiosRq.getInstance().getScriptByUserIdAndVisiblity(
            //             member.userId, "Group", group.groupId
            //         );
            //     }));
            //     return scripts.flat();
            // }));
            //dispatch({ type: 'SET_MY_GROUPS_SCRIPTS', payload: groupsScripts.flat() });
            dispatch({ type: 'SET_MY_GROUPS_SCRIPTS', payload: [] });

        };
        fetchGroups();
    }, [authData?.userId, groups]);

    // useEffect(() => {
    //     const fetchFollows = async () => {
    //         if (!authData?.userId) return;
    //         //
    //         // const followingScripts = await Promise.all(follows?.map(async (follow) => {
    //         //     return await AxiosRq.getInstance().getScriptByUserIdAndVisiblity(
    //         //         follow.userId, "Follow"
    //         //     );
    //         // }));
    //         // dispatch({ type: 'SET_MY_FOLLOWING_SCRIPTS', payload: followingScripts.flat() });
    //         dispatch({ type: 'SET_MY_FOLLOWING_SCRIPTS', payload: [] });
    //
    //     };
    //     fetchFollows();
    // }, [authData?.userId, follows]);

    // const fetchGroupsAndMembers = async (groups) => {
    //     try {
    //         const memberPromises = groups.map(async (group) => {
    //             const members = await AxiosRq.getInstance().getGroupMembers(group.groupId);
    //             return {
    //                 groupId: group.groupId,
    //                 members: members.map(m => ({ userId: m.userId, username: m.username }))
    //             };
    //         });
    //         const membersResults = await Promise.all(memberPromises);
    //         dispatch({ type: 'SET_GROUP_MEMBERS', payload: membersResults });
    //         return membersResults;
    //     } catch (error) {
    //         console.error("Failed to fetch groups or group members", error);
    //     }
    // };

    return (
        <ScriptsContext.Provider value={{ state, dispatch }}>
            {children}
        </ScriptsContext.Provider>
    );
};

export default ScriptsProvider;

export const useScripts = () => {
    return useContext(ScriptsContext);
};
