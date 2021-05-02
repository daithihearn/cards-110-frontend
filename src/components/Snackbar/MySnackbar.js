
import React, { useState } from 'react'

import Snackbar from "@material-ui/core/Snackbar"
import MySnackbarContentWrapper from './MySnackbarContentWrapper'
import { useSelector, useDispatch } from 'react-redux'

const MySnackbar = () => {
    const dispatch = useDispatch()
    const snackbarState = useSelector(state => state.snackbar)

    const handleClose = () => {
      dispatch({ type: 'snackbar/close' })
    }
    
    return (
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right"
          }}
          open={ snackbarState.open }
          autoHideDuration={6000}
          onClose={handleClose}
        >
          <MySnackbarContentWrapper
            onClose={ handleClose }
            variant={ snackbarState.type }
            message={ snackbarState.message }
          />
        </Snackbar>
    )
}

export default MySnackbar;