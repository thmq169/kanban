/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from 'react-redux'
import { Box, Button, Divider, IconButton, TextField, Typography } from "@mui/material"
import { DeleteOutlineOutlined } from '@mui/icons-material'
import StarOutlineOutlinedIcon from '@mui/icons-material/StarOutlineOutlined';
import StarOutlinedIcon from '@mui/icons-material/StarOutlined';
import boardApi from "../api/boardApi"
import EmojiPicker from "../components/common/EmojiPicker"
import { boardSelector, favoritesSelector } from '../redux/selectors'
import boardSlice from '../redux/reducers/boardSlice'
import favoriteSlice from "../redux/reducers/favoriteSlice"
import Kanban from "../components/common/Kanban"

let timer
const timeout = 500
const Board = () => {

    const { boardId } = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const boards = useSelector(boardSelector)
    const favorites = useSelector(favoritesSelector)
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [section, setSection] = useState([])
    const [isFavorite, setIsFavorite] = useState(false)
    const [icon, setIcon] = useState('')

    useEffect(() => {
        const getBoard = async () => {
            try {
                const res = await boardApi.getOne(boardId)
                setTitle(res.title)
                setDescription(res.description)
                setSection(res.sections)
                setIsFavorite(res.favorite)
                setIcon(res.icon)
            } catch (error) {

                alert(error.data)
            }
        }

        getBoard()

    }, [boardId])


    const onIconChange = async (newIcon) => {
        let temp = [...boards]
        const index = temp.findIndex(e => e._id === boardId)
        temp[index] = { ...temp[index], icon: newIcon }

        if (isFavorite) {
            let tempFavorite = [...favorites]
            const indexFavorite = tempFavorite.findIndex(e => e._id === boardId)
            tempFavorite[indexFavorite] = { ...tempFavorite[indexFavorite], icon: newIcon }
            dispatch(favoriteSlice.actions.setFavoritesList(tempFavorite))
        }

        setIcon(newIcon)
        dispatch(boardSlice.actions.setBoard(temp))

        try {
            await boardApi.update(boardId, { icon: newIcon })
        } catch (error) {
            alert(error.data)
        }
    }

    const updateTitle = async (e) => {
        clearTimeout(timer)
        const newTitle = e.target.value
        setTitle(newTitle)
        let temp = [...boards]
        const index = temp.findIndex(e => e._id === boardId)
        temp[index] = { ...temp[index], title: newTitle }

        if (isFavorite) {
            let tempFavorite = [...favorites]
            const indexFavorite = tempFavorite.findIndex(e => e._id === boardId)
            tempFavorite[indexFavorite] = { ...tempFavorite[indexFavorite], title: newTitle }
            dispatch(favoriteSlice.actions.setFavoritesList(tempFavorite))
        }

        dispatch(boardSlice.actions.setBoard(temp))

        timer = setTimeout(async () => {
            try {
                await boardApi.update(boardId, { title: newTitle })
            } catch (error) {
                alert(error.data)
            }
        }, timeout)
    }

    const updateDescriptipm = async (e) => {
        clearTimeout(timer)
        const newDescription = e.target.value
        setDescription(newDescription)
        let temp = [...boards]
        const index = temp.findIndex(e => e._id === boardId)
        temp[index] = { ...temp[index], description: newDescription }
        dispatch(boardSlice.actions.setBoard(temp))
        timer = setTimeout(async () => {
            try {
                await boardApi.update(boardId, { description: newDescription })
            } catch (error) {
                alert(error.data)
            }
        }, timeout)
    }

    const addFavorite = async () => {
        try {
            const board = await boardApi.update(boardId, { favorite: !isFavorite })
            let newFavoriteList = [...favorites]
            if (isFavorite) {
                newFavoriteList = newFavoriteList.filter(f => f._id !== boardId)
            }
            else {
                newFavoriteList.unshift(board)
            }
            dispatch(favoriteSlice.actions.setFavoritesList(newFavoriteList))

            setIsFavorite(!isFavorite)
        } catch (error) {
            alert(error.data)
        }
    }

    const deleteBoard = async () => {
        try {
            await boardApi.deleteBoard(boardId)

            if (isFavorite) {
                const newFavoriteList = favorites.filter(f => f._id !== boardId)

                dispatch(favoriteSlice.actions.setFavoritesList(newFavoriteList))
            }

            const newList = boards.filter(e => e._id !== boardId)
            if (newList.length === 0) {
                navigate('/boards')
            }
            else {
                navigate(`/boards/${newList[0]._id}`)
            }

            dispatch(boardSlice.actions.setBoard(newList))

        } catch (error) {
            alert(error.data)
        }
    }


    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%'
                }}
            >
                <IconButton variant="outlined" onClick={addFavorite}>
                    {
                        isFavorite ? (
                            <StarOutlinedIcon color="warning" />
                        ) : (
                            <StarOutlineOutlinedIcon />
                        )
                    }
                </IconButton>
                <IconButton variant="outlined" color="error" onClick={deleteBoard}>
                    <DeleteOutlineOutlined />
                </IconButton>
            </Box>
            <Box sx={{ padding: '10px 50px' }}>
                <Box>
                    <EmojiPicker icon={icon} onChange={onIconChange} />

                    <TextField
                        onChange={updateTitle}
                        value={title}
                        placeholder="Untitled"
                        variant="outlined"
                        fullWidth
                        sx={{
                            '& .MuiOutlinedInput-input': { padding: 0 },
                            '& .MuiOutlinedInput-notchedOutline': { border: 'unset' },
                            '& .MuiOutlinedInput-root': { fontSize: '2rem', fontWeight: '700' }
                        }}
                    />

                    <TextField
                        onChange={updateDescriptipm}
                        value={description}
                        placeholder="Add a description"
                        variant="outlined"
                        fullWidth
                        multiline
                        sx={{
                            '& .MuiOutlinedInput-input': { padding: 0 },
                            '& .MuiOutlinedInput-notchedOutline': { border: 'unset' },
                            '& .MuiOutlinedInput-root': { fontSize: '0.8rem', fontWeight: '700' }
                        }}
                    />
                </Box>
                <Box>
                    <Kanban data={section} boardId={boardId} />
                </Box>

            </Box>
        </>
    )
}

export default Board