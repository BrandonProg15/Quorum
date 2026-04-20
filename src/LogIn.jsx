import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import supabase from '../supabaseClient'
import "./index.css"

function LogIn() {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [mensaje, setMensaje] = useState('')
    const [cargando, setCargando] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setCargando(true)
        setMensaje('')

        const { error } = await supabase.auth.signInWithPassword({ email, password })

        if (error) {
            setMensaje('Error: ' + error.message)
        } else {
            navigate('/inicio')
        }

        setCargando(false)
    }

    const handleGoogle = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo: 'http://localhost:5173/inicio' }
        })
        if (error) setMensaje('Error: ' + error.message)
    }

    return (
        <section className="inicio_sesion">
            <h1>Iniciar sesión</h1>

            <form className="formulario_inicio" onSubmit={handleSubmit}>
                <section className="mail">
                    <p>
                        <img src="../public/img/Iconos/envelope.svg" id="icono_mail" />
                        Mail
                    </p>
                    <input
                        type="email"
                        id="mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </section>

                <section className="contra">
                    <p>
                        <img src="../public/img/Iconos/lock.svg" id="icono_contra"/>
                        Contraseña
                    </p>
                    <input
                        type="password"
                        id="nombre"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </section>
            </form>

                <button className="boton_inicio" id = "btn-login" type="submit" disabled={cargando}>
                    {cargando ? 'Iniciando sesión...' : 'Continuar'}
                </button>
            <span className="separador">o</span>

            <button className="boton_google" type="button" onClick={handleGoogle}>
                <img src="../public/img/Logos/google.webp" width="20" height="20" alt="Google" />
                Continuar con Google
            </button>

            {mensaje && <p className="mensaje_error">{mensaje}</p>}
        </section>
    )
}

export default LogIn