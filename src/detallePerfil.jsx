import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import supabase from '../supabaseClient'

function DetallePerfil() {

    const { id } = useParams()
    const [usuario, setUsuario] = useState(null)
    const [editando, setEditando] = useState(false)
    const [form, setForm] = useState(null)

    useEffect(() => {
        traerPerfil()
    }, [])

    async function traerPerfil() {
        const { data: { user } } = await supabase.auth.getUser()

        const { data, error } = await supabase
            .from('usuario')
            .select('*')
            .eq('id', id)

        if (error) return

        setUsuario({ ...data[0], email: user.email })
        setForm({ ...data[0], email: user.email })
    }

    async function guardarCambios() {
        try {
            let urlImagen = form.foto_perfil

            if (form.foto_perfil instanceof File) {
                const file = form.foto_perfil
                const fileExt = file.name.split('.').pop()
                const fileName = `${id}.${fileExt}`

                const { data: uploadData, error: uploadError } = await supabase
                    .storage
                    .from('avatars')
                    .upload(fileName, file, { upsert: true })

                console.log('UPLOAD DATA:', uploadData)
                console.log('UPLOAD ERROR:', uploadError)

                if (uploadError) {
                    alert(uploadError.message)
                    return
                }
                const { data } = supabase
                    .storage
                    .from('avatars')
                    .getPublicUrl(fileName)

                urlImagen = data.publicUrl
            }

            const { error } = await supabase
                .from('usuario')
                .update({
                    username: form.username,
                    nombre: form.nombre,
                    apellido: form.apellido,
                    cumpleanos: form.cumpleanos,
                    foto_perfil: urlImagen,
                    direccion: form.direccion
                })
                .eq('id', id)

            if (error) return

            if (form.email !== usuario.email) {
                await supabase.auth.updateUser({
                    email: form.email
                })
            }

            setEditando(false)
            traerPerfil()

        } catch (err) { }
    }

    if (!usuario || !form) {
        return <div>Cargando perfil...</div>
    }

    return (
        <div className="detalle-usuario-page">
            <div className="campo-fila">
                {editando ? (
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setForm({ ...form, foto_perfil: e.target.files[0] })}
                    />
                ) : (
                    usuario.foto_perfil
                        ? <img src={usuario.foto_perfil} alt="foto" />
                        : <p>Sin imagen</p>
                )}
            </div>

            <div className="detalle-usuario-campos">

                <div className="campo-fila">
                    <span className="campo-label">Username</span>
                    {editando ? (
                        <input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
                    ) : (
                        <p className="campo-valor">{usuario.username}</p>
                    )}
                </div>

                <div className="campo-fila">
                    <span className="campo-label">Nombre</span>
                    {editando ? (
                        <input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
                    ) : (
                        <p className="campo-valor">{usuario.nombre}</p>
                    )}
                </div>

                <div className="campo-fila">
                    <span className="campo-label">Direccion</span>
                    {editando ? (
                        <input value={form.direccion} onChange={(e) => setForm({ ...form, direccion: e.target.value })} />
                    ) : (
                        <p className="campo-valor">{usuario.direccion}</p>
                    )}
                </div>

                <div className="campo-fila">
                    <span className="campo-label">Mail</span>
                    {editando ? (
                        <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                    ) : (
                        <p className="campo-valor">{usuario.email}</p>
                    )}
                </div>

                <div className="campo-fila">
                    <span className="campo-label">Apellido</span>
                    {editando ? (
                        <input value={form.apellido} onChange={(e) => setForm({ ...form, apellido: e.target.value })} />
                    ) : (
                        <p className="campo-valor">{usuario.apellido}</p>
                    )}
                </div>

                <div className="campo-fila">
                    <span className="campo-label">Cumpleaños</span>
                    {editando ? (
                        <input
                            type="date"
                            value={form.cumpleanos || ''}
                            onChange={(e) => setForm({ ...form, cumpleanos: e.target.value })}
                        />
                    ) : (
                        <p className="campo-valor">{usuario.cumpleanos || 'Sin fecha'}</p>
                    )}
                </div>


            </div>

            <div className="detalle-producto-acciones">
                {editando ? (
                    <button className="btn btn-primary" onClick={guardarCambios}>Guardar</button>
                ) : (
                    <button className="btn btn-secondary" onClick={() => setEditando(true)}>Editar</button>
                )}
            </div>

        </div>
    )
}

export default DetallePerfil