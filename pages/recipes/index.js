import * as React from 'react';
import { useRouter } from 'next/router';
import Grid from "@mui/material/Grid";
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';
import Fab from '@mui/material/Fab';
import { experimentalStyled as styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import {
    getRecipes,
    deleteRecipe,
    getRecommendations,
    postRecipe,
} from "./api";
import { CardActionArea } from '@mui/material';
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import styles from "./Recipes.module.css";
import UploadImage from '../../components/UploadImage';
import { useMemo } from "react";
import { useSelector } from "react-redux";
import CheckIcon from "@mui/icons-material/Check";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import DeleteIcon from "@mui/icons-material/Delete";
import CancelIcon from "@mui/icons-material/Cancel";
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import Tooltip from "@mui/material/Tooltip";
import Alert from "@mui/material/Alert";


const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
}));
export default function Recipes() {
    const router = useRouter();
    const [recommendedRecipes, setRecommendedRecipes] = useState({});

    const [statusMessage, setStatusMessage] = useState();
    const [modalDeleteRecipe, setModalDeleteRecipe] = useState(false);
    const [modalPostRecipe, setModalPostRecipe] = useState(false);
    const [selectedIdRecipe, setSelectedIdRecipe] = useState("");
    const [selectedRecipe, setSelectedRecipe] = useState("");
    const [recipeToPost, setRecipeToPost] = useState("");
    const [selectedEditRecipe, setSelectedEditRecipe] = useState("");
    const [recommendedIds, setRecommendedIds] = useState("");

    const [error, setError] = useState({ date: "" });

    const [stepsList, setStepsList] = useState([""]);
    const [tagsList, setTagsList] = useState([""]);

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

    const handleChangeTags = (index, evnt)=>{    
        const { name, value } = evnt.target;
        const list = [...tagsList];
        list[index] = value;
        setTagsList(list);      
    }

    const handleChangeSteps = (index, evnt)=>{    
        const { name, value } = evnt.target;
        const list = [...stepsList];
        list[index] = value;
        setStepsList(list);      
    }

    const tokenUsername = useSelector((state) => state.token?.username);
    const tokenPlan = useSelector((state) => state.token?.plan);

    useEffect(() => {
        getRecommendedRecipes();

    }, []);

    const setField = (setData, data, field) => {
        setData((prev) => ({...prev, [field]: data}));
    }

    const getRecommendedRecipes = useMemo(() => {
        return () => {           
                getRecommendations(tokenUsername,tokenPlan).then((response) => {
                    setRecommendedIds(response.data)
                    getRecipes().then((res) => {
                       setRecommendedRecipes(Array.from(res.data)
                       .filter(student => response.data.includes(student._id)))});
                });
        };
    }, []);


    const postThisRecipe = () => {
        recipeToPost.steps = stepsList
        recipeToPost.tags = tagsList 
        recipeToPost.duration = parseInt(recipeToPost.duration)
        console.log(recipeToPost)
        postRecipe(recipeToPost)
            .then((response) => {
                showOperationStatus(response.status);
                getRecommendedRecipes();
                
            })
            .catch((error) => {
                if (error.response?.status === 400) {
                    setError({ date: error.response.data["message"] });
                    return;
                }
            });
        setModalPostRecipe(false);
        setTagsList([""]);
        setStepsList([""]);
        setRecipeToPost("");
    };

    const openPostModal = () => {
        setModalPostRecipe(true);
    };

    const openDeleteModal = (recipeId) => {
        setModalDeleteRecipe(true);
        setSelectedIdRecipe(recipeId);
    };
    
    const deleteCurrentRecipe = () => {
        deleteRecipe(selectedIdRecipe).then((response) => {
            showOperationStatus(response.status);
            getRecommendedRecipes();
        });
        setModalDeleteRecipe(false);
        setSelectedIdRecipe("");
    };

    const showOperationStatus = (status) => {
        const icon =
            status === 200 || status === 204 || status === 201 ? (
                <CheckIcon className={styles.icon} />
            ) : (
                <PriorityHighIcon className={styles.icon} />
            );
        const children =
            status === 200 || status === 204 || status === 201
                ? "Operation completed successfully"
                : "Operation failed";
        setStatusMessage(
            <Alert
                onClose={() => {
                    setStatusMessage();
                }}
                className={styles.alert}
                icon={icon}
                children={children}
            />
        );
    };

    const validateField = (setData, setError, data, field) => {
        switch (field) {
            case "name":
                if (data.length === 0) setError((prev) => ({...prev, [field]: "Cannot be empty"}));
                else setError((prev) => ({...prev, [field]: ""}));
                break;
            case "duration":
                if (data.length === 0) setError((prev) => ({...prev, [field]: "Cannot be empty"}));
                if (parseInt(data) < 0) setError((prev) => ({...prev, [field]: "Duration must be greater than zero"}));
                else setError((prev) => ({...prev, [field]: ""}));
                break;
            case "summary":
                if (data.length === 0) setError((prev) => ({...prev, [field]: "Cannot be empty"}));
                else setError((prev) => ({...prev, [field]: ""}));
                break;
    
        }
        setField(setData, data, field);
    };

    return (
        <>
            <Grid container padding={"20px"} spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                {Array.from(recommendedRecipes).map((recipe, index) => (
                    <Grid item xs={2} sm={4} md={4} key={index}>
                        <Item className={styles.item}>
                            <div className={styles.card}>
                                <CardActionArea onClick={() => router.push(`/recipes/${recipe._id}`)}>
                                    <CardMedia
                                        component="img"
                                        alt=""
                                        height="200"
                                        image={recipe.imageUrl}
                                    />
                                </CardActionArea>

                            </div>

                            <Tooltip title="Add a Recipe" arrow placement="top">
                      <Button
                        onClick={() => openPostModal()}
                        className={styles.actionButton}
                      >
                        <AddIcon />
                      </Button>
                    </Tooltip>
   
                    {recipe.createdBy==tokenUsername ? ("") :
                      <Tooltip title="Delete this recipe" arrow placement="top">
                      <Button
                        onClick={() => openDeleteModal(recipe._id)}
                        className={styles.actionButton}
                      >
                        <DeleteIcon />
                      </Button>
                    </Tooltip>
                    }
                                        
                            <h2>{recipe.name}</h2>

                        </Item>
                    </Grid>
                ))}
            </Grid>
            {statusMessage}
            
            { /* DELETE MODAL */}
            <Modal open={modalDeleteRecipe} onClose={() => setModalDeleteRecipe(false)}>
                <Box bgcolor={"white"} className={styles.modalDelete}>
                    <div>
                        <div className={styles.modalHeader}>
                            <div style={{ width: "100%" }}>
                                <img src="/small-logo.png" alt="logo" className={styles.logo} />
                                <Typography gutterBottom variant="body" component="div">
                                Are you sure you want to delete this event?
                            </Typography>
                            </div>
                        </div>
                        <Button
                            className={styles.confirmButton}
                            onClick={() => deleteCurrentRecipe()}
                        >
                            <DeleteIcon className={styles.buttonIcon} /> Delete
                        </Button>
                        <Button
                            className={styles.cancelButton}
                            onClick={() => setModalDeleteRecipe(false)}
                        >
                            <CancelIcon className={styles.buttonIcon} /> Cancel
                        </Button>
                    </div>
                </Box>
            </Modal>
            
            { /* POST MODAL */}
            {(!modalPostRecipe) ? ("") : 
            <Modal open={modalPostRecipe} onClose={() => setModalPostRecipe(false)}>
                <Box bgcolor={"white"} className={styles.modal}>
                    <div>
                        <div className={styles.modalHeader}>
                            <div style={{ width: "100%" }}>
                                <img src="/small-logo.png" alt="logo" className={styles.logo} />
                                <FormControl fullWidth>
                                <UploadImage data={selectedEditRecipe} setData={setRecipeToPost} d={200}/>

                                    <Divider textAlign="left">Recipe</Divider>

                                    <TextField fullWidth label="Name" margin="normal" onChange={(e) =>
                    validateField(setRecipeToPost,setError, e.target.value, "name")
                  }/>
                                    <TextField fullWidth label="Duration" margin="normal" onChange={(e) =>
                    validateField(setRecipeToPost,setError, e.target.value, "duration")
                  }/>
                                    <TextField fullWidth label="Summary" margin="normal" onChange={(e) =>
                    validateField(setRecipeToPost,setError, e.target.value, "summary")
                  }/>
                                    &nbsp;
                            <Divider textAlign="left">Tags</Divider>
                            {
                                tagsList.map((tag, index) => (

                                    <div key={index} className="services">
                                        <TextField fullWidth label={"Tag "+(index+1)} margin="normal" onChange={(evnt)=>handleChangeTags(index, evnt)}/>
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
                                        <TextField fullWidth label={"Step "+(index+1)} margin="normal" onChange={(evnt)=>handleChangeSteps(index, evnt)
                  }/>
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

                                </FormControl>
                            </div>
                        </div>
                        <Button
                            className={styles.confirmButton}
                            onClick={() => postThisRecipe()}
                        >
                            <AddIcon className={styles.buttonIcon} />
                            Save
                        </Button>
                        <Button
                            className={styles.cancelButton}
                            onClick={() => setModalPostRecipe(false)}
                        >
                            <CancelIcon className={styles.buttonIcon} /> Cancel
                        </Button>
                    </div>
                </Box>
            </Modal>
            }           
        </>
    );
}