import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import supabase from '../supabaseClient'

function Votaciones() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [opciones, setOpciones] = useState([])
    const [encuesta, setEncuesta] = useState(null)

    useEffect(() => {
        cargarEncuesta()
    }, [])

    async function cargarEncuesta() {
        const { data: { user } } = await supabase.auth.getUser()
        setUsuario(user)

        const { data: encuestaData, error } = await supabase
            .from('encuesta')
            .select(`
                *,
                opcion_encuesta (
                    *,
                    voto (*)
                )
            `)
            .eq('id_grupo', id)
            .eq('activa', true)

        if (error) return
        setEncuestas(encuestasData)
        const { data: votosData } = await supabase
            .from('voto')
            .select('id_opcion')
            .eq('id_usuario', user.id)

        setVotosUsuario(votosData.map(v => v.id_opcion))
        async function votar(idOpcion) {
            if (votosUsuario.includes(idOpcion)) return 

            await supabase.from('voto').insert({
                id_usuario: usuario.id,
                id_opcion: idOpcion
            })

            setVotosUsuario([...votosUsuario, idOpcion])
            cargarDatos() 
        }

        return (
            <div>
                <h1>Votación juntada</h1>
                {encuestas.map((encuesta) => (
                    <div key={encuesta.id}>
                        <h2>{encuesta.tipo === 'horario' ? 'Fecha y horario' : 'Lugar'}</h2>
                        {encuesta.opcion_encuesta.map((opcion) => (
                            <div key={opcion.id} onClick={() => votar(opcion.id)}>
                                <p>{opcion.descripcion}</p>
                                <p>Votado por: {opcion.voto.length}</p>
                                <span>{votosUsuario.includes(opcion.id) ? '✓' : '○'}</span>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        )
    }


}

export default Votaciones