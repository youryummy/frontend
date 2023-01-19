import { 
    Typography,
    Button, 
    Popover,
    List,
    ListItem,
    ListItemText, 
    ListItemIcon,
    Divider,
    Radio
} from "@mui/material";
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import RestaurantMenuRoundedIcon from '@mui/icons-material/RestaurantMenuRounded';
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';
import MessageOutlinedIcon from '@mui/icons-material/MessageOutlined';
import LunchDiningOutlinedIcon from '@mui/icons-material/LunchDiningOutlined';
import EventRepeatOutlinedIcon from '@mui/icons-material/EventRepeatOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import { PayPalButton } from 'react-paypal-button-v2';
import AutoModeIcon from '@mui/icons-material/AutoMode';

import { useState } from 'react';

export default function Plans(props) {
    const { popover, payment, popoverProps, paymentProps } = props;
    const [paymentAnchor, setpaymentAnchor] = useState(null);
    const [ newPlan, setNewPlan ] = useState("base");

    const openPayment = Boolean(paymentAnchor);
    const paymentId = openPayment ? 'simple-popover' : undefined;
    
    const content = (
        <>
            <style jsx>{`
            @media (max-width: 992px) {
                .responsive {
                    flex-direction: column;
                }
            `}
            </style>
            <div className="responsive" style={{display: "inline-flex", gap: "0px", padding: "50px 50px"}}>
                <List subheader={<Typography sx={{fontWeight: "600", color: "gray"}} variant="h5" >YourYummy! Plans</Typography>}>
                    <div className="responsive" style={{display: "flex", width: "100%", alignItems: "stretch"}}>  
                    <ListItem style={{flexDirection: "column", justifyContent: "space-between"}}>
                        <List dense subheader={<span style={{display: "inline-flex", alignItems: "center"}}>{payment ? <Radio disabled size="small" checked={newPlan === "base"}/> : null}<Typography sx={{fontWeight: "600", color: "gray"}} variant="h6">Base {paymentProps?.currentPlan === "base" ? "(current)" : ""}</Typography></span>}>
                        <ListItem><ListItemIcon><RestaurantMenuRoundedIcon/></ListItemIcon><ListItemText primary="140 Recipes per month" secondary="10 Recipes per day"/></ListItem>
                        <ListItem><ListItemIcon><MenuBookRoundedIcon/></ListItemIcon><ListItemText primary="10 Recipebooks" secondary="6 RecipeBooks per day"/></ListItem>
                        <ListItem><ListItemIcon><MessageOutlinedIcon/></ListItemIcon><ListItemText primary="150 Comments per month" secondary="15 Comments per day"/></ListItem>
                        <ListItem><ListItemIcon><StarBorderOutlinedIcon/></ListItemIcon><ListItemText primary="130 Ratings per month" secondary="12 Ratings per day"/></ListItem>
                        <ListItem><ListItemIcon><LunchDiningOutlinedIcon/></ListItemIcon><ListItemText primary="150 Ingredients per month" secondary="10 Ingredients per day"/></ListItem>
                        <ListItem><ListItemIcon><EventRepeatOutlinedIcon/></ListItemIcon><ListItemText primary="Google Calendar Sync."/><CloseRoundedIcon color="error"/></ListItem>
                        <ListItem><ListItemIcon><AutoModeIcon/></ListItemIcon><ListItemText primary="Recomendaciones rápidas"/><CloseRoundedIcon color="error"/></ListItem>
                        <ListItem><ListItemIcon><DescriptionOutlinedIcon/></ListItemIcon><ListItemText primary="SLA"/><CloseRoundedIcon color="error"/></ListItem>
                        </List>
                        <span style={{width: "100%"}}><Divider/><h1 style={{color: "gray", width: "100%", textAlign: "center"}}>Free</h1></span>
                    </ListItem>

                    <Divider orientation={window?.innerWidth < 992 ? "horizontal" : "vertical"} flexItem />

                    <ListItem style={{flexDirection: "column", justifyContent: "space-between"}}>
                        <List dense subheader={
                            <span style={{display: "inline-flex", alignItems: "center"}}>
                            {payment ? <Radio disabled={["advanced", "premium"].includes(paymentProps?.currentPlan)} size="small" value="advanced" checked={newPlan === "advanced"} onChange={(ev) => setNewPlan(ev.target.value)}/> : null}
                            <Typography sx={{fontWeight: "600", color: "gray"}} variant="h6">Advanced {paymentProps?.currentPlan === "advanced" ? "(current)" : ""}</Typography>
                            </span>
                        }>
                        <ListItem><ListItemIcon><RestaurantMenuRoundedIcon/></ListItemIcon><ListItemText primary="500 Recipes per month" secondary="30 Recipes per day"/></ListItem>
                        <ListItem><ListItemIcon><MenuBookRoundedIcon/></ListItemIcon><ListItemText primary="50 Recipebooks" secondary="15 RecipeBooks per day"/></ListItem>
                        <ListItem><ListItemIcon><MessageOutlinedIcon/></ListItemIcon><ListItemText primary="400 Comments per month" secondary="30 Comments per day"/></ListItem>
                        <ListItem><ListItemIcon><StarBorderOutlinedIcon/></ListItemIcon><ListItemText primary="400 Ratings per month" secondary="35 Ratings per day"/></ListItem>
                        <ListItem><ListItemIcon><LunchDiningOutlinedIcon/></ListItemIcon><ListItemText primary="450 Ingredients per month" secondary="30 Ingredients per day"/></ListItem>
                        <ListItem><ListItemIcon><EventRepeatOutlinedIcon/></ListItemIcon><ListItemText primary="Google Calendar Sync."/><CheckRoundedIcon color="success"/></ListItem>
                        <ListItem><ListItemIcon><AutoModeIcon/></ListItemIcon><ListItemText primary="Recomendaciones rápidas"/><CheckRoundedIcon color="success"/></ListItem>
                        <ListItem><ListItemIcon><DescriptionOutlinedIcon/></ListItemIcon><ListItemText primary="SLA"/><CheckRoundedIcon color="success"/></ListItem>
                        </List>
                        <span style={{width: "100%"}}><Divider/><h1 style={{color: "gray", width: "100%", textAlign: "center"}}>25.99 € / month</h1></span>
                    </ListItem>

                    <Divider orientation={window?.innerWidth < 992 ? "horizontal" : "vertical"} flexItem />

                    <ListItem style={{flexDirection: "column", justifyContent: "space-between"}}>
                    <List subheader={
                        <span style={{display: "inline-flex", alignItems: "center"}}>
                        {payment ? <Radio disabled={paymentProps?.currentPlan === "premium"} size="small" value="premium" checked={newPlan === "premium"} onChange={(ev) => setNewPlan(ev.target.value)}/> : null }
                        <Typography sx={{fontWeight: "600", color: "gray"}} variant="h6">Premium {paymentProps?.currentPlan === "premium" ? "(current)" : ""}</Typography>
                        </span>
                    }>                            
                        <ListItem><ListItemIcon><RestaurantMenuRoundedIcon/></ListItemIcon><ListItemText primary="Unlimited reipes"/></ListItem>
                        <ListItem><ListItemIcon><MenuBookRoundedIcon/></ListItemIcon><ListItemText primary="Unlimited recipebooks"/></ListItem>
                        <ListItem><ListItemIcon><MessageOutlinedIcon/></ListItemIcon><ListItemText primary="Unlimited comments"/></ListItem>
                        <ListItem><ListItemIcon><StarBorderOutlinedIcon/></ListItemIcon><ListItemText primary="Unlimited ratings"/></ListItem>
                        <ListItem><ListItemIcon><LunchDiningOutlinedIcon/></ListItemIcon><ListItemText primary="900 per month" secondary="15 Ingredients per day"/></ListItem>
                        <ListItem><ListItemIcon><EventRepeatOutlinedIcon/></ListItemIcon><ListItemText primary="Google Calendar Sync."/><CheckRoundedIcon color="success"/></ListItem>
                        <ListItem><ListItemIcon><AutoModeIcon/></ListItemIcon><ListItemText primary="Recomendaciones rápidas"/><CheckRoundedIcon color="success"/></ListItem>
                        <ListItem><ListItemIcon><DescriptionOutlinedIcon/></ListItemIcon><ListItemText primary="SLA"/><CheckRoundedIcon color="success"/></ListItem>
                        </List>
                        <span style={{width: "100%"}}><Divider/><h1 style={{color: "gray", width: "100%", textAlign: "center"}}>29.99 € / month</h1></span>
                    </ListItem>
                    </div>
                </List>
                {
                    payment ? 
                    <>
                        <Divider orientation={window?.innerWidth < 992 ? "horizontal" : "vertical"} flexItem />
                        <div style={{width: "350px", padding: "15px"}}>
                        {
                            newPlan !== "base" ?
                            <PayPalButton
                                createSubscription={(data, actions) => {
                                    return actions.subscription.create({
                                        plan_id: newPlan === "premium" ? "P-6JY74866YD2594240MO3XM5Y" : "P-14N70038PG351703EMO3XMPQ",
                                    })
                                }}
                                onApprove={() => paymentProps?.onSuccess(newPlan)}
                                onError={paymentProps?.onError}
                                onCancel={paymentProps?.onCancel}
                                options={{ vault: true, currency: "EUR", clientId: "ASkrzwXRd1lICrUSSmGIg5es4SXeVhLz_EZNnTWkR4_Wzj4yXqqnZiyyU0_gcc6C7EY1UYo3-NpHuFX4"}}
                            />
                            :
                            <p style={{width: "100%", textAlign: "center"}}> Please select a plan</p>
                        }
                        </div>
                    </>: null
                }
            </div>
        </>
    )

    return (
        popover ? 
            <>
                <Button onClick={() => setpaymentAnchor(document.body)} sx={{textDecoration: "underline", justifyContent: "flex-start"}}>{popoverProps?.buttonText ?? "See plans"}</Button>
                <Popover id={paymentId}
                    open={openPayment} 
                    anchorEl={paymentAnchor}
                    onClose={() => setpaymentAnchor(null)}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center'}} 
                    transformOrigin={{ vertical: 'center', horizontal: 'center' }}
                    slotProps={{ backdrop:  { style: { backgroundColor: "rgba(0, 0, 0, 0.5)" } } }}
                >
                    {content} 
                </Popover>
            </>
        : content
    )
}