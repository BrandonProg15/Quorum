import { useState } from 'react'
import supabase from '../supabaseClient'
import { useNavigate } from 'react-router-dom'
import "./index.css"

function SignUp() {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [username, setUsername] = useState('')
    const [mensaje, setMensaje] = useState('')
    const [cargando, setCargando] = useState(false)
    const [paso, setPaso] = useState(1)
    const [nombre, setNombre] = useState('')
    const [apellido, setApellido] = useState('')
    const [fechaCumpleaños, setFechaCumpleaños] = useState('')
    const [direccion, setDireccion] = useState('')
    const [fotoPerfil, setFotoPerfil] = useState('')
    const [aceptaTerminos, setAceptaTerminos] = useState(false)

    const handleRegister = async () => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { username, nombre, apellido }
            }
        })

        if (error) {
            setMensaje('Error: ' + error.message)
            return
        }

        const { error: errorPerfil } = await supabase
            .from('usuario')
            .insert({
                id: data.user.id,
                username,
                nombre,
                apellido,
                cumpleanos: fechaCumpleaños || null,
            })

        if (errorPerfil) {
            setMensaje('Error al crear perfil: ' + errorPerfil.message)
            return
        }

        navigate('/inicio')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setCargando(true)
        setMensaje('')
        await handleRegister()
        setCargando(false)
    }

    const handleContinuar = (e) => {
        e.preventDefault()
        setPaso(paso + 1)
    }

    const handleGoogle = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo: 'http://localhost:5173/inicio' }
        })
        if (error) setMensaje('Error: ' + error.message)
    }

    // ── Paso 1: email, usuario, contraseña ──────────────────────────────────
    if (paso === 1) {
        return (
            <section className="registro">
                <h1>Registrarse</h1>

                <form className="formulario_registro" onSubmit={handleContinuar}>
                    <section className="mail">
                        <p>
                            <img src="../public/img/Iconos/envelope.svg" id="icono_mail" alt="Mail" />
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

                    <section className="nombre_usuario">
                        <p>
                            <img src="../public/img/Iconos/user.svg" id="icono_user" alt="Usuario" />
                            Nombre de usuario
                        </p>
                        <input
                            type="text"
                            id="nombre_usuario"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </section>

                    <section className="contra">
                        <p>
                            <img src="../public/img/Iconos/lock.svg" id="icono_contra" alt="Contraseña" />
                            Contraseña
                        </p>
                        <input
                            type="password"
                            id="contra"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </section>

                    <p>
                        <input
                            type="checkbox"
                            name="checkbox_registro"
                            checked={aceptaTerminos}
                            onChange={(e) => setAceptaTerminos(e.target.checked)}
                            required
                        />
                        He leído y acepto los Términos y Condiciones
                    </p>
                </form>

                    <button className="boton_inicio" id="btn-login" type="submit">
                        Continuar
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

    // ── Paso 2: nombre y apellido ───────────────────────────────────────────
    if (paso === 2) {
        return (
            <section className="registro">
                <h1>Registrarse</h1>

                <form className="formulario_registro" onSubmit={handleContinuar}>
                    <section className="nombre_campo">
                        <p>Nombre</p>
                        <input
                            type="text"
                            id="nombre"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            required
                        />
                    </section>

                    <section className="apellido_campo">
                        <p>Apellido</p>
                        <input
                            type="text"
                            id="apellido"
                            value={apellido}
                            onChange={(e) => setApellido(e.target.value)}
                            required
                        />
                    </section>

                    <button className="boton_inicio" type="submit" disabled={cargando}>
                        {cargando ? 'Cargando...' : 'Continuar'}
                    </button>
                </form>
            </section>
        )
    }

    // ── Paso 3: fecha, dirección, foto ──────────────────────────────────────
    if (paso === 3) {
        return (
            <section className="registro_p2">
                <h1>Registrarse</h1>

                <form className="formulario_registro_p2" onSubmit={handleSubmit}>
                    <section className="nacimiento">
                        <p>Fecha de nacimiento</p>
                        <input
                            type="date"
                            id="fecha_nacimiento"
                            value={fechaCumpleaños}
                            onChange={(e) => setFechaCumpleaños(e.target.value)}
                        />
                    </section>

                    <section className="direccion">
                        <p>Dirección</p>
                        <input
                            type="text"
                            id="direccion"
                            value={direccion}
                            onChange={(e) => setDireccion(e.target.value)}
                        />
                    </section>

                    <section className="img_perfil">
                        <p>Foto de perfil</p>
                        <input
                            type="file"
                            id="imagen"
                            accept="image/*"
                            onChange={(e) => setFotoPerfil(e.target.files[0])}
                        />
                    </section>

                    <button className="boton_inicio" type="submit" disabled={cargando}>
                        {cargando ? 'Creando cuenta...' : 'Continuar'}
                    </button>

                    <button
                        className="ahora_no"
                        type="button"
                        onClick={() => navigate('/inicio')}
                    >
                        Ahora no
                    </button>

                    {mensaje && <p className="mensaje_error">{mensaje}</p>}
                </form>
            </section>
        )
    }
}

export default SignUp