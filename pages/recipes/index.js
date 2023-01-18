import { CircularProgress, Button, Link, Modal, Paper, Typography, Divider, TextField, Autocomplete, Checkbox, IconButton, Avatar } from "@mui/material";
import { useSelector } from "react-redux";
import { fetchData, fetchRecommendedRecipes, postRecipe, validateField } from "../../api/recipeApi";
import { fetchIngredientsData } from "../../api/ingredientsApi";
import { useState, useEffect } from "react";
import styles from "./Recipes.module.css";
import SadFace from "@mui/icons-material/SentimentVeryDissatisfied";
import RecipeCard from "../recipebooks/components/RecipeCard";
import UploadImage from "../../components/UploadImage";
import AddIcon from '@mui/icons-material/Add';
import IngredientsList from "../../components/IngredientsList";

export default function Recipes() {
    const {username, plan} = useSelector((state) => state.token);
    const [loading, setLoading] = useState(true);
    
    const [recipes, setRecipes] = useState(null);
    const [ingredients, setIngredients] = useState([]); // Array of ingredients
    
    const [postModal, setPostModal] = useState(false);
    const [postIngModal, setPostIngModal] = useState(false);

    const [postData, setPostData] = useState({}); // Object to store data from the form
    const [error, setError] = useState({});
    const [checked, setChecked] = useState([]);

    const handleCheckIngredient = (value) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    useEffect(() => {
        fetchRecommendedRecipes(username, plan, setRecipes, setLoading)
        fetchIngredientsData(100, "", setIngredients)
    }, []);

    if (loading) return (<div style={{height: "100vh", width: "100%", display: "flex", alignItems: "center", justifyContent: "center"}}><CircularProgress/></div>)
    if (recipes?.length === 0) return (<div style={{height: "100vh", width: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}><SadFace className={styles.notFoundError}/><b style={{ color: "grey" }}>No Data Found</b></div>);
    else return (
        <><div>
            <Button className={styles.addButton} size='large' variant="contained" onClick={() => setPostModal(true)}>Publish Recipe!</Button>
            <div className={styles.recipeContainer} style={{ justifyContent: recipes.length > 2 ? "space-evenly" : "flex-start" }}>
                {recipes.map((item, index) => (
                <Link key={index} href={`/recipes/${item._id}`}>
                    <RecipeCard img={item.imageUrl} name={item.name} summary={item.summary} style={{margin: "0px", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between"}}></RecipeCard>
                </Link>
                ))}
            </div>
        </div>
                
        <Modal open={postModal} onClose={() => setPostModal(false)}>
            <Paper elevation={6} className={styles.postFormPaper}>
                <Typography variant="h4" style={{marginBottom: "10px", textAlign: "center", width: "100%", fontWeight: "800", color: "gray"}}>Publish Recipe</Typography>
                <Divider />
                <span style={{display: "inline-flex", padding: "10px 0"}}>
                    <UploadImage data={postData} setData={setPostData} d={180}/>
                    <span style={{width: "100%", display: "flex", flexDirection: "column", padding: "10px 30px", justifyContent: "space-between"}}>
                    <TextField fullWidth value={postData.name ?? ""} onChange={(ev) => validateField(setPostData, setError, ev.target.value, "name") } error={error.name?.length > 0 ? true : false} helperText={error.name} size="small" label="Name" variant="outlined"/>
                    <TextField fullWidth value={postData.summary ?? ""} onChange={(ev) => validateField(setPostData, setError, ev.target.value, "summary") } error={error.summary?.length > 0 ? true : false} helperText={error.summary} size="small" label="Summary" variant="outlined"/>
                    <TextField fullWidth type={"number"} value={postData.duration ?? 0} onChange={(ev) => validateField(setPostData, setError, ev.target.value, "duration") } error={error.duration?.length > 0 ? true : false} helperText={error.duration} size="small" label="Duration" variant="outlined"/>
                    </span>
                </span>
                <Divider/>
                <span style={{display: "inline-flex", flexDirection: "column", gap: "30px", padding: "20px 0"}}>
                    <Autocomplete freeSolo fullWidth multiple options={recipes.flatMap((r) => r.tags)}
                        onChange={(ev, value) => setPostData((prev) => ({...prev, tags: value}))} value={postData.tags ?? []}
                        renderInput={(params) => <TextField {...params} size="small" label="Tags" variant="outlined" placeholder="Add tags"/>}
                    />

                    <span style={{display: "inline-flex", width: "100%"}}>
                    <Autocomplete disableCloseOnSelect fullWidth multiple options={ingredients}
                        freeSolo
                        onChange={(ev, value) => {
                            if (Array.isArray(value) && value.every(v => typeof v === "object")) setPostData((prev) => ({...prev, ingredients: value}));
                            else fetchData(`ingredients?search=${ev.target.value}`).then(res => setIngredients(res.data?.result));
                        }}
                        value={postData.ingredients ?? []}
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
                        onChange={(ev, value) => setPostData((prev) => ({...prev, steps: value})) }
                        value={postData.steps ?? []}
                        filterOptions={(x) => x}
                        renderInput={(params) => <TextField {...params} size="small" label="Steps" variant="outlined" placeholder="Add steps"/>}
                    />
                </span>
                <Divider/>
                <span style={{display: "inline-flex", width: "100%", justifyContent: "space-around", padding: "20px"}}>
                    <Button onClick={() => setPostModal(false)} style={{marginRight: "10px", backgroundColor: "gray"}} variant="contained">Cancel</Button>
                    <Button onClick={() => postRecipe(postData, username, setError)?.then(() => fetchRecommendedRecipes(username, plan, setRecipes, setLoading)).catch(() => alert("Unexpected error, try again later")).finally(() => setPostModal(false))} style={{marginRight: "10px", backgroundColor: "#772318"}} variant="contained">Publish</Button>
                </span>
                
                <Modal open={postIngModal} onClose={() => setPostIngModal(false)}>
                    <Paper elevation={6} className={styles.postFormPaper}>
                        <IngredientsList />
                    </Paper>
                </Modal>
            </Paper>
        </Modal></>
    )
}