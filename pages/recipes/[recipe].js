import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { CircularProgress } from '@material-ui/core';
import { fetchRecipes, fetchRecommendedRecipes, addToPlanner, editRecipe, validateField } from "../../api/recipeApi";
import { Paper, CardMedia, Typography, Button, IconButton, TextField, Divider, FormControl, Avatar, Autocomplete } from "@mui/material";
import { fetchIngredientsData } from "../../api/ingredientsApi";
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
import CancelIcon from "@mui/icons-material/Cancel";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import IngredientsList from "../../components/IngredientsList";

export default function Recipe() {
    const router = useRouter();
    const { recipe } = router.query;
    const { username, plan } = useSelector((state) => state.token);

    const [edit, setEdit] = useState(false);
    const [data, setData] = useState(null);
    const [error, setError] = useState({});
    const [loading, setLoading] = useState(true);
    const [openCalendarModal, setOpenCalendarModal] = useState(false);
    const [recipeDate, setRecipeDate] = useState("");
    const [recipeHour, setRecipeHour] = useState("");
    const [recipes, setRecipes] = useState(null);
    const [ingredients, setIngredients] = useState([]);
    const [postIngModal, setPostIngModal] = useState(false);

    useEffect(() => { // Fetch data upon page load
        if (!edit) fetchRecipes(`recipes/${recipe}`, setData, setLoading);
    }, [edit]);

    useEffect(() => {
        fetchRecommendedRecipes(username, plan, setRecipes, setLoading)
        fetchIngredientsData(100, "", setIngredients)
    }, []);

    const addCurrentEventToPlaner = () => {
        let timestamp = new Date(recipeDate).getTime() / 1000;
        if (recipeHour === "Breakfast") {
            timestamp += 8 * 60 * 60;
        } else if (recipeHour === "Lunch") {
            timestamp += 13 * 60 * 60;
        } else if (recipeHour === "Dinner") {
            timestamp += 20 * 60 * 60;
        }

        addToPlanner(data._id, timestamp)
        .then(() => {
            setOpenCalendarModal(false);
            setRecipeDate("");
            setRecipeHour("");
            setError({ date: "" });
        })
        .catch((error) => {
            if (error.response.status === 400) {
                setError({ date: error.response.data["message"] });
                return;
            } else if (error.response.status === 500) {
                window.alert(error.response.data["message"]);
                return;
            }
        });  
    }

    const validatePlannerField = (setError, data, field) => {
        let today = new Date().toLocaleDateString("en-CA", { year: "numeric", month: "2-digit", day: "2-digit", });
        if (data < today) {
          setError((prev) => ({...prev, [field]: "Date must be greater than today", }));
        } else if (isNaN(new Date(data).getTime())) {
          setError((prev) => ({...prev, [field]: "Invalid date format",}));
        } else {
          setError((prev) => ({...prev, [field]: "",}));
        }
        setRecipeDate(data);
    };



    if (loading) return <div className={styles.recipeComponent} style={{ justifyContent: "center" }}><CircularProgress /></div>
    if (!data) return <div className={styles.recipeComponent} style={{ justifyContent: "center" }}><SadFace className={styles.notFoundError} /><b style={{ color: "grey" }}>No Data Found</b></div>

    /* VIEW MODE */
    if (!edit) {
        return (
            <div className={styles.recipeComponent}>
                <Paper className={styles.headerRecipeCard} elevation={6}>
                    <span style={{ width: "40%", minHeight: "400px" }}><CardMedia height="100%" component="img" image={data.imageUrl ?? "/small-logo.png"} style={{ borderRadius: "30px 0 0 30px" }} /></span>
                    <div style={{ position: "relative", display: "flex", width: "60%", flexDirection: "column", justifyContent: "space-evenly", alignItems: "center", padding: "30px 60px" }}>
                        <div> { /* Title, author and duration*/}
                            <Typography variant='h5' style={{ fontWeight: 600 }}>{data.name}</Typography>
                            <span style={{ display: "inline-flex", justifyContent: "space-evenly", width: "100%" }}>
                                <Typography variant='body1'>by <b>{data.createdBy}</b></Typography>
                                <span style={{ display: "inline-flex", alignItems: "center" }}><TimerOutlinedIcon /> {data.duration}hr</span>
                            </span>
                        </div>
                        { /* Labels */}
                        <span style={{ display: "inline-flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: "20px" }}>
                            {data.tags?.filter(tag => tag.length > 0).map((tag, index) => <Button className={styles.recipeLabel} key={index} disabled variant='outlined' size='large'>{tag}</Button>)}
                        </span>
                        { /* Description */}
                        <Typography variant='body1' style={{ textAlign: "center" }}>{data.summary}</Typography>
                        { /* Button Group */}
                        <span style={{ display: "inline-flex", justifyContent: "center", alignItems: "center", width: "100%", gap: "10px" }}>
                            <AddToRecipeBookModal recipe={data._id} />
                            <IconButton onClick={() => setOpenCalendarModal(true)} size='large'><CalendarTodayOutlinedIcon fontSize='large' sx={{ color: "#772318" }} /></IconButton>
                        </span>
                        { /* Edit Button */}
                        {
                        data.createdBy === username ?
                            <IconButton onClick={() => setEdit(true)} style={{ position: "absolute", top: "10px", right: "10px" }} size="large"><ModeEditOutlineOutlinedIcon fontSize="large" /></IconButton>
                            : null
                        }
                    </div>
                </Paper>

                <span style={{ display: "inline-flex", width: "100%", gap: "30px", margin: "30px 0px", minHeight: "400px", maxHeight: "700px" }}>
                    <Paper className={styles.headerRecipeCard} elevation={6} style={{ position: "relative", width: "50%", flexDirection: "column", overflowY: "auto", padding: "20px" }}>
                        <span style={{ width: "100%", padding: "10px", position: "sticky", top: "-20px", backgroundColor: "white" }}><Typography variant='h5' style={{ fontWeight: 600, width: "100%", textAlign: "center" }}>Ingredients</Typography></span>
                        <div style={{padding: "20px"}}>
                            {data.ingredients?.filter(ingredient => ingredient !== "No hay ingredientes").map(ingredient => (
                                <span>
                                    <a href={ingredient.url}>
                                        <span style={{display: "inline-flex", width: "100%", alignItems: "center", gap: "10px", padding: "10px 0px"}}><Avatar src={ingredient.imagen_peq} style={{marginRight: "10px"}}/>{ingredient.nombre}</span>
                                        <Divider />
                                    </a>
                                </span>
                            ))}
                        </div>
                    </Paper>
                    <Paper className={styles.headerRecipeCard} elevation={6} style={{ position: "relative", width: "50%", flexDirection: "column", overflowY: "auto", padding: "20px" }}>
                        <span style={{ width: "100%", padding: "10px", position: "sticky", top: "-20px", backgroundColor: "white" }}><Typography variant='h5' style={{ fontWeight: 600, width: "100%", textAlign: "center" }}>Steps</Typography></span>
                        {data.steps?.filter(step => step !== "No hay instrucciones").length > 0 ?
                            <ol>
                                {data.steps.filter(step => step !== "No hay instrucciones").map(step => (
                                    <span>
                                        <li><p style={{ paddingLeft: "5px" }}>{step}</p></li>
                                        <Divider />
                                    </span>
                                ))}
                            </ol> :
                            <Typography variant='h6' style={{ textAlign: "center" }}>No steps available</Typography>
                        }
                    </Paper>
                </span>

                { /* Comments */}
                <Comments idRecipe={data._id} username={username} />

                { /* Adds to planner */}
                <Modal open={openCalendarModal} onClose={() => setOpenCalendarModal(false)}>
                    <Box bgcolor={"white"} className={styles.calendarModal}>
                        <div>
                            <div className={styles.calendarModalHeader}>
                                <div style={{ width: "100%" }}>
                                    <img src="/small-logo.png" alt="logo" className={styles.logo} />
                                    <p style={{ color: "black" }}> When do you want to cook this recipe? </p>
                                    <TextField
                                        size="small"
                                        label="Date"
                                        variant="outlined"
                                        type={"date"}
                                        InputLabelProps={{ shrink: true }}
                                        className={styles.input}
                                        value={recipeDate}
                                        onChange={(e) => validatePlannerField(setError, e.target.value, "date")}
                                        error={error.date?.length > 0 ? true : false}
                                        helperText={error.date}
                                    />
                                    <p style={{ color: "black" }}>What time?</p>
                                    <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label">Time</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            label="Time"
                                            value={recipeHour}
                                            onChange={(e) => setRecipeHour(e.target.value)}
                                        >
                                            <MenuItem value={"Breakfast"}>Breakfast</MenuItem>
                                            <MenuItem value={"Lunch"}>Lunch</MenuItem>
                                            <MenuItem value={"Dinner"}>Dinner</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>
                            </div>
                            <Button className={styles.confirmButton} disabled={error.date?.length > 0 ? true : false} onClick={() => addCurrentEventToPlaner()}>
                                <EventAvailableIcon className={styles.buttonIcon} /> Add to planner
                            </Button>
                            <Button className={styles.cancelButton} onClick={() => setOpenCalendarModal(false)}>
                                <CancelIcon className={styles.buttonIcon} /> Cancel
                            </Button>
                        </div>
                    </Box>
                </Modal>
            </div>
        )
    }

    /* EDIT MODE */
    else {
        return (
            <Paper elevation={6} className={styles.postFormPaper}>
                <Typography variant="h4" style={{marginBottom: "10px", textAlign: "center", width: "100%", fontWeight: "800", color: "gray"}}>Edit Recipe</Typography>
                <Divider />
                <span style={{display: "inline-flex", padding: "10px 0"}}>
                    <UploadImage data={data} setData={setData} d={180}/>
                    <span style={{width: "100%", display: "flex", flexDirection: "column", padding: "10px 30px", justifyContent: "space-between"}}>
                    <TextField fullWidth value={data.name ?? ""} onChange={(ev) => validateField(setData, setError, ev.target.value, "name") } error={error.name?.length > 0 ? true : false} helperText={error.name} size="small" label="Name" variant="outlined"/>
                    <TextField fullWidth value={data.summary ?? ""} onChange={(ev) => validateField(setData, setError, ev.target.value, "summary") } error={error.summary?.length > 0 ? true : false} helperText={error.summary} size="small" label="Summary" variant="outlined"/>
                    <TextField fullWidth type={"number"} value={data.duration ?? 0} onChange={(ev) => validateField(setData, setError, ev.target.value, "duration") } error={error.duration?.length > 0 ? true : false} helperText={error.duration} size="small" label="Duration" variant="outlined"/>
                    </span>
                </span>
                <Divider/>
                <span style={{display: "inline-flex", flexDirection: "column", gap: "30px", padding: "20px 0"}}>
                    <Autocomplete freeSolo fullWidth multiple options={recipes.flatMap((r) => r.tags)}
                        onChange={(ev, value) => setData((prev) => ({...prev, tags: value}))} value={data.tags ?? []}
                        renderInput={(params) => <TextField {...params} size="small" label="Tags" variant="outlined" placeholder="Add tags"/>}
                    />

                    <span style={{display: "inline-flex", width: "100%"}}>
                    <Autocomplete disableCloseOnSelect fullWidth multiple options={ingredients}
                        freeSolo
                        onChange={(ev, value) => {
                            if (Array.isArray(value) && value.every(v => typeof v === "object")) setData((prev) => ({...prev, ingredients: value}));
                            else fetchData(`ingredients?search=${ev.target.value}`).then(res => setIngredients(res.data?.result));
                        }}
                        value={data.ingredients ?? []}
                        filterOptions={(x) => x}
                        renderInput={(params) => <TextField {...params} size="small" label="Ingredients" variant="outlined" placeholder="Add ingredients"/>}
                        renderOption={(props, option, { selected }) => 
                            <li {...props}><Checkbox style={{ marginRight: 8 }} checked={selected} /><Avatar src={option.imagen_peq} style={{marginRight: "10px"}}/>{option.nombre}</li>
                        }
                        getOptionLabel={(option) => typeof option === "string" ? option : option.nombre}
                    />
                    <IconButton onClick={() => setPostIngModal(true)}><AddIcon/></IconButton>
                    </span>

                    <Autocomplete disableCloseOnSelect fullWidth multiple options={[]}
                        freeSolo
                        onChange={(ev, value) => setData((prev) => ({...prev, steps: value})) }
                        value={data.steps ?? []}
                        filterOptions={(x) => x}
                        renderInput={(params) => <TextField {...params} size="small" label="Steps" variant="outlined" placeholder="Add steps"/>}
                    />
                </span>
                <Divider/>
                <span style={{display: "inline-flex", width: "100%", justifyContent: "space-around", padding: "20px"}}>
                    <Button onClick={() => setEdit(false)} style={{marginRight: "10px", backgroundColor: "gray"}} variant="contained">Cancel</Button>
                    <Button onClick={() => editRecipe(data._id, data).then(() => setEdit(false))} style={{marginRight: "10px", backgroundColor: "#772318"}} variant="contained">Edit</Button>
                </span>
                
                <Modal open={postIngModal} onClose={() => setPostIngModal(false)}>
                    <Paper elevation={6} className={styles.postFormPaper}>
                        <IngredientsList />
                    </Paper>
                </Modal>
            </Paper>
        )
    }
}