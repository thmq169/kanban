import { useState } from "react"
import { Box, TextField, Button } from "@mui/material"
import { LoadingButton } from '@mui/lab'
import { Link, useNavigate } from "react-router-dom"
import authApi from "../api/authApi"

const Signup = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [usernameErrText, setUserNameErrText] = useState("")
    const [passwordErrText, setPassWordErrText] = useState("")
    const [confirmPasswordErrText, setConfirmPassWordErrText] = useState("")

    const handleSignup = async (e) => {
        e.preventDefault()
        setUserNameErrText('')
        setPassWordErrText('')
        setConfirmPassWordErrText('')

        const data = new FormData(e.target)
        const username = data.get('username').trim()
        const password = data.get('password').trim()
        const confirmPassword = data.get('confirmPassword').trim()

        let err = false

        if (username === '') {
            err = true
            setUserNameErrText('Please fill this field')
        }

        if (password === '') {
            err = true
            setPassWordErrText('Please fill this field')
        }

        if (confirmPassword === '') {
            err = true
            setConfirmPassWordErrText('Please fill this field')
        }

        if (confirmPassword !== password) {
            err = true
            setConfirmPassWordErrText('Confirm password does not match')
        }

        if (err) return

        setLoading(true)

        try {

            const res = await authApi.signup({
                username, password, confirmPassword
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
                if (e.path === "confirmPassword") {
                    setConfirmPassWordErrText(e.msg)
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
                onSubmit={handleSignup}
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
                    id="password"
                    label="Password"
                    name="password"
                    type="password"
                    disabled={loading}
                    error={passwordErrText !== ""}
                    helperText={passwordErrText}
                    onChange={() => {
                        setPassWordErrText('')
                    }}
                />
                <TextField
                    margin="normal"
                    size="small"
                    fullWidth
                    required
                    type="password"
                    id="confirmPassword"
                    label="Confirm Password"
                    name="confirmPassword"
                    disabled={loading}
                    error={confirmPasswordErrText !== ""}
                    helperText={confirmPasswordErrText}
                    onChange={() => {
                        setConfirmPassWordErrText('')
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
                    Signup
                </LoadingButton>
                <Button
                    component={Link}
                    to='/login'
                    sx={{ textTransform: 'none' }}
                >
                    Already have an account? Login
                </Button>
            </Box>
        </>
    )
}

export default Signup