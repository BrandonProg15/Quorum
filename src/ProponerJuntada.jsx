import { useState } from 'react'
import supabase from '../supabaseClient'

function ProponerJuntada({ idGrupo, onCreado }) {
    const [nombreJuntada, setNombreJuntada] = useState('')
    const [fechaHora, setFechaHora] = useState('')
    const [opciones, setOpciones] = useState([])

    const agregarFecha = () => {
        if (!fechaHora) return
        if (opciones.includes(fechaHora)) return
        setOpciones([...opciones, fechaHora])
        setFechaHora('')
    }
    const eliminarFecha = (fecha) => {
        setOpciones(opciones.filter((f) => f !== fecha))
    }

    const manejarSubmit = async (e) => {
        e.preventDefault()
        if (opciones.length === 0) return

        const { data: encuesta, error } = await supabase
            .from('encuesta')
            .insert({
                tipo: 'horario',
                pregunta: nombreJuntada,
            })
            .select()
            .single()

        if (error) {
            alert('Error al crear la encuesta')
            return
        }

        for (const fecha of opciones) {
            await supabase.from('opcion_encuesta').insert({
                id_encuesta: encuesta.id,
                descripcion: fecha
            })
        }

        onCreado()
    }

    return (
        <form onSubmit={manejarSubmit}>
            <h2>Proponer juntada</h2>

            <label>Nombre de la juntada</label>
            <input
                type="text"
                placeholder="Nombre de la juntada"
                value={nombreJuntada}
                onChange={(e) => setNombreJuntada(e.target.value)}
                required
            />

            <label>Posibles fechas y horarios</label>
            <input
                type="datetime-local"
                value={fechaHora}
                onChange={(e) => setFechaHora(e.target.value)}
            />
            <button type="button" onClick={agregarFecha}>Añadir</button>

            {opciones.length > 0 && (
                <ul>
                    {opciones.map((o) => (
                        <li key={o}>
                            {o}
                            <button type="button" onClick={() => eliminarFecha(o)}>X</button>
                        </li>
                    ))}
                </ul>
            )}


             <button type="submit" key={id} className="grupo-item" onClick={() => navigate(`/votaciones/${id}`)}>
                    Crear encuesta
                </button>
        </form>
    )
}

export default ProponerJuntada