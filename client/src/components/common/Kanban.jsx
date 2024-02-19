/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react"
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { Box, Button, Card, Divider, IconButton, TextField, Typography } from "@mui/material"
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { DeleteOutlineOutlined } from '@mui/icons-material'
import sectionApi from "../../api/sectionApi";
import taskApi from "../../api/taskApi";
import TaskModel from "./TaskModel";

let timer
const timeout = 500
const Kanban = (props) => {

    const boardId = props.boardId
    const [data, setData] = useState([])
    const [selectedTask, setSelectedTask] = useState(undefined)

    useEffect(() => {
        setData(props.data)
    }, [props.data])

    useEffect(() => {
        setData(data)
    }, [data])

    const onDragEnd = async ({ source, destination }) => {
        if (!destination) return

        const sourceColIndex = data.findIndex(e => e._id === source.droppableId)
        const destinationColIndex = data.findIndex(e => e._id === destination.droppableId)
        const sourceCol = data[sourceColIndex]
        const destinationCol = data[destinationColIndex]

        const sourceSectionId = sourceCol._id
        const destinationSectionId = destinationCol._id

        const sourceTasks = [...sourceCol.tasks]
        const destinationTasks = [...destinationCol.tasks]

        if (source.droppableId !== destination.droppableId) {
            const [removed] = sourceTasks.splice(source.index, 1)
            destinationTasks.splice(destination.index, 0, removed)
            data[sourceColIndex].tasks = sourceTasks
            data[destinationColIndex].tasks = destinationTasks
        } else {
            const [removed] = destinationTasks.splice(source.index, 1)
            destinationTasks.splice(destination.index, 0, removed)
            data[destinationColIndex].tasks = destinationTasks
        }

        try {
            await taskApi.updatePosition(boardId, {
                resourceList: sourceTasks,
                destinationList: destinationTasks,
                resourceSectionId: sourceSectionId,
                destinationSectionId: destinationSectionId,
            })
            setData(data)
        } catch (error) {
            console.log(error.data)
        }

    }

    const createSection = async () => {
        try {
            const section = await sectionApi.create(boardId)
            setData([...data, section])
        } catch (error) {
            console.log(error.data)
        }
    }

    const deleteSection = async (sectionId) => {
        try {
            await sectionApi.delete(boardId, sectionId)
            const newData = [...data].filter(e => e._id !== sectionId)
            setData(newData)
        } catch (error) {
            console.log(error.data)
        }
    }

    const updateTitleSection = (e, sectionId) => {
        const newTitle = e.target.value
        const newData = [...data]
        const index = newData.findIndex(e => e._id === sectionId)
        newData[index].title = newTitle
        setData(newData)

        timer = setTimeout(async () => {
            try {
                await sectionApi.update(boardId, sectionId, { title: newTitle })
            } catch (error) {
                console.log(error.data)
            }
        }, timeout)
    }

    const createTask = async (sectionId) => {
        try {
            const task = await taskApi.create(boardId, { sectionId })
            const newData = [...data]
            const index = newData.findIndex(e => e._id === sectionId)
            newData[index].tasks.unshift(task)
            setData(newData)
        } catch (error) {
            console.log(error.data)
        }
    }

    const onUpdateTask = (task) => {
        const newData = [...data]
        const sectionIndex = newData.findIndex(e => e._id === task.section._id)
        const taskIndex = newData[sectionIndex].tasks.findIndex(e => e._id === task._id)
        newData[sectionIndex].tasks[taskIndex] = task
        setData(newData)
    }

    const onDeleteTask = (task) => {
        const newData = [...data]
        const sectionIndex = newData.findIndex(e => e._id === task.section._id)
        const taskIndex = newData[sectionIndex].tasks.findIndex(e => e._id === task._id)
        newData[sectionIndex].tasks.splice(taskIndex, 1)
        setData(newData)
        console.log(newData);
        console.log(sectionIndex);
        console.log(taskIndex);
        console.log(task.section._id);
    }

    return (
        <>
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <Button onClick={createSection}>
                    Add section
                </Button>
                <Typography variant="body2" fontWeight='700'>
                    {data.length} Sections
                </Typography>
            </Box>
            <Divider sx={{ margin: '10px 0' }} />
            <DragDropContext onDragEnd={onDragEnd}>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    width: 'calc(100vw - 400px)',
                    overflowX: 'auto'
                }}>
                    {
                        data.map(section => (
                            <div key={section._id} style={{ width: '300px' }}>
                                <Droppable key={section._id} droppableId={section._id}>
                                    {
                                        (provided) => (
                                            <Box
                                                ref={provided.innerRef}
                                                {...provided.droppableProps}
                                                sx={{
                                                    width: '300px',
                                                    padding: '10px',
                                                    marginRight: '10px'
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'space-between',
                                                        marginBottom: '10px'
                                                    }}
                                                >
                                                    <TextField
                                                        onChange={(e) => updateTitleSection(e, section._id)}
                                                        value={section.title}
                                                        placeholder="Untitled"
                                                        variant="outlined"
                                                        sx={{
                                                            flexGrow: 1,
                                                            '& .MuiOutlinedInput-input': { padding: 0 },
                                                            '& .MuiOutlinedInput-notchedOutline': { border: 'unset' },
                                                            '& .MuiOutlinedInput-root': { fontSize: '1rem', fontWeight: '700' }
                                                        }}
                                                    />
                                                    <IconButton
                                                        onClick={() => createTask(section._id)}
                                                        variant='outlined'
                                                        size='small'
                                                        sx={{
                                                            color: 'gray',
                                                            '&:hover': {
                                                                color: 'green'
                                                            }
                                                        }}
                                                    >
                                                        <AddOutlinedIcon />
                                                    </IconButton>
                                                    <IconButton
                                                        variant='outlined'
                                                        size='small'
                                                        sx={{
                                                            color: 'gray',
                                                            '&:hover': {
                                                                color: 'red'
                                                            }
                                                        }}
                                                        onClick={() => deleteSection(section._id)}
                                                    >
                                                        <DeleteOutlineOutlined />
                                                    </IconButton>
                                                </Box>

                                                {
                                                    section.tasks.map((task, index) => (
                                                        <Draggable key={task._id} draggableId={task._id} index={index}>
                                                            {
                                                                (provided, snapshot) => (
                                                                    <Card
                                                                        ref={provided.innerRef}
                                                                        {...provided.draggableProps}
                                                                        {...provided.dragHandleProps}
                                                                        sx={{
                                                                            padding: '10px',
                                                                            marginBottom: '10px',
                                                                            cursor: snapshot.isDraggable ? 'grab' : 'pointer !important'
                                                                        }}
                                                                        onClick={() => setSelectedTask(task)}
                                                                    >
                                                                        <Typography>
                                                                            {task.title === "" ? 'Untitled' : task.title}
                                                                        </Typography>
                                                                    </Card>
                                                                )
                                                            }
                                                        </Draggable>
                                                    ))
                                                }
                                                {
                                                    provided.placeholder
                                                }
                                            </Box>
                                        )
                                    }
                                </Droppable>
                            </div>
                        ))
                    }
                </Box>
            </DragDropContext>
            <TaskModel
                task={selectedTask}
                boardId={boardId}
                onClose={() => setSelectedTask(undefined)}
                onUpdate={onUpdateTask}
                onDelete={onDeleteTask}
            />
        </>
    )
}

export default Kanban