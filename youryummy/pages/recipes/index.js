import ButtonBase from '@mui/material/ButtonBase';
import EditIcon from '@mui/icons-material/Edit';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState, useEffect } from "react";
import RecipesCard from "../../components/RecipesCard/RecipesCard";
import RecipesForm from "../../components/RecipesForm/RecipesForm";
import {recipes} from "./utils/recipes";

export default function Recipe() {
    const [ edit, setEdit ] = useState(false);

    if(!edit) return(
        <>
                <ButtonBase x={{ width: 28, height: 28}} onClick={() => setEdit(true)}>
                    <EditIcon fontSize="inherit" sx={{ fontSize: 25 }}/>
                </ButtonBase>
            <RecipesCard data={recipes}/> </>);
    else return(<><RecipesForm data={recipes}/>
        <Grid item sx={{margin:'14px 0px 0px 687px'}}>
        <Button onClick={() => setEdit(false)} variant="outlined" color="primary">
            Go Back
        </Button>
    </Grid>
    </>);

}
