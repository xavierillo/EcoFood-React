import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getUserData } from "../services/userService";
import CardProducto from '../components/CardProducto';
import CerrarSesion from "../components/CerrarSesion";

export default function Home() {
    const { user } = useAuth();
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const fetch = async () => {
            try {
                const data = await getUserData(user.uid);
                setUserData(data);
            } catch (error) {
                console.error(error);
            }
        };

        if (user) fetch();
    }, [user]);

    if (!userData) return <p>Cargando datos...</p>;

    return (
        <div className="container mt-5">
            <h2>Bienvenido a EcoFood</h2>
            <p><strong>Nombre:</strong> {userData.nombre}</p>
            <p><strong>Tipo de Usuario:</strong> {userData.tipo}</p>
            <h1>Productos Disponibles</h1>
            <CardProducto nombre="Pan Integral" precio="$500" />
            <CardProducto nombre="Pan normal" precio="$300" />
            <CerrarSesion />
        </div>
    );
}