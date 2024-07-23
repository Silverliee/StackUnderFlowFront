import React, { useEffect, useState } from "react";
import AxiosRq from "../Axios/AxiosRequester";
import { useAuth } from "../hooks/AuthProvider";
import UnstyledInputIntroduction from "../components/Custom/UnstyledInputIntroduction.jsx";
import UnstyledSelectIntroduction from "../components/Custom/UnstyledSelectIntroduction.jsx";
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import {Button, Snackbar} from "@mui/material";
import { Typography } from "@mui/material";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MyScriptsList from "../components/Script/MyScriptsList.jsx";
import MyNewScriptsList from "../components/Script/MyNewScriptList.jsx";
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import MultipleSelectCheckmarks from "../components/Custom/MultipleSelectCheckmarks.jsx";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import {enqueueSnackbar, useSnackbar} from "notistack";
import {HtmlTooltip} from "../components/Custom/HtmlTooltip.jsx";
import AlertDialog from "../components/Custom/AlertDialog.jsx";
import PipelineDetails from "../components/Pipeline/PipelineDetails.jsx";
import {useScripts} from "../hooks/ScriptsProvider.jsx";
import {useNavigate} from "react-router-dom";
import {styled} from "@mui/material/styles";
import InfoIcon from "@mui/icons-material/Info.js";

function ScriptListPage() {
    const [search, setSearch] = useState("");
    const [selectedLanguage, setSelectedLanguage] = useState("");
    const [display, setDisplay] = useState("none");
    const [scriptsFound, setScriptsFound] = useState([]);
    const [selectedScripts, setSelectedScripts] = useState([]);
    const [selectedScriptsTag, setSelectedScriptsTag] = useState([]);
    const [invalidScriptIds,setInvalidScriptIds] = useState([]);
    const [scriptsFoundFiltered, setScriptsFoundFiltered] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [scriptsFoundPaginated, setScriptsFoundPaginated] = useState([]);
    const [openOptions, setOpenOptions] = useState(false);
    const [inputType, setInputType] = useState([]);
    const [outputType, setOutputType] = useState([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [openPipelinePage, setOpenPipelinePage] = useState(false);
    const [pipelineId, setPipelineId] = useState(18);
    const [pipelineIdlist, setPipelineIdlist] = useState([]);
    const [buttonType, setButtonType] = useState('error');

    const [open, setOpen] = useState(false);
    const [text,setText] = useState("");
    const [scriptIdToDelete, setScriptIdToDelete] = useState("");
    const [deleteCase, setDeleteCase] = useState(1);
    const [input,setInput] = useState(null);

    const userId = useAuth().authData?.userId;
    const {state, dispatch} = useScripts()

    const acceptedFormat = ["None",".png",".jpeg",".txt",".pdf",".xlsx"];

    const { enqueueSnackbar } = useSnackbar();

    const navigate = useNavigate();


    useEffect(() => {
        fetchScripts();
    }, [userId]);

    useEffect(() => {
        checkScripts();
        if (selectedScriptsTag.length === 0) {
            setInput(null);
        }
    }, [selectedScriptsTag]);

    useEffect(() => {
        setScriptsFoundFiltered(
            scriptsFound?.filter((script) => {
                if (selectedLanguage === "Any language") return true;
                return script.programmingLanguage === selectedLanguage;
            }).filter((script) => {
                if (inputType.length === 0) return true;
                return checkTypes(script.inputScriptType,inputType);
            }).filter((script) => {
                if (outputType.length === 0) return true;
                return checkTypes(script.outputScriptType,outputType);
            })
        );
    }, [
        scriptsFound,
        selectedLanguage,
        inputType,
        outputType
    ]);

    useEffect(() => {
        console.log({pipelines:state.pipelines})
    }, [state]);

    useEffect(() => {
        setScriptsFoundPaginated(
            scriptsFoundFiltered.slice(page * rowsPerPage, (page + 1) * rowsPerPage)
        );
    }, [rowsPerPage, page, scriptsFoundFiltered]);

    useEffect(() => {
        handleSearch();
    }, [search, selectedLanguage]);

    const VisuallyHiddenInput = styled("input")({
        clip: "rect(0 0 0 0)",
        clipPath: "inset(50%)",
        height: 1,
        overflow: "hidden",
        position: "absolute",
        bottom: 0,
        left: 0,
        whiteSpace: "nowrap",
        width: 1,
    });

    const fetchScripts = async () => {
        //const scriptsLoaded = await AxiosRq.getInstance().getScripts();
        const scriptsLoaded = await AxiosRq.getInstance().getMyScriptsAndFavoriteScript();
        setScriptsFound(scriptsLoaded);
        setSelectedLanguage("Any language");
        setDisplay("block");
    }

    const findScriptById = (id) => {
        const script = scriptsFound.find(script => script.scriptId === id);
        return script;
    }

    const handleChangeInput = (event) => {
        setInput(null);
        const selectedFile = event.target.files[0];
        if (selectedFile && selectedFile.type) {
            setInput(selectedFile);
            const type = getInputFileType(selectedFile);
            if (selectedScriptsTag.length > 0) {
                console.log(selectedScriptsTag[0].inputScriptType);
                console.log(type);
                console.log(selectedScriptsTag[0].inputScriptType !== type ? 'error':'info');
                setButtonType(selectedScriptsTag[0].inputScriptType !== type ? 'error':'info');
            }
        } else {
            const variant = 'error';
            enqueueSnackbar("Invalid file type",{variant, autoHideDuration: 2000})
        }
    }

    const checkTypes = (string, types) => {
        // Sépare la chaîne en mots en utilisant la virgule comme délimiteur
        const words = string.split(',');

        // Vérifie chaque mot pour voir s'il est présent dans le tableau
        for (let i = 0; i < words.length; i++) {
            const trimmedWord = words[i].trim(); // Enlève les espaces autour du mot
            if (types.includes(trimmedWord)) {
                return true; // Retourne true dès qu'un mot est trouvé dans le tableau
            }
        }

        return false; // Retourne false si aucun mot n'est trouvé dans le tableau
    }

    const getInputFileType = (selectedFile) => {
        if (input) {
            const tab = input.name.split(".");
            return "." + tab[tab.length-1];
        }
        if (selectedFile){
            const tab = selectedFile.name.split(".");
            return "." + tab[tab.length-1];
        }
        return "";
    }

    const checkScripts = () => {
        const mismatchedIds = [];
        if(input) {
            const type = getInputFileType();
            if (selectedScriptsTag.length > 0) {
                setButtonType(selectedScriptsTag[0].inputScriptType !== type ? 'error':'info');
            }
        }

        for (let i = 0; i < selectedScriptsTag.length - 1; i++) {
            const currentScript = selectedScriptsTag[i];
            const nextScript = selectedScriptsTag[i + 1];

            const currentOutputTypes = currentScript.outputScriptType.split(',');
            const nextInputTypes = nextScript.inputScriptType.split(',');

            const hasMatch = nextInputTypes.some(inputType => currentOutputTypes.includes(inputType));

            if (!hasMatch) {
                mismatchedIds.push(i+1);
                setOpenSnackbar(true);
                const variant = 'error'
                enqueueSnackbar("mismatched input/output script !",{variant, autoHideDuration: 2000})
            }
        }

        setInvalidScriptIds(mismatchedIds)
        return mismatchedIds;
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleItemSelected = (event) => {
        if (event.target.checked) {
            setSelectedScripts([...selectedScripts, event.target.id]);
        } else {
            setSelectedScripts(
                selectedScripts?.filter((script) => script !== event.target.id)
            );
        }
    };

    const handleOnClick = (id) => {
        const item = findScriptById(id);
        setSelectedScriptsTag([...selectedScriptsTag, item]);
    }

    const handleDeleteTag = (indexToRemove) => {
        setSelectedScriptsTag(
            selectedScriptsTag.filter((_, index) => index !== indexToRemove)
        )
    }

    const handleDelete = async (scriptId) => {
        setScriptIdToDelete(scriptId);
        setDeleteCase("One");
        setText("Are you sure you want to delete this script? (All version will be removed)");
        setOpen(true);
    }

    const handleConfirm = async () => {
        switch(deleteCase) {
            case "One":
                AxiosRq.getInstance().deleteScript(scriptIdToDelete);
                setScriptsFound(scriptsFound.filter((script) => script.scriptId !== scriptIdToDelete));
                setSelectedScripts(selectedScripts.filter((script) => script.scriptId !== scriptIdToDelete));
                setSelectedScriptsTag(selectedScriptsTag.filter((script) => script.scriptId !== scriptIdToDelete));
                break;
            case "Several":
                let scriptsWithoutDeletedScripts = scriptsFound;
                let selectedScriptsTagWithoutDeletedScripts = selectedScriptsTag;
                for (const scriptId of selectedScripts) {
                    AxiosRq.getInstance().deleteScript(scriptId);
                    scriptsWithoutDeletedScripts = scriptsWithoutDeletedScripts?.filter(
                        (script) => script.scriptId != scriptId
                    );
                    selectedScriptsTagWithoutDeletedScripts = selectedScriptsTagWithoutDeletedScripts?.filter((script) => script.scriptId != scriptId);
                }
                setScriptsFound(scriptsWithoutDeletedScripts);
                setSelectedScriptsTag(selectedScriptsTagWithoutDeletedScripts);
                setSelectedScripts([]);
                break;
            case "Unfavorite":
                AxiosRq.getInstance().removeAsFavoriteScript(scriptIdToDelete);
                setScriptsFound(scriptsFound.filter((script) => script.scriptId !== scriptIdToDelete));
                setSelectedScripts(selectedScripts.filter((script) => script.scriptId !== scriptIdToDelete));
                setSelectedScriptsTag(selectedScriptsTag.filter((script) => script.scriptId !== scriptIdToDelete));
                break;
        }
        setOpen(false);
    };
    const handleDeleteSelection = async () => {
        setDeleteCase("Several");
        setText("Are you sure you want to delete the selected scripts? (All version will be removed)");
        setOpen(true);
    };

    const handleSelectChange = (event) => {
        const value = event?.target?.innerHTML; // Get the selected value
        setSelectedLanguage(value);
    };
    const handleKeyDown = async (event) => {
        if (event.key === "Enter") {
            handleSearch();
        }
    };
    const handleReset = () => {
        setSearch("");
        setOpenOptions(false);
        setScriptsFoundFiltered(scriptsFound);
        setScriptsFound(scriptsFound);
        setSelectedScriptsTag([]);
        setInvalidScriptIds([]);
        setSelectedLanguage("Any language");
        setInputType([]);
        setOutputType([])
        setPage(0);
        setRowsPerPage(5);
        setSelectedScripts([]);
    };
    const handleOpenAdvancedOptions = () => {
        setOpenOptions(!openOptions);
    };

    const handleSearch = async () => {
        setScriptsFoundFiltered(
            scriptsFound
                ?.filter((script) => {
                    if (selectedLanguage === "Any language") return true;
                    return script.programmingLanguage === selectedLanguage;
                })
                ?.filter((script) => {
                    return script.scriptName
                        .toLowerCase()
                        ?.includes(search.toLowerCase());
                })
        );
        setDisplay("block");
    };

    const handleChangeInputType = (event) => {
        const {
            target: { value },
        } = event;
        setInputType(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    const handleChangeOutputType = (event) => {
        const {
            target: { value },
        } = event;
        setOutputType(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };
    const launchPipeline = () => {
        //it will launch the pipeline request and also subscribe to the websocket associated to the pipeline
        const scriptsIdToExecute = selectedScriptsTag.map((script) => script.scriptId);
        // const pipelineId = AxiosRq.getInstance().executePipeline(scriptsIdToExecute);
        const pipelineId = crypto.randomUUID();
        const scriptListFormatted = selectedScriptsTag.map((item,index) => {
            if (index === 0) {
                return {...item,status:"Pending",result:"info",backgroundColor:"#c5e2ee"}
            }
            return {...item,status:"Waiting",result:"info",backgroundColor:"#c5e2ee"}
        });
        dispatch({
            type:"SET_PIPELINES",
            payload: {pipelineId: pipelineId,scriptsId: scriptListFormatted, index:0, messages:[], input:input}
        });
        navigate(`/pipelines/${pipelineId}`);
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenSnackbar(false);
    };

    const handleUnfavorite = (scriptId) => {
        setScriptIdToDelete(scriptId);
        setDeleteCase("Unfavorite");
        setText("Are you sure you want to remove this favorite script?");
        setOpen(true);
    }

    const handleFavorite = (script) => {

    }

    const action = (
        <React.Fragment>
            <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleClose}
            >
                <CloseIcon fontSize="small" />
            </IconButton>
        </React.Fragment>
    );

    return (
        <>
            <div>
                <div>ScriptListPage</div>
                {selectedScriptsTag.length === 0 &&(<div style={{display: 'flex', alignItems: 'center'}}><InfoIcon
                    style={{marginRight: '5px', color: '#1976d2'}}/>To Launch your own scripts execution pipelines,
                    click on scripts !</div>)}

                <div className="container--search-bar" style={{display: "flex"}}>
                    <UnstyledInputIntroduction
                        value={search}
                        id="search"
                        name="search"
                        handleInput={(event) => {
                            setSearch(event.target.value);
                        }}
                        handleKeyDown={handleKeyDown}
                        placeholder={"Enter your research"}
                    />
                    <Button onClick={handleSearch}>Search</Button>
                    <Button onClick={handleReset}>Reset</Button>
                    {selectedScripts.length > 0 && (
                        <Button onClick={handleDeleteSelection} style={{color: "red"}}>
                            Delete Selected Scripts
                        </Button>
                    )}
                </div>
                <div>
                    <Button onClick={handleOpenAdvancedOptions}>Advanced Options</Button>
                </div>
                <div id="advanced-options" style={{display: openOptions ? "block" : "none"}}>
                    <UnstyledSelectIntroduction
                        options={["Python", "Csharp"]}
                        handleSelectChange={handleSelectChange}
                        selectedValue={selectedLanguage}
                        label="Programming Language"
                        defaultValue="Any language"
                    />
                    <MultipleSelectCheckmarks formats={acceptedFormat} handleChange={handleChangeInputType}
                                              value={inputType} tag={'Input'}
                    />
                    <MultipleSelectCheckmarks formats={acceptedFormat} handleChange={handleChangeOutputType}
                                              value={outputType} tag={'Output'}
                    />
                </div>
                {selectedScriptsTag.length > 0 && (
                    <>
                        <Stack direction="row" spacing={1}>
                            {selectedScriptsTag.map((script, index) => (
                                <HtmlTooltip
                                    title={
                                        <React.Fragment>
                                            <Typography color="inherit">Input types:</Typography>
                                            <b>{script.inputScriptType.replaceAll(',', ' / ')}</b> .{' '}
                                            <Typography color="inherit">Output types:</Typography>
                                            <b>{script.outputScriptType.replaceAll(',', ' / ')}</b>.{' '}
                                        </React.Fragment>
                                    }
                                >
                                    <Chip
                                        style={{}}
                                        key={index}
                                        label={script.scriptName}
                                        onDelete={() => handleDeleteTag(index)}
                                        color={invalidScriptIds.includes(index) ? 'error' : 'info'}
                                    />
                                </HtmlTooltip>
                            ))}
                            <Button onClick={launchPipeline}
                                    disabled={invalidScriptIds.length > 0 || buttonType === 'error'}>
                                Pipeline
                                <RocketLaunchIcon/>
                            </Button>
                        </Stack>
                        <div style={{
                            display: "flex", alignItems: "center"
                        }}>
                            <Button component="label"
                                    role={undefined}
                                    variant="contained"
                                    color={buttonType}
                                    tabIndex={-1}
                            >Input
                                <VisuallyHiddenInput
                                    type="file"
                                    onChange={handleChangeInput}
                                />
                            </Button>
                            <p style={{marginLeft: "10px"}}>{input?.name}</p>
                        </div>
                    </>
                )}
                <Accordion defaultExpanded>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon/>}
                        aria-controls="panel1-content"
                        id="panel1-header"
                    >
                        <Typography>My Scripts</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <MyNewScriptsList
                            item={"my"}
                            myScripts={true}
                            display={display}
                            search={search}
                            scriptsFoundFiltered={scriptsFoundFiltered}
                            handleDelete={handleDelete}
                            userId={userId}
                            selectedScripts={selectedScripts}
                            page={page}
                            rowsPerPage={rowsPerPage}
                            scriptsFoundPaginated={scriptsFoundPaginated}
                            handleChangePage={handleChangePage}
                            handleChangeRowsPerPage={handleChangeRowsPerPage}
                            handleItemSelected={handleItemSelected}
                            handleOnClick={handleOnClick}
                            handleFavorite={handleFavorite}
                            handleUnfavorite={handleUnfavorite}
                        />
                    </AccordionDetails>
                </Accordion>
                <AlertDialog text={text} open={open} handleClose={() => setOpen(false)} handleConfirm={handleConfirm}/>
            </div>
        </>
    );
}

export default ScriptListPage;
