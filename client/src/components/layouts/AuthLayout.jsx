import assets from '../../assets'

import { useState, useEffect } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import authUtils from "../../utils/authUtils"

import { Container, Box } from "@mui/material"
import Loading from '../common/Loading'

const AuthLayout = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)

    useEffect(() => {

        const checkAuth = async () => {
            const isAuthen = await authUtils.isAuthenticated()
            if (!isAuthen) setLoading(false)
            else navigate('/')
        }

        checkAuth()

    }, [navigate])


    return (
        loading ? (
            <Loading fullHeight />
        )
            :
            (
                <Container component='main' maxWidth='xs'>
                    <Box
                        sx={{
                            marginTop: 8,
                            display: 'flex',
                            alignItems: 'center',
                            flexDirection: 'column'
                        }}
                    >
                        <img src={assets.images.logoDark} style={{ width: '100px' }} alt='app logo' />
                        <Outlet />
                    </Box>
                </Container>
            )
    )
}

export default AuthLayout