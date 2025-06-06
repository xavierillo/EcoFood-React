import { db } from "./firebase";
import { collection,
    setDoc,
    getDocs,
    updateDoc,
    query,
    where,
    deleteDoc,
    doc,
    orderBy,
    limit,
    startAt,
    endAt,
    startAfter
} from "firebase/firestore";

export const getProductosByEmpresa = async (empresaId) => {
    const q = query(collection(db, "productos"), where("empresaId", "==", empresaId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
};

export const addProducto = async (producto) => {
    const ref = doc(collection(db, "productos")); // genera ID
    const productoConId = { ...producto, id: ref.id };
    await setDoc(ref, productoConId);
};


export const deleteProducto = async (id) => await deleteDoc(doc(db, "productos", id));

export const updateProducto = async (id, data) => {
    const ref = doc(db, "productos", id);
    await updateDoc(ref, data);
};

const PAGE_SIZE = 3;

export const buscarProductosPorNombre = async (empresaId, nombre, lastDoc = null) => {
    let q = query(
        collection(db, "productos"),
        where("empresaId", "==", empresaId),
        orderBy("nombre"),
        startAt(nombre),
        endAt(nombre + "\uf8ff"),
        limit(PAGE_SIZE)
    );

    if (lastDoc) {
        q = query(q, startAfter(lastDoc));
    }

    const snapshot = await getDocs(q);
    const productos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const lastVisible = snapshot.docs[snapshot.docs.length - 1];

    return { productos, lastVisible };
};


export const obtenerProductosPagina = async (empresaId, cursor = null) => {
    let ref = collection(db, "productos");
    let q = query(ref, where("empresaId", "==", empresaId), orderBy("nombre"), limit(PAGE_SIZE));

    if (cursor) {
        q = query(ref, where("empresaId", "==", empresaId), orderBy("nombre"), startAfter(cursor), limit(PAGE_SIZE));
    }

    const snapshot = await getDocs(q);
    const productos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const lastVisible = snapshot.docs[snapshot.docs.length - 1];

    return { productos, lastVisible };
};
