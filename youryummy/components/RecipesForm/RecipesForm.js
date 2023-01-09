import * as React from 'react';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveIcon from '@mui/icons-material/Remove';
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import { useState, useEffect } from "react";
import {recipes} from "../../pages/recipes/utils/recipes";
import UploadImage from "../UploadImage";

const Img = styled('img')({
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
});

export default function RecipesForm({data}) {
    const [stepsList, setStepsList] = useState(recipes["steps"]);
    const [tagsList, setTagsList] = useState(recipes["tags"]);

    const handleStepsRemove = (index) => {
        const list = [...stepsList];
        list.splice(index, 1);
        setStepsList(list);
    };

    const handleStepsAdd = () => {
        setStepsList([...stepsList, '']);
    };

    const handleTagsRemove = (index) => {
        const list = [...tagsList];
        list.splice(index, 1);
        setTagsList(list);
    };

    const handleTagsAdd = () => {
        setTagsList([...tagsList, '']);
    };


return(
        <Paper
            sx={{
                p: 2,
                margin: '63px 0px 0px 69px',
                maxWidth: 1000,
                flexGrow: 1,
                backgroundColor: (theme) =>
                    theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
            }}
        >

            <Grid container spacing={2} >
                <Grid item sx={{margin:'14px 0px 0px 0px'}} >
                    <UploadImage></UploadImage>
                </Grid>
                <Grid item xs={12} sm container>
                    <Grid item xs container direction="column" spacing={2}>
                        <Grid item xs>
                            &nbsp;
                            <Divider textAlign="left">Recipe</Divider>
                            <TextField fullWidth label="Name" margin="normal" value={recipes["name"]}/>
                            <TextField fullWidth label="Duration" margin="normal" value={recipes["duration"]}/>
                            <TextField fullWidth label="Summary" margin="normal" value={recipes["summary"]}/>
                            &nbsp;
                            <Divider textAlign="left">Tags</Divider>
                            {
                                tagsList.map((tag, index) => (

                                    <div key={index} className="services">
                                        <TextField fullWidth label={"Tag "+(index+1)} margin="normal" value={tag}/>
                                        {tagsList.length - 1 === index && tagsList.length < 15 && (

                                            <Fab sx={{margin:'0px 14px 0px 0px'}} size="small" color="primary" aria-label="add" onClick={handleTagsAdd}>
                                                <AddIcon />
                                            </Fab>
                                        )}
                                        {tagsList.length !== 1 && (
                                            <Fab size="small" color="primary" aria-label="add" onClick={() => handleTagsRemove(index)}>
                                                <RemoveIcon />
                                            </Fab>

                                        )}
                                    </div>
                                ))}
                            &nbsp;
                            <Divider textAlign="left">Steps</Divider>
                            {
                                stepsList.map((step, index) => (

                                    <div key={index} className="services">
                                        <TextField fullWidth label={"Step "+(index+1)} margin="normal" value={step}/>
                                        {stepsList.length - 1 === index && stepsList.length < 15 && (

                                            <Fab sx={{margin:'0px 14px 0px 0px'}} size="small" color="primary" aria-label="add" onClick={handleStepsAdd}>
                                                <AddIcon />
                                            </Fab>
                                        )}
                                        {stepsList.length !== 1 && (
                                            <Fab size="small" color="primary" aria-label="add" onClick={() => handleStepsRemove(index)}>
                                                <RemoveIcon />
                                            </Fab>

                                        )}
                                    </div>
                                ))}

                            <Grid item sx={{margin:'14px 0px 0px 687px'}}>
                                <Button variant="outlined" color="primary">
                                    Save
                                </Button>
                                <Button aria-label="delete" color="primary">
                                    <DeleteIcon />
                                </Button>
                            </Grid>
                        </Grid>

                    </Grid>

                </Grid>
            </Grid>

        </Paper>

    );
}