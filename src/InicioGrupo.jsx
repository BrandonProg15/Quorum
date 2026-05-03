import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import supabase from '../supabaseClient'

function InicioGrupo() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [evento, setEvento] = useState(null)

    useEffect(() => {
        traerEvento()
    }, [])

    async function traerEvento() {
        const { data, error } = await supabase
            .from('evento')
            .select('*')
            .eq('id_grupo', id)
            .gt('fecha_hora_inicio', new Date().toISOString())
            .order('fecha_hora_inicio', { ascending: true })
            .limit(1)
            .single()

        if (error) return
        setEvento(data)
    }

    return (
        <div>
            <h1>Próximas juntadas</h1>
            {evento ? (
                <div>
                    <h2>{evento.nombre}</h2>
                </div>
            ) : (
                <p>No hay juntadas próximas</p>
            )}
            <button onClick={() => navigate(`/proponer-juntada/${id}`)}>
                Proponer Juntada
            </button>
        </div>
    )
}

export default InicioGrupo