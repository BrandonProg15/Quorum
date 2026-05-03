import { useEffect, useState } from 'react'
import supabase from '../supabaseClient'
import { useNavigate } from 'react-router-dom'
import CrearGrupo from './CrearGrupo'

function Inicio() {
    const navigate = useNavigate()
    const [grupos, setGrupos] = useState([])
    const [mostrarModal, setMostrarModal] = useState(false)

    useEffect(() => {
        cargarGrupos()
    }, [])

    async function cargarGrupos() {
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            navigate('/')
            return
        }

        const { data, error } = await supabase
            .from('usuario_grupo')
            .select('id_grupo, grupo(*)')
            .eq('id_usuario', user.id)

        if (error) return
        setGrupos(data)
    }

    return (
        <>
            <h1>Grupos</h1>
            <button onClick={() => setMostrarModal(true)}>+</button>

            {grupos.map((item) => (
                <button key={item.id_grupo} className="grupo-item" onClick={() => navigate(`/grupo/${item.id_grupo}`)}>
                    {item.grupo.nombre} {item.grupo.descripcion}
                </button>
            ))}

            <button>inicio</button>
            <button>recomendaciones</button>
            <button className="boton-configuracion" onClick={() => navigate('/configuracion')}>configuracion</button>

            {mostrarModal && (
                <div className="modal-overlay" onClick={() => setMostrarModal(false)}>
                    <div className="modal-contenido" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => setMostrarModal(false)}>X</button>
                        <CrearGrupo
                            onGrupoCreado={() => {
                                setMostrarModal(false)
                                cargarGrupos()
                            }}
                        />
                    </div>
                </div>
            )}
        </>
    )
}

export default Inicio