import { useDispatch } from "react-redux"
import { useNavigate } from 'react-router-dom'
import { Box } from "@mui/material"
import { LoadingButton } from '@mui/lab'

import boardApi from "../api/boardApi"
import boardSlice from "../redux/reducers/boardSlice"
import { useState } from "react"


const Home = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)

    const createBoard = async () => {
        setLoading(true)
        try {
            const res = await boardApi.create()
            dispatch(boardSlice.actions.setBoard([res]));
            console.log(res);
            navigate(`/boards/${res._id}`)
        } catch (error) {
            console.log(error.data)
        }
        finally {
            setLoading(false)
        }
    }
    return (
        <Box
            sx={{
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}
        >
            <LoadingButton loading={loading} variant="outlined" color="success" onClick={createBoard}>
                Click here to create your first board
            </LoadingButton>
        </Box>
    )
}

export default Home