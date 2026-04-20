import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import supabase from '../supabaseClient'

function Configuracion() {
    const navigate = useNavigate()
    const [usuario, setUsuario] = useState(null)

    useEffect(() => {
        cargarUsuario()
    }, [])

    async function cargarUsuario() {
        const { data: { user } } = await supabase.auth.getUser()

        const { data, error } = await supabase
            .from('usuario')
            .select('nombre, apellido, username')
            .eq('id', user.id)
            .single()

        if (error) return
        setUsuario(data)
    }

    const handleCerrarSesion = async () => {
        await supabase.auth.signOut()
        navigate('/')
    }

    return (
        <div>
            {usuario && (
                <div>
                    <p>{usuario.nombre} {usuario.apellido}</p>
                    <p>@{usuario.username}</p>
                </div>
            )}

            <button onClick={() => navigate('/conexiones')}>Conexiones</button>
            <button onClick={() => navigate('/idioma')}>Idioma</button>
            <button onClick={() => navigate('/tema')}>Tema</button>
            <button onClick={() => navigate('/terminos')}>Términos y Condiciones</button>
            <button onClick={() => navigate('/privacidad')}>Política de Privacidad</button>
            <button onClick={() => navigate('/aviso-legal')}>Aviso Legal</button>
            <button onClick={() => navigate('/faq')}>Preguntas Frecuentes (FAQs)</button>
            <button onClick={() => navigate('/sobre-nosotros')}>Sobre nosotros</button>
            <button onClick={handleCerrarSesion}>Cerrar sesión</button>

            <p>Copyright © 2026 - Quórum</p>
            <p>Versión 1.0.0</p>
        </div>
    )
}

export default Configuracion