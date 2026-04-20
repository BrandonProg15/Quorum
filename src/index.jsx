import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './index.css'

function Index() {
    const navigate = useNavigate()

    return (
        <>
            <section className="intro">

                <img src="../public/img/Logos/Isologo.png" className="logo_intro"></img>
                <h1>Quórum</h1>
                <p>Juntarse como nunca antes</p>
                <section className="botones_intro">
                    <button className="btn-login" onClick={() => navigate('/log-in')}>
                        Iniciar sesión
                    </button>
                    <button className="btn-register" onClick={() => navigate('/sign-up')}>
                        Registrarse
                    </button>
                </section>
            </section>

        </>
    )
}

export default Index
