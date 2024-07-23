import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import {useEffect} from "react";
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';

export default function PipelineItem({script,handleDownload, index}) {
    useEffect(() => {
        // console.log({script});
    }, []);

    return (
        <Box sx={{ display: 'flex', padding: '5px 25px 5px 25px', backgroundColor: script.backgroundColor, borderRadius: '5px', marginBottom:'5px', alignItems:"center", border: "1px solid black", justifyContent:"space-between" }}>
            <div style={{display: 'flex', alignItems:"center",}}>
                {script.status === "Pending" && <CircularProgress/>}
                {script.status === "Done" && <CircularProgress variant="determinate" color={script.result ?? "info"} value={100} />
                }
                {script.status === "Waiting" && <CircularProgress variant="determinate" color={script.result ?? "info"} value={100} />}
                <div style={{marginLeft:"10px"}}>{script.scriptName}</div>
            </div>
            {/*{script.result === "success" && <CloudDownloadIcon style={{cursor:"pointer"}} onClick={() => handleDownload(index)}/>}*/}
        </Box>
    );
}