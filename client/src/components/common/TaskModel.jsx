/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react"
import moment from 'moment'
import { DeleteOutlineOutlined } from '@mui/icons-material'
import CloseIcon from '@mui/icons-material/Close';
import { Modal, Box, Typography, TextField, IconButton, Divider } from "@mui/material"
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import taskApi from "../../api/taskApi"


const modalStyle = {
    outline: 'none',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '50%',
    bgcolor: 'background.paper',
    border: '0px solid #000',
    boxShadow: 24,
    p: 1,
    height: '80%'
}

let timer
const timeout = 500
let isModalClosed = false

const TaskModel = (props) => {
    const boardId = props.boardId
    const [task, setTask] = useState(props.task)
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const editorWrapperRef = useRef()

    useEffect(() => {
        setTask(props.task)
        setTitle(props.task !== undefined ? props.task.title : "")
        setContent(props.task !== undefined ? props.task.content : "")
        if (props.task !== undefined) {
            isModalClosed = false
            updateEditorHeight()
        }
    }, [props.task])

    const updateEditorHeight = () => {
        setTimeout(() => {
            if (editorWrapperRef.current) {
                const box = editorWrapperRef.current
                box.querySelector('.ck-editor__editable_inline').style.height = (box.offsetHeight - 50) + 'px'
            }
        }, timeout)
    }

    const onClose = () => {
        isModalClosed = true
        props.onUpdate(task)
        props.onClose()
    }

    const deleteTask = async () => {
        try {
            await taskApi.delete(boardId, task._id)
            props.onDelete(task)
            setTask(undefined)
        } catch (error) {
            console.log(error.data)
        }
    }

    const updateTitle = async (e) => {
        clearTimeout(timer)
        const newTitle = e.target.value
        timer = setTimeout(async () => {
            try {
                await taskApi.update(boardId, task._id, { title: newTitle })
            } catch (error) {
                console.log(error.data)
            }
        }, timeout)
        task.title = newTitle
        setTitle(newTitle)
        props.onUpdate(task)
    }

    const updateContent = async (event, editor) => {
        clearTimeout(timer)

        const data = editor.getData()

        if (!isModalClosed) {
            timer = setTimeout(async () => {
                try {
                    await taskApi.update(boardId, task._id, { content: data })
                } catch (error) {
                    console.log(error.data)
                }
            }, timeout)
            task.content = data
            setContent(data)
            props.onUpdate(task)
        }

    }

    return (
        <Modal
            open={task !== undefined}
            onClose={onClose}
            closeAfterTransition
        >
            <Box
                sx={modalStyle}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        width: '100%'
                    }}
                >
                    <IconButton
                        variant="outlined"
                        color='error'
                        onClick={deleteTask}
                    >
                        <DeleteOutlineOutlined />
                    </IconButton>
                    <IconButton
                        variant="outlined"
                        color='success'
                        onClick={onClose}
                        sx={{
                            marginLeft: '10px'
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </Box>

                <Box
                    sx={{
                        display: 'flex',
                        height: '100%',
                        flexDirection: 'column',
                        padding: '2rem 5rem 5rem'
                    }}
                >
                    <TextField
                        onChange={updateTitle}
                        value={title}
                        placeholder="Untitled"
                        variant="outlined"
                        fullWidth
                        sx={{
                            width: '100%',
                            marginBottom: '10px',
                            '& .MuiOutlinedInput-input': { padding: 0 },
                            '& .MuiOutlinedInput-notchedOutline': { border: 'unset' },
                            '& .MuiOutlinedInput-root': { fontSize: '2.5rem', fontWeight: '700' }
                        }}
                    />
                    <Typography variant="body2" fontWeight='700'>
                        {task !== undefined ? moment(task.createAt).format('DD-MM-YYYY') : ""}
                    </Typography>
                    <Divider sx={{ margin: '1.5rem 0' }} />
                    <Box
                        ref={editorWrapperRef}
                        sx={{
                            height: '80%',
                            overflowX: 'hidden',
                            overflowY: 'auto',
                        }}
                    >
                        <CKEditor
                            editor={ClassicEditor}
                            data={content}
                            onChange={updateContent}
                            onFocus={updateEditorHeight}
                            onBlur={updateEditorHeight}
                        />
                    </Box>
                </Box>
            </Box>

        </Modal>
    )
}

export default TaskModel