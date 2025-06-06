import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  getEmpresas,
  registrarEmpresaConAuth,
  updateEmpresa,
  deleteEmpresa
} from "../../services/empresaFirebase";

export default function AdminEmpresas() {
    const [Empresas, setEmpresas] = useState([]);
    const [EmpresaActivo, setEmpresaActivo] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ nombre: "", email: "", comuna: "", password : ""});

    const cargarEmpresas = async () => {
        const data = await getEmpresas();
        setEmpresas(data);
    };

    const guardar = async () => {
        if (EmpresaActivo) {
            await updateEmpresa(EmpresaActivo.id, formData);
        } else {
            await registrarEmpresaConAuth(formData);
        }

        setShowModal(false);
        cargarEmpresas();
    };

    const eliminar = async (id) => {
        const result = await Swal.fire({
            title: "¿Eliminar Empresa?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí",
        });
        if (result.isConfirmed) {
            await deleteEmpresa(id);
            cargarEmpresas();
        }
    };

    useEffect(() => {
        cargarEmpresas();
    }, []);

    return (
        <div className="container mt-4">
            <h3>Empresas Registrados</h3>
            <button className="btn btn-primary" onClick={() => { setEmpresaActivo(null); setShowModal(true); }}>Nuevo Empresa</button>
            <table className="table mt-3">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Comuna</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {Empresas.map((c) => (
                        <tr key={c.id}>
                        <td>{c.nombre}</td>
                        <td>{c.email}</td>
                        <td>{c.comuna}</td>
                        <td>
                            <button className="btn btn-warning btn-sm" onClick={() => { setEmpresaActivo(c); setFormData(c); setShowModal(true); }}>Editar</button>
                            <button className="btn btn-danger btn-sm" onClick={() => eliminar(c.id)}>Eliminar</button>
                        </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showModal && (
                <div className="modal d-block" tabIndex="-1">
                <div className="modal-dialog">
                    <div className="modal-content">
                    <div className="modal-header"><h5 className="modal-title">{EmpresaActivo ? "Editar Empresa" : "Nuevo Empresa"}</h5></div>
                    <div className="modal-body">
                        <input className="form-control mb-2" placeholder="Nombre" value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} />
                        <input className="form-control mb-2" placeholder="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                        <input className="form-control mb-2" placeholder="Comuna" value={formData.comuna} onChange={(e) => setFormData({ ...formData, comuna: e.target.value })} />
                        <input type="password" className="form-control mb-2" placeholder="Contraseña"
                        value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />

                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                        <button className="btn btn-success" onClick={guardar}>Guardar</button>
                    </div>
                    </div>
                </div>
                </div>
            )}
        </div>
    );
}
