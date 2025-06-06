import { db, secondaryAuth } from "./firebase";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import {
    collection, query, where, getDocs, addDoc,
    updateDoc, deleteDoc, setDoc, doc
} from "firebase/firestore";


export const getEmpresas = async () => {
    const q = query(collection(db, "usuarios"), where("tipo", "==", "empresa"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const addEmpresa = async (EmpresaData) => {
    return await addDoc(collection(db, "usuarios"), {
        ...EmpresaData,
        tipo: "empresa"
    });
};

export const updateEmpresa = async (id, EmpresaData) => {
    const ref = doc(db, "usuarios", id);
    return await updateDoc(ref, EmpresaData);
};

export const deleteEmpresa = async (id) => {
    const ref = doc(db, "usuarios", id);
    return await deleteDoc(ref);
};

export const registrarEmpresaConAuth = async (datos) => {
    try {
        const cred = await createUserWithEmailAndPassword(secondaryAuth, datos.email, datos.password);
        await sendEmailVerification(cred.user);

        await setDoc(doc(db, "usuarios", cred.user.uid), {
            nombre: datos.nombre || "",
            comuna: datos.comuna || "",
            direccion: datos.direccion || "",
            tipo: datos.tipo || "empresa",
            email: datos.email || ""
        });

        await secondaryAuth.signOut();
        return cred;
    } catch (error) {
        console.error("Error registrando Empresa:", error);
        throw error;
    }
};
