import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { getProductosByEmpresa, addProducto, updateProducto, deleteProducto, obtenerProductosPagina } from "../../services/productoService";
import Swal from "sweetalert2";

export default function AdminProductos() {
    const { userData } = useAuth();
    const [productos, setProductos] = useState([]);
    const [formData, setFormData] = useState({ nombre: "", descripcion: "", precio: 0, vencimiento: "", id: null });
    const [showModal, setShowModal] = useState(false);

    const [pagina, setPagina] = useState(0);


    useEffect(() => {
        cargarPagina(); // carga la primera página
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const abrirModal = (producto = null) => {
        if (producto) {
            setFormData({ ...producto });
        } else {
            setFormData({ nombre: "", descripcion: "", precio: 0, vencimiento: "", id: null });
        }
        console.log(producto);
        setShowModal(true);
    };

    const guardarProducto = async (e) => {
        e.preventDefault();
        if (formData.id) {
            await updateProducto(formData.id, formData);
            Swal.fire("Actualizado correctamente", "", "success");
        } else {
            await addProducto({ ...formData, empresaId: userData.uid });
            Swal.fire("Agregado correctamente", "", "success");
        }
        const nuevos = await getProductosByEmpresa(userData.uid);
        setProductos(nuevos);
        setShowModal(false);
    };

    const eliminar = async (id) => {
        const confirm = await Swal.fire({ title: "¿Eliminar producto?", showCancelButton: true });
        if (confirm.isConfirmed) {
            await deleteProducto(id);
            const nuevos = await getProductosByEmpresa(userData.uid);
            setProductos(nuevos);
        }
    };


    const [historial, setHistorial] = useState([]);
    const [sinMas, setSinMas] = useState(false);

    const cargarPagina = async (adelante = true) => {
        let cursor = null;
        if (adelante && pagina > 0) {
            cursor = historial[pagina - 1] || null;
        } else if (!adelante && pagina > 1) {
            cursor = historial[pagina - 2] || null;
        }

        const { productos, lastVisible } = await obtenerProductosPagina(userData.uid, cursor);

        setProductos(productos);

        if (adelante) {
            setHistorial(prev => [...prev, lastVisible]);
            setPagina(p => p + 1);
            setSinMas(productos.length < 5);
        } else {
            setPagina(p => p - 1);
        }
    };


    return (
        <div className="container mt-4">
            <h3>Gestión de Productos</h3>
            <button className="btn btn-primary mb-3" onClick={() => abrirModal()}>Agregar Producto</button>
            {/* <button className="btn btn-secondary mb-3" onClick={cargarProductos}>Refresh</button>


            <form className="d-flex mb-3" onSubmit={(e) => { e.preventDefault(); cargarProductos(); }}>
                <input className="form-control me-2" type="search" placeholder="Buscar nombre" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
                <button className="btn btn-outline-success" type="submit">Buscar</button>
            </form> */}

            <ul className="list-group mb-3">
            {productos.map((p, i) => (
                <li key={i} className="list-group-item d-flex justify-content-between align-items-center">
                    {p.nombre} - ${p.precio}
                    <div>
                        <button className="btn btn-warning btn-sm me-2" onClick={() => abrirModal(p)}>Editar</button>
                        <button className="btn btn-danger btn-sm" onClick={() => eliminar(p.id)}>Eliminar</button>
                    </div>
                </li>
            ))}
            </ul>

            <nav>
            <ul className="pagination">
                <li className={`page-item ${pagina <= 1 ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => cargarPagina(false)}>Anterior</button>
                </li>
                <li className={`page-item ${sinMas ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => cargarPagina(true)}>Siguiente</button>
                </li>
            </ul>
            </nav>



            {showModal && (
                <div className="modal show d-block" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{formData.id ? "Editar" : "Agregar"} Producto</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <form onSubmit={guardarProducto}>
                                <div className="modal-body">
                                    <input className="form-control mb-2" placeholder="Nombre" value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} />
                                    <textarea className="form-control mb-2" placeholder="Descripción" value={formData.descripcion} onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}></textarea>
                                    <input type="number" className="form-control mb-2" placeholder="Precio" value={formData.precio} onChange={(e) => setFormData({ ...formData, precio: e.target.value })} />
                                    <input type="date" className="form-control" value={formData.vencimiento} onChange={(e) => setFormData({ ...formData, vencimiento: e.target.value })} />
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cerrar</button>
                                    <button type="submit" className="btn btn-success">Guardar</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

