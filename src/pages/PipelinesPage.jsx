import {useEffect, useState} from "react";
import {useScripts} from "../hooks/ScriptsProvider.jsx";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import {handleFile} from "../utils/utils.js";
import {enqueueSnackbar} from "notistack";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import { useNavigate } from "react-router-dom";
import InfoIcon from '@mui/icons-material/Info';

const PipelinesPage = () => {
    const [pipelines, setPipelines] = useState([]);
    const {state} = useScripts();
    const navigate = useNavigate();

    useEffect(() => {
        const keys = Object.keys(state.pipelines);
        const pipelinesToRegister = keys.map(key => {
            const pipeline = state.pipelines[key];
            return { ...pipeline, pipelineId: key };
        });
        setPipelines(pipelinesToRegister);
    }, [state.pipelines]);

    const handleDownload = (pipelineId) => {
        const pipeline = pipelines.find(p => p.pipelineId === pipelineId);
        if (pipeline && pipeline.result) {
            handleFile(pipeline.result);
        } else {
            const variant = 'error';
            const text = "No result for that pipeline";
            enqueueSnackbar(text, { variant, autoHideDuration: 2000 });
        }
    }

    return (
        <>
            <div>PipelinePage</div>

            <div style={{display:'flex', alignItems:'center'}}><InfoIcon style={{marginRight:'5px', color:'#1976d2'}}/>Launch your own scripts execution pipelines here: <Button onClick={() => navigate('/script')}>Scripts</Button></div>

            {pipelines.length > 0 && (
                pipelines.map((pipeline,index) => (
                    <Card sx={{ maxWidth: 600, marginBottom: 4 }} key={pipeline.pipelineId}>
                        <CardMedia
                            component="img"
                            alt="random_picture"
                            height="140"
                            image={`/assets/pipeline${index%4+1}.jpg`}
                        />
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                                Pipeline n°{pipeline.pipelineId}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {pipeline.scriptsId.map(script => script.scriptName).join(' -> ')}
                            </Typography>
                            <Typography variant="body2" color="blue" style={{textAlign:"end"}}>
                                <Button onClick={() => navigate(`/pipelines/${pipeline.pipelineId}`)}>SEE Details</Button>
                            </Typography>
                            <br/>
                            <Button onClick={() => handleDownload(pipeline.pipelineId)}>
                                <CloudDownloadIcon style={{cursor:"pointer",marginRight: 4}}/>Download Result
                            </Button>
                        </CardContent>
                    </Card>
                ))
            )}
        </>
    );
}

export default PipelinesPage;
