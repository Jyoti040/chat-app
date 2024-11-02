import {styled} from '@mui/material'
import { Link } from 'react-router-dom'

export const VisuallyHiddenInput = styled("input")({
    border:"0",
    clip:"rect(0,0,0,0)",
    margin:"-1",
    height:"1",
    padding:"0",
    overflow:"hidden",
    position:"absolute",
    width:"1",
    whiteSpace:"nowrap"
    
})

export const StyledLink = styled(Link)({
    textDecoration:"none" , 
    color:'inherit',
})