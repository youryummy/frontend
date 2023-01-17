import Avatar from '@mui/material/Avatar';
import { IconButton } from "@mui/material";
import PhotoCamera from '@mui/icons-material/CameraAltOutlined';
import { useState } from 'react';

export default function UploadImage({data, setData, d}) {
    const [hover, setHover] = useState(false);

    const setField = (setData, value) => setData(prev => ({...prev, avatar: {file: value, url: value ? URL.createObjectURL(value) : ""}}));

    const styles = {
        icon: {
            position: "absolute",
            zIndex: 999,
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            height: `${d * 0.3}px`,
            width: `${d * 0.3}px`,
            color: "white",
            opacity: data.avatar?.url ? 0 : 1,
            transition: "opacity 0.3s",
            
            "&:hover": {
                opacity: 1
            }
        },
        avatar: {
            filter: data.avatar?.url ? "brightness(1)" : "brightness(0.5)",
            width: `${d ?? 50}px`,
            height: `${d ?? 50}px`,
            transition: "filter 0.3s",

            "&:hover": {
                filter: "brightness(0.5)"
            }
        }
    }
    
    return (
        <IconButton component="label" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
            <input onChange={ (ev) => setField(setData, ev.target.files?.[0])} hidden accept="image/*" type="file" />
            <span style={{position: "relative"}}>
              <PhotoCamera style={{...styles.icon, ...(hover ? styles.icon["&:hover"] : null)}}/>
              <Avatar style={{...styles.avatar, ...(hover ? styles.avatar["&:hover"] : null)}} src={typeof data.avatar === "string" ? data.avatar : data.avatar?.url ?? "/broken"}/>
            </span>
        </IconButton>
    )
}