import {useEffect, useRef, useState} from 'react';
import PipelineItem from "./PipelineItem.jsx";
import SocketManager from "../../Socket/SocketManager";
import LogDisplayer from "./LogDisplayer.jsx";
import {useParams} from "react-router-dom";
import {useScripts} from "../../hooks/ScriptsProvider.jsx";
import {formatDateStringForLogs, handleFile} from "../../utils/utils.js";
import AxiosRequester from "../../Axios/AxiosRequester.js";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload.js";
import * as React from "react";
import Button from "@mui/material/Button";

const PipelineDetails = () => {
    const indexRef = useRef(0);
    const messagesRef = useRef([]);
    const scriptsRef = useRef([]);
    const [messages, setMessages] = useState([]);
    const inputRef = useRef(null);
    const {pipelineId} = useParams();
    const {state, dispatch} = useScripts();
    const [pipelineFinished, setPipelineFinished] = useState(false);

    useEffect(() => {
        if (state.pipelines[pipelineId]) {
            if(state.pipelines[pipelineId].result !== null && state.pipelines[pipelineId].result !== undefined) {
                console.log("Consult details mode");
                console.log(state.pipelines[pipelineId]);
                setPipelineFinished(true);
            } else {
                console.log('HI');
                console.log(state.pipelines[pipelineId]);
                scriptsRef.current = state.pipelines[pipelineId].scriptsId;
                indexRef.current = state.pipelines[pipelineId].index;
                inputRef.current = state.pipelines[pipelineId].input;
                setMessages(state.pipelines[pipelineId].messages);
                SocketManager.connectWebSocketPipeline(pipelineId, handleWebSocketMessage,launchPipelineMethod);
            }
        }
    }, [pipelineId]);

    useEffect(() => {
        if (state.pipelines[pipelineId]) {
            scriptsRef.current = state.pipelines[pipelineId].scriptsId;
            indexRef.current = state.pipelines[pipelineId].index;
            setMessages(state.pipelines[pipelineId].messages);
        }
    }, [state.pipelines[pipelineId]]);

    const handleWebSocketMessage = (message) => {
        // Initialisation de la couleur par défaut
        let color = 'black';
        let messageWithWordsOnly = message.replace(/[^a-zA-Z0-9 ]/g, '');
        const messageAsArray = messageWithWordsOnly.split(' ');
        let newScriptList = scriptsRef.current;
        let index = indexRef.current;
        // Mise à jour de l'état des scripts en fonction du message reçu
        if (messageAsArray.includes("successfully")) {
            newScriptList[index].status = "Done";
            newScriptList[index].result = "success";
            color = 'green';
            index++;

            if (index < newScriptList.length) {
                newScriptList[index].status = "Pending";
            }
            dispatch({
                type: "SET_PIPELINES",
                payload: { pipelineId: pipelineId, scriptsId: newScriptList, index: index }
            });
            indexRef.current = index;
            scriptsRef.current = newScriptList;
        } else if (messageAsArray.includes("failed")) {
            if(index < newScriptList.length) {
                newScriptList[index].status = "Done";
                newScriptList[index].result = "error";
            }
            color = 'red';

            while (index + 1 < newScriptList.length) {
                index++;
                newScriptList[index].status = "Done";
                newScriptList[index].result = "error";
            }

            indexRef.current = index;
            scriptsRef.current = newScriptList;
        }

        // Formattage du message pour l'affichage
        const messageFormatted = {
            text: message,
            date: formatDateStringForLogs(new Date()),
            color: color
        };

        // Mise à jour de l'état des messages
        const currentMessages = messagesRef.current;
        messagesRef.current = [...currentMessages, messageFormatted];
        dispatch({
            type: "SET_PIPELINES",
            payload: { pipelineId: pipelineId, scriptsId: newScriptList, index: index, messages:[...currentMessages, messageFormatted], input: inputRef.current }
        });
    };

    const launchPipelineMethod = async () => {
        console.log('launch');
        const formData = new FormData();
        formData.append("PipelineId", pipelineId);

        if (state.pipelines[pipelineId].input) {
            formData.append("Input", state.pipelines[pipelineId].input);
        }

        const scriptIds = state.pipelines[pipelineId].scriptsId.map(script => script.scriptId);
        scriptIds.forEach(id => formData.append("ScriptIds", id));

        const blob = await AxiosRequester.getInstance().executePipeline(formData);
        //handleFile(blob);
        if(blob !== null) {
            setPipelineFinished(true);
        }

        dispatch({
            type: "SET_PIPELINES",
            payload: {
                pipelineId: pipelineId,
                scriptsId: state.pipelines[pipelineId].scriptsId,
                index: state.pipelines[pipelineId].index,
                messages:messagesRef.current,
                input: state.pipelines[pipelineId].input,
                result: blob
            }
        });
    }

    //TODO:
    // Peut-être lié l'index ici avec un tableau setté dans handleWebSocketMessage lorsque l'on reçoit le lien ou le binary
    const handleDownload = (index) => {
        console.log(index);
    };

    return (
        <>
            <div>Pipeline n°{pipelineId}</div>
            <br/>
            <div className={"mainContainer"} style={{display: "flex", justifyContent: "space-between"}}>
                <div className={"leftContainer"} style={{
                    height: "80vh", width: "39%",
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: '10px',
                    overflow: 'auto'
                }}>
                    {scriptsRef.current.map((item, index) => (
                        <PipelineItem key={index} script={item} index={index} handleDownload={handleDownload}/>
                    ))}
                    {pipelineFinished && (
                        <Button style={{cursor:"pointer"}} onClick={() => handleFile(state.pipelines[pipelineId].result)}>
                            <CloudDownloadIcon style={{marginRight:'5px'}}/> DOWNLOAD RESULT
                        </Button>
                        )}
                </div>
                <div className={"rightContainer"} style={{
                    height: "60vh",
                    width: "59%"
                }}>
                    <LogDisplayer messages={messages}/>
                </div>
            </div>
                    </>
    );
}

export default PipelineDetails;
