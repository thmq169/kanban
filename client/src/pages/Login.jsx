import { useState } from "react"
import { Box, TextField, Button } from "@mui/material"
import { LoadingButton } from '@mui/lab'
import { Link, useNavigate } from "react-router-dom"
import authApi from "../api/authApi"

const Login = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [usernameErrText, setUserNameErrText] = useState("")
    const [passwordErrText, setPassWordErrText] = useState("")

    const handleLogin = async (e) => {
        e.preventDefault()
        setUserNameErrText('')
        setPassWordErrText('')

        const data = new FormData(e.target)
        const username = data.get('username').trim()
        const password = data.get('password').trim()

        let err = false

        if (username === '') {
            err = true
            setUserNameErrText('Please fill this field')
        }

        if (password === '') {
            err = true
            setPassWordErrText('Please fill this field')
        }

        if (err) return

        setLoading(true)

        try {
            const res = await authApi.login({
                username, password
            })

            setLoading(false)
            localStorage.setItem('token', res.token)
            navigate('/')

        } catch (error) {
            const errors = error.data.errors
            console.log(errors);
            errors.forEach(e => {
                if (e.path === "username") {
                    setUserNameErrText(e.msg)
                }
                if (e.path === "password") {
                    setPassWordErrText(e.msg)
                }
            })
            setLoading(false)
        }
    }
    return (
        <>
            <Box
                component="form"
                sx={{ mt: 1, textAlign: 'center' }}
                onSubmit={handleLogin}
                noValidate
            >
                <TextField
                    margin="normal"
                    size="small"
                    fullWidth
                    required
                    id="username"
                    label="Username"
                    name="username"
                    disabled={loading}
                    error={usernameErrText !== ""}
                    helperText={usernameErrText}
                    onChange={() => {
                        setUserNameErrText('')
                    }}
                />
                <TextField
                    margin="normal"
                    size="small"
                    fullWidth
                    required
                    type="password"
                    id="password"
                    label="Password"
                    name="password"
                    disabled={loading}
                    error={passwordErrText !== ""}
                    helperText={passwordErrText}
                    onChange={() => {
                        setPassWordErrText('')
                    }}
                />
                <LoadingButton
                    sx={{ mt: 3, mb: 2 }}
                    loading={loading}
                    variant="outlined"
                    fullWidth
                    color="success"
                    type="submit"
                >
                    Login
                </LoadingButton>
                <Button
                    component={Link}
                    to='/signup'
                    sx={{ textTransform: 'none' }}
                >
                    Don&apos;t have an account? Signup
                </Button>
            </Box>
        </>
    )
}

export default Login