import { useState } from 'react'
import supabase from '../supabaseClient'

function CrearGrupo({ onGrupoCreado }) {
    const [nombreGrupo, setNombreGrupo] = useState('')
    const [foto, setFoto] = useState(null)
    const [miembroUsername, setMiembroUsername] = useState('')
    const [miembros, setMiembros] = useState([])
    const [errorMiembro, setErrorMiembro] = useState('')

    const agregarMiembro = async () => {
        if (!miembroUsername.trim()) return

        if (miembros.includes(miembroUsername.trim())) {
            setErrorMiembro('Ese usuario ya fue agregado')
            return
        }

        const { data: usuarioEncontrado } = await supabase
            .from('usuario')
            .select('id')
            .eq('username', miembroUsername.trim())
            .single()

        if (!usuarioEncontrado) {
            setErrorMiembro('El usuario no existe')
            return
        }

        setErrorMiembro('')
        setMiembros([...miembros, miembroUsername.trim()])
        setMiembroUsername('')
    }

    const manejarSubmit = async (e) => {
        e.preventDefault()

        const { data: { user } } = await supabase.auth.getUser()

        const { data: grupo, error } = await supabase
            .from('grupo')
            .insert({
                nombre: nombreGrupo,
                id_creador: user.id
            })
            .select()
            .single()

        if (error) {
            alert('Error al crear grupo')
            return
        }

        await supabase.from('usuario_grupo').insert({
            id_usuario: user.id,
            id_grupo: grupo.id,
            rol: 'admin'
        })

        for (const username of miembros) {
            const { data: usuarioEncontrado } = await supabase
                .from('usuario')
                .select('id')
                .eq('username', username)
                .single()

            await supabase.from('usuario_grupo').insert({
                id_usuario: usuarioEncontrado.id,
                id_grupo: grupo.id,
                rol: 'miembro'
            })
        }

        onGrupoCreado()
    }

    return (
        <form onSubmit={manejarSubmit}>
            <h2>Crear grupo</h2>

            <label>Nombre del grupo</label>
            <input
                type="text"
                placeholder="Nombre del grupo"
                value={nombreGrupo}
                onChange={(e) => setNombreGrupo(e.target.value)}
                required
            />

            <label>Foto del grupo (Opcional)</label>
            <input
                type="file"
                accept="image/*"
                onChange={(e) => setFoto(e.target.files[0])}
            />

            <label>Miembros</label>
            <input
                type="text"
                placeholder="Username del miembro"
                value={miembroUsername}
                onChange={(e) => {
                    setMiembroUsername(e.target.value)
                    setErrorMiembro('')
                }}
            />
            <button type="button" onClick={agregarMiembro}>Añadir</button>
            {errorMiembro && <p>{errorMiembro}</p>}

            {miembros.length > 0 && (
                <ul>
                    {miembros.map((m) => (
                        <li key={m}>@{m}</li>
                    ))}
                </ul>
            )}

            <button type="submit">Crear grupo</button>
        </form>
    )
}

export default CrearGrupo