// -------------------------------------------------------------------------------------
// Date        Author     Referene    Comments
// 01-09-23    HSK                    Created IafNotification Component
// 14-09-23    HSK                    Imported css file and used style to pass color variable
//                                    based on severity
// 11-12-23    ATK                    Build Warning
// 21-03-24    HSK        PLAT-4420   Iaf-viewer styles taking precedence over application's MUI components
// -------------------------------------------------------------------------------------
import React,{useState,useEffect} from "react";
import Snackbar from "@mui/material/Snackbar"; 

function IafNotification (props){

    const [open, setOpen] = useState(props.open);

    useEffect(()=>{
      setOpen(props.open);
    },[props.open])
  
    const handleClose = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
  
      setOpen(false);
      props.handleClose(props.message);
    };
  
    return (<Snackbar
          open={open}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          autoHideDuration={props.duration || 5000}
          onClose={handleClose}
          message={props.message || 'Hi, this is default text'}
          sx={{ 
            '--severity-color': props.severity === 'error' ? '#FF7171' : 
                                       props.severity === 'warning'? '#FDFF71' : '#FFFFFF'}}
        />
    );
}

export default IafNotification;