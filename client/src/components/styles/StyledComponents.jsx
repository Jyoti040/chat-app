import {keyframes, Skeleton, styled} from '@mui/material'
import { Link } from 'react-router-dom'

const VisuallyHiddenInput = styled("input")({
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

const StyledLink = styled(Link)({
    textDecoration:"none" , 
    color:'inherit',
})

const bounceAnimation = keyframes`
0% { transform : scale(1) ;}
5% { transform : scale(1.5) ;}
100% { transform : scale(1) ;}
`

const BouncingSkeleton = styled(Skeleton)(()=>({
    animation : `${bounceAnimation} 1s infinite`
}))

export  {VisuallyHiddenInput , StyledLink , BouncingSkeleton}