import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { visuallyHidden } from '@mui/utils';
import { Button, Dialog, DialogContent, DialogTitle, TextField } from '@material-ui/core';
import axios from 'axios';
import { experimentalStyled as styled } from "@mui/material/styles";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8080";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: 'nombre',
    numeric: false,
    disablePadding: true,
    label: 'Name',
  },
  {
    id: 'creado_por',
    numeric: false,
    disablePadding: false,
    label: 'Created by',
  },
  {
    id: 'marca',
    numeric: false,
    disablePadding: false,
    label: 'Brand',
  },
  {
    id: 'imagen',
    numeric: false,
    disablePadding: false,
    label: 'Image',
  },
  {
    id: 'url',
    numeric: false,
    disablePadding: false,
    label: 'URL',
  },
  {
    id: 'acciones',
    numeric: false,
    disablePadding: false,
    label: 'Actions',
  },
];

function EnhancedTableHead(props) {
  const { order, orderBy, rowCount, onRequestSort } =
    props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function EditIngredientDialog({ open, onClose, ingredient, saveIngredient, setIngredientBeingEdited}) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit ingredient</DialogTitle>
      <DialogContent>
        <TextField
          style={{ width: "100%", marginBottom: "10px" }}
          fullWidth={true}
          label="Name"
          value={ingredient.nombre}
          onChange={event => setIngredientBeingEdited({ ...ingredient, nombre: event.target.value })}
        />
        <TextField
          style={{ width: "45%", marginBottom: "10px"}}
          label="Created by"
          value={ingredient.creado_por}
          onChange={event => setIngredientBeingEdited({ ...ingredient, creado_por: event.target.value })}
        />
        <TextField
          style={{ width: "45%", marginBottom: "10px", float: "right" }}
          label="Brand"
          value={ingredient.marca}
          onChange={event => setIngredientBeingEdited({ ...ingredient, marca: event.target.value })}
        />
        <TextField
          style={{ width: "100%", marginBottom: "10px" }}
          fullWidth={true}
          label="URL"
          value={ingredient.url}
          onChange={event => setIngredientBeingEdited({ ...ingredient, url: event.target.value })}
        />
      </DialogContent>
      <div style={{display: "flex", justifyContent: "center", marginTop: "10px", marginBottom: "20px"}}>
        <div style={{width: "50%", display: "flex", justifyContent: "space-evenly"}}>
          <Button onClick={saveIngredient} variant="contained">Save</Button>
          <Button onClick={onClose}>Cancel</Button>
        </div>
      </div>
    </Dialog>
  );
}

export default function EnhancedTable() {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('calories');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [ingredients, setIngredients] = useState([]);
  const [open, setOpen] = useState(false);
  const [isIngredientBeingCreated, setIsIngredientBeingCreated] = useState(false);
  const [ingredientBeingEdited, setIngredientBeingEdited] = useState({});
  const [filterValue, setFilterValue] = useState("");

  useEffect(() => {
    fetchData(100, "");
  }, []);
  
  async function fetchData(limit, search) {
    const response = await fetch(`${backendUrl}/api/v1/ingredients?limit=${limit}&search=${search}`);
    const data = await response.json();
    setIngredients(data.result);
  }

  const handleAddClick = () => {
    setIngredientBeingEdited({nombre: "New ingredient", creado_por: "Me", marca: "My brand", url: "http://example.com"});
    setIsIngredientBeingCreated(true);
    setOpen(true);
  }

  const handleEditClick = (ingredient) => {
    setIngredientBeingEdited(ingredient);
    setOpen(true);
  }
  
  const handleClose = () => {
    setOpen(false);
    setIngredientBeingEdited({});
  }

  async function saveIngredient() {
    
    if (isIngredientBeingCreated) {
      const response = await axios.post(`${backendUrl}/api/v1/ingredients`, {...ingredientBeingEdited, imagen: "https://t4.ftcdn.net/jpg/04/70/29/97/360_F_470299797_UD0eoVMMSUbHCcNJCdv2t8B2g1GVqYgs.jpg"});
      setIngredients([response.data, ...ingredients]);
      setIsIngredientBeingCreated(false);
    } else {
      const response = await axios.put(`${backendUrl}/api/v1/ingredients/${ingredientBeingEdited._id}`, {...ingredientBeingEdited});
      setIngredients(ingredients.map(i => i._id === ingredientBeingEdited._id ? ingredientBeingEdited : i));
    }
    setOpen(false);
    setIngredientBeingEdited({});
  }

  async function handleDeleteIngredient(id) {
    await axios.delete(`${backendUrl}/api/v1/ingredients/${id}`);
    setIngredients(ingredients.filter(i => i._id !== id));
  }

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    if (newPage + 1 === ingredients.length / rowsPerPage) {
      fetchData(ingredients.length + rowsPerPage * 20 , filterValue).then(() => {
        setPage(newPage);
      });
    } else {
      setPage(newPage);
    }
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - ingredients.length) : 0;

  return (
    <Item style={{ borderRadius: "20px", height: "auto", padding: "20px", margin: "20px" }}>
        <TableContainer>
          <Box style={{display: "flex", alignItems: "flex-end", margin: "0px 50px 0px 0px"}}>
            <Typography
              sx={{ flex: '1 1 100%' }}
              variant="h5"
              id="tableTitle"
              component="div"
              style={{textAlign: "left"}}
            >
              Ingredients list
            </Typography>
            <div style={{display: "flex", alignItems: "flex-end"}}>
              <IconButton onClick={handleAddClick.bind(null)} style={{borderRadius: "15px", backgroundColor: "rgba(0, 0, 0, 0.05)", marginRight: "15px", fontSize: "16px", padding: "4px 8px 4px 2px"}}>
                <AddIcon/> Add ingredient
              </IconButton>
              <TextField
                style={{ width: "300px" }}
                label="Filter ingredients"
                value={filterValue}
                onChange={event => setFilterValue(event.target.value)}
                onKeyUp={event => {
                  if (event.key === "Enter") {
                    fetchData(filterValue === "" ? 100 : ingredients.length, filterValue);
                  }
                }}
              />
            </div>
          </Box>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={'medium'}
          >
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={ingredients.length}
            />
            <EditIngredientDialog open={open} ingredient={ingredientBeingEdited} onClose={handleClose} saveIngredient={saveIngredient} setIngredientBeingEdited={setIngredientBeingEdited} />
            <TableBody>
              {stableSort(ingredients, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((ingredient, index) => {
                  
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                    hover
                    tabIndex={-1}
                    key={ingredient._id}
                    >
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                      >
                        {ingredient.nombre}
                      </TableCell>
                      <TableCell>{ingredient.creado_por}</TableCell>
                      <TableCell>{ingredient.marca}</TableCell>
                      <TableCell><img src={ingredient.imagen} alt={ingredient.imagen} style={{height: "150px", width: "150px", objectFit: 'scale-down'}}/></TableCell>
                      <TableCell><a href={ingredient.url}>{ingredient.url}</a></TableCell>
                      <TableCell>
                        <IconButton onClick={handleEditClick.bind(null, ingredient)}>
                          <EditIcon/>
                        </IconButton>
                        <IconButton onClick={handleDeleteIngredient.bind(null, ingredient._id)}>
                          <DeleteIcon/>
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 53 * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={ingredients.length}
          rowsPerPage={rowsPerPage}
          page={ingredients.length <= 0 ? 0 : page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
    </Item>
  );
}