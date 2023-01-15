import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { CircularProgress } from '@material-ui/core';
import { fetchData, fetchRecipes, addToPlanner, editRecipe, validateField} from "./api";
import { Paper, CardMedia, Typography, Button, IconButton, Popover, TextField, Divider, FormControl, Fab } from "@mui/material";
import { useSelector } from "react-redux";
import styles from "./Recipes.module.css";
import SadFace from "@mui/icons-material/SentimentVeryDissatisfied";
import TimerOutlinedIcon from '@mui/icons-material/TimerOutlined';
import AddToRecipeBookModal from "../recipebooks/components/AddToRecipeBookModal";
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import Comments from "../../components/Comments/CommentsList";
import UploadImage from '../../components/UploadImage';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import EditIcon from "@mui/icons-material/Edit";
import CancelIcon from "@mui/icons-material/Cancel";

export default function Recipe() {
    const router = useRouter();
    const { recipe } = router.query;
    const { username } = useSelector((state) => state.token);

    const [edit, setEdit] = useState(false);
    const [data, setData] = useState(null);
    const [error, setError] = useState({});
    const [loading, setLoading] = useState(true);
    const [planned, setPlanned] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [plannerDate, setPlannerDate] = useState(new Date().toISOString().slice(0, 16));
    const OpenPopover = Boolean(anchorEl);

    const handlePopoverClose = () => {
        if (!isNaN(new Date(plannerDate).getTime()) && new Date(plannerDate) < Date.now()) alert("Please select a date in the future.");
        else addToPlanner(data._id, plannerDate).then(() => setPlanned(true));
        setAnchorEl(null);
    };

    useEffect(() => { // Fetch data upon page load
        if (!edit) fetchRecipes(`recipes/${recipe}`, setData, setLoading);
    }, [edit]);

    useEffect(() => {
        fetchData('events').then(res => res.data?.events?.some(ev => ev.recipe.id === data?._id) ? setPlanned(true) : setPlanned(false));
    }, [data]) 
    
    if (loading) return <div className={styles.recipeComponent} style={{ justifyContent: "center" }}><CircularProgress /></div>
    if (!data) return <div className={styles.recipeComponent} style={{ justifyContent: "center" }}><SadFace className={styles.notFoundError} /><b style={{ color: "grey" }}>No Data Found</b></div>

    /* VIEW MODE */
    if (!edit) {
        return (
            <div className={styles.recipeComponent}>
                <Paper className={styles.headerRecipeCard} elevation={6}>
                    <span style={{width: "40%", minHeight: "400px"}}><CardMedia height="100%" component="img" image={data.imageUrl} style={{borderRadius: "30px 0 0 30px"}}/></span>
                    <div style={{ position: "relative", display: "flex", width: "60%", flexDirection: "column", justifyContent: "space-evenly", alignItems: "center", padding: "30px 60px"}}>
                        <div> { /* Title, author and duration*/}
                            <Typography variant='h5' style={{fontWeight: 600}}>{data.name}</Typography>
                            <span style={{display: "inline-flex", justifyContent: "space-evenly", width: "100%"}}>
                                <Typography variant='body1'>by <b>{data.createdBy}</b></Typography>
                                <span style={{display: "inline-flex", alignItems: "center"}}><TimerOutlinedIcon/> {data.duration}hr</span>
                            </span>
                        </div>
                        { /* Labels */}
                        <span style={{display: "inline-flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: "20px"}}>
                            { data.tags?.filter(tag => tag.length > 0).map((tag, index) => <Button className={styles.recipeLabel} key={index} disabled variant='outlined' size='large'>{tag}</Button>)}
                        </span>
                        { /* Description */}
                        <Typography variant='body1' style={{textAlign: "center"}}>{data.summary}</Typography>
                        { /* Button Group */}
                        <span style={{display: "inline-flex", justifyContent: "center", alignItems: "center", width: "100%", gap: "10px"}}>
                            <AddToRecipeBookModal recipe={data._id}/>
                            { planned ? 
                            <EventAvailableIcon fontSize='large' sx={{color: "#772318"}}/> : 
                            <span>
                            <IconButton onClick={(ev) => setAnchorEl(ev.currentTarget)} size='large'><CalendarTodayOutlinedIcon fontSize='large' sx={{color: "#772318"}}/></IconButton>
                            <Popover open={OpenPopover} anchorEl={anchorEl} onClose={() => {handlePopoverClose(null)}} anchorOrigin={{vertical: 'top', horizontal: 'center'}} transformOrigin={{vertical: 'bottom', horizontal: 'center'}}>
                            <TextField type="datetime-local" value={plannerDate} onChange={(ev) => setPlannerDate(ev.target.value)}/> 
                            </Popover>
                            </span> }
                        </span>
                        { /* Edit Button */}
                        {
                            username === data.createdBy ?
                            <IconButton onClick={() => setEdit(true)} style={{position: "absolute", top: "10px", right: "10px"}} size="large"><ModeEditOutlineOutlinedIcon fontSize="large"/></IconButton>
                            : null
                        }
                    </div>
                </Paper>

                <span style={{display: "inline-flex", width: "100%", gap: "30px", margin: "30px 0px", minHeight: "400px", maxHeight: "700px"}}>
                    <Paper className={styles.headerRecipeCard} elevation={6} style={{position: "relative", width: "50%", flexDirection: "column", overflowY: "auto", padding: "20px"}}>
                        <span style={{width: "100%", padding: "10px", position: "sticky", top: "-20px", backgroundColor: "white"}}><Typography variant='h5' style={{fontWeight: 600, width: "100%", textAlign: "center"}}>Ingredients</Typography></span>
                        <ul>
                            <li>???</li>
                        </ul>
                    </Paper>
                    <Paper className={styles.headerRecipeCard} elevation={6} style={{position: "relative", width: "50%", flexDirection: "column", overflowY: "auto", padding: "20px"}}>
                        <span style={{width: "100%", padding: "10px", position: "sticky", top: "-20px", backgroundColor: "white"}}><Typography variant='h5' style={{fontWeight: 600, width: "100%", textAlign: "center"}}>Steps</Typography></span>
                        {   data.steps?.filter(step => step !== "No hay instrucciones").length > 0 ? 
                            <ol>
                                {data.steps.filter(step => step !== "No hay instrucciones").map(step => (
                                    <span>
                                    <li><p style={{paddingLeft: "5px"}}>{step}</p></li>
                                    <Divider/>
                                    </span>
                                ))}
                            </ol> :
                            <Typography variant='h6' style={{textAlign: "center"}}>No steps available</Typography>
                        }
                    </Paper>
                </span>
                
                { /* Comments */}
                <Comments idRecipe={data._id} username={username}/>
            </div>
        )
    }

    /* EDIT MODE */
    else {
        return (           
            <div style={{padding: "30px 50px"}}>
                <FormControl fullWidth style={{display: "flex", flexDirection: "column", gap: "30px"}}>
                    <Paper elevation={6} style={{padding: "20px", display: "inline-flex", gap: "30px", justifyContent: "center", borderRadius: "30px"}}>
                        <UploadImage data={data} setData={setData} d={200}/>
                        <span style={{width: "100%", style: "flex", flexDirection: "column"}}>
                        <TextField fullWidth label="Name" margin="normal" value={data.name} onChange={(e) => validateField(setData,setError, e.target.value, "name") } helperText={error.name} error={error.name?.length > 0}/>
                        <TextField fullWidth label="Duration" margin="normal" value={data.duration} onChange={(e) => validateField(setData,setError, e.target.value, "duration") } helperText={error.duration} error={error.duration?.length > 0}/>
                        <TextField fullWidth label="Summary" margin="normal" value={data.summary} onChange={(e) => validateField(setData,setError, e.target.value, "summary") } helperText={error.summary} error={error.summary?.length > 0}/>
                        </span>
                    </Paper>

                    { /* Tags */}
                    <Paper elevation={6} style={{padding: "20px", display: "inline-flex", flexDirection: "column", gap: "30px", justifyContent: "center", borderRadius: "30px"}}>
                        { data.tags?.map((tag, index, arr) => (
                            <span key={index} style={{width: "100%", display: "inline-flex", alignItems: "center", gap: "10px"}}>
                                <TextField fullWidth label={"Tag "+(index+1)} margin="normal" value={tag} onChange={(evnt) => {arr[index] = evnt.target.value; setData({...data, tags: arr})}}/>
                                {data.tags?.length !== 1 && (<Fab size="medium" color="primary" aria-label="add" onClick={() => {arr.splice(index, 1); setData({...data, tags: arr})}}><RemoveIcon /></Fab>)}
                                {data.tags?.length - 1 === index && data.tags?.length < 15 && (<Fab sx={{margin:'0px 14px 0px 0px'}} size="medium" color="primary" aria-label="add" onClick={() => {arr.push(""); setData({...data, tags: arr})}}><AddIcon /></Fab>)}
                            </span>
                        ))}
                    </Paper>

                    {/* Steps */}
                    <Paper elevation={6} style={{padding: "20px", display: "inline-flex", flexDirection: "column", gap: "30px", justifyContent: "center", borderRadius: "30px"}}>
                        { data.steps?.map((step, index, arr) => (
                            <span key={index} style={{width: "100%", display: "inline-flex", alignItems: "center", gap: "10px"}}>
                            <TextField fullWidth label={"Step "+(index+1)} margin="normal" value={step} onChange={(evnt) => {arr[index] = evnt.target.value; setData({...data, steps: arr})}}/>
                            {data.steps?.length !== 1 && (<Fab size="medium" color="primary" aria-label="add" onClick={() => {arr.splice(index, 1); setData({...data, steps: arr})}}><RemoveIcon /></Fab>)}
                            {data.steps?.length - 1 === index && data.steps?.length < 15 && (<Fab sx={{margin:'0px 14px 0px 0px'}} size="medium" color="primary" aria-label="add" onClick={() => {arr.push(""); setData({...data, steps: arr})}}><AddIcon /></Fab>)}
                        </span>
                        ))}
                    </Paper>
                </FormControl>
                
                <Button className={styles.confirmButton} onClick={() => editRecipe(data._id, data).then(() => setEdit(false))} ><EditIcon className={styles.buttonIcon} /> Edit </Button>
                <Button className={styles.cancelButton} onClick={() => setEdit(false)}> <CancelIcon className={styles.buttonIcon} /> Cancel </Button>
            </div>
        )
    }
}