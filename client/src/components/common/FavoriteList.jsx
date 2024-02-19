import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import { Box, Typography, ListItem, ListItemButton } from '@mui/material'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import favoriteSlice from '../../redux/reducers/favoriteSlice'
import boardApi from '../../api/boardApi'
import { favoritesSelector, boardSelector } from '../../redux/selectors'

const FavoriteList = () => {

    const dispatch = useDispatch()
    // const list = useSelector(favoritesSelector)
    const boards = useSelector(favoritesSelector)
    const { boardId } = useParams()
    const [activeIndex, setActiveIndex] = useState(0)

    useEffect(() => {
        const getBoards = async () => {
            try {
                const res = await boardApi.getFavorites()
                dispatch(favoriteSlice.actions.setFavoritesList(res))

            } catch (error) {
                console.log(error.data)
            }
        }
        getBoards()
    }, [])

    useEffect(() => {
        const index = boards.findIndex(e => e._id === boardId);
        setActiveIndex(index)
    }, [boards, boardId])

    const onDragEnd = async ({ source, destination }) => {
        const newList = [...boards]
        const [removed] = newList.splice(source.index, 1)
        newList.splice(destination.index, 0, removed)

        const activeItem = newList.findIndex(e => e._id === boardId)
        setActiveIndex(activeItem)
        dispatch(favoriteSlice.actions.setFavoritesList(newList))

        try {
            await boardApi.updateFavoritePosition({ boards: newList })
        } catch (error) {
            console.log(error.data)
        }
    }

    return (
        <>
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
                        Favourite
                    </Typography>
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
        </>
    )
}

export default FavoriteList