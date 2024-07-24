import React, {createContext, useContext, useEffect, useReducer} from "react";
import AxiosRq from "../Axios/AxiosRequester";
import {useAuth} from "./AuthProvider";
import {useRelations} from "./RelationsProvider";

const ScriptsContext = createContext();

const scriptsReducer = (state, action) => {
    switch (action.type) {
        case 'SET_PIPELINES':
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

            dispatch({ type: 'SET_MY_FRIENDS_SCRIPTS', payload: [] });
        };
    fetchFriends();
    }, [authData?.userId, friends]);

    useEffect(() => {
        const fetchGroups = async () => {
            if (!authData?.userId) return;
            dispatch({ type: 'SET_MY_GROUPS_SCRIPTS', payload: [] });

        };
        fetchGroups();
    }, [authData?.userId, groups]);

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
