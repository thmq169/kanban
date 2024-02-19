import { useSelector, useDispatch } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Box, Drawer, Typography, List, ListItem, IconButton, ListItemButton } from '@mui/material'
import { LoginOutlined, AddBoxOutlined } from '@mui/icons-material'
import boardSlice from '../../redux/reducers/boardSlice'
import boardApi from '../../api/boardApi'
import { boardSelector } from '../../redux/selectors'

import assets from '../../assets'
import { userSelector } from '../../redux/selectors'
import { useEffect, useState } from 'react'

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import FavoriteList from './FavoriteList'

const Sidebar = () => {
    const sidebarWith = 250
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const user = useSelector(userSelector)
    const boards = useSelector(boardSelector)
    const { boardId } = useParams()
    const [activeIndex, setActiveIndex] = useState(0)

    useEffect(() => {
        const getBoards = async () => {
            try {
                const res = await boardApi.getAll()
                dispatch(boardSlice.actions.setBoard(res))

            } catch (error) {
                alert(error.data)
            }
        }
        getBoards()
    }, [dispatch])

    useEffect(() => {
        const activeItem = boards.findIndex(e => e._id === boardId);
        if (boards.length > 0 && boardId === undefined) {
            navigate(`/boards/${boards[0]._id}`)
        }
        setActiveIndex(activeItem)
    }, [boards, boardId, navigate])

    const logOut = () => {
        localStorage.removeItem('token')
        navigate('/login')
    }

    const onDragEnd = async ({ source, destination }) => {
        const newList = [...boards]
        const [removed] = newList.splice(source.index, 1)
        newList.splice(destination.index, 0, removed)

        const activeItem = newList.findIndex(e => e._id === boardId)
        setActiveIndex(activeItem)
        dispatch(boardSlice.actions.setBoard(newList))

        try {
            await boardApi.updatePosition({ boards: newList })
        } catch (error) {
            alert(error.data)
        }
    }

    const addBoard = async () => {
        try {
            const res = await boardApi.create()
            const newList = [res, ...boards]

            dispatch(boardSlice.actions.setBoard(newList))
            navigate(`/boards/${res._id}`)

        } catch (error) {
            alert(error.data)
        }
    }

    return (
        <>
            <Drawer
                container={window.document.body}
                variant='permanent'
                open={true}
                sx={{
                    width: sidebarWith,
                    height: '100vh',
                    '& > div': { borderRight: 'none' }
                }}
            >
                <List
                    disablePadding
                    sx={{
                        width: sidebarWith,
                        height: '100vh',
                        backgroundColor: assets.colors.secondary
                    }}
                >
                    <ListItem>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                width: '100%',
                            }}
                        >
                            <Typography variant="body2" fontWeight='700'>
                                {user.username}
                            </Typography>
                            <IconButton onClick={logOut}>
                                <LoginOutlined fontSize='small' />
                            </IconButton>
                        </Box>
                    </ListItem>
                    <Box sx={{ paddingTop: '10px' }} />

                    <FavoriteList />

                    <Box sx={{ paddingTop: '10px' }} />
                    <ListItem>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                width: '100%',
                            }}
                        >
                            <Typography variant="body2" fontWeight='700'>
                                Private
                            </Typography>
                            <IconButton onClick={addBoard}>
                                <AddBoxOutlined fontSize='small' />
                            </IconButton>
                        </Box>
                    </ListItem>
                    <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable key={'list-board-droppable'} droppableId={'list-board-droppable'}>
                            {
                                (provided) => (
                                    <div ref={provided.innerRef} {...provided.droppableProps}>
                                        {
                                            boards.map((item, index) => (
                                                <Draggable key={item._id} draggableId={item._id} index={index}>
                                                    {
                                                        (provided, snapshot) => (
                                                            <ListItemButton
                                                                ref={provided.innerRef}
                                                                {...provided.dragHandleProps}
                                                                {...provided.draggableProps}
                                                                selected={index === activeIndex}
                                                                component={Link}
                                                                to={`/boards/${item._id}`}
                                                                sx={{
                                                                    pl: '20px',
                                                                    cursor: snapshot.isDragging ? 'grab' : 'pointer !important'
                                                                }}
                                                            >
                                                                <Typography variant='body2' fontWeight='700' sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                                    {item.icon} {item.title}
                                                                </Typography>
                                                            </ListItemButton>
                                                        )
                                                    }
                                                </Draggable>
                                            ))
                                        }
                                        {
                                            provided.placeholder
                                        }
                                    </div>
                                )
                            }
                        </Droppable>
                    </DragDropContext>
                </List>
            </Drawer>
        </>
    )
}

export default Sidebar